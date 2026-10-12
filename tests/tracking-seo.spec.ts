import { test, expect } from '@playwright/test'

test('um estudo de caso mostra conteúdo sem esperar pelo JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  try {
    await page.goto('http://localhost:3000/portfolio/apgb', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('article h1')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Visitar o website', exact: true })).toBeVisible()
    expect(await page.locator('article h1').evaluate(element => {
      const rect = element.getBoundingClientRect()
      const topElement = document.elementFromPoint(rect.left + 4, rect.top + 4)
      return topElement === element || element.contains(topElement)
    })).toBe(true)
  } finally {
    await context.close()
  }
})

test('os estudos de caso têm páginas próprias, capturas e contacto contextual', async ({ page, request }) => {
  for (const slug of ['dacosta-music', 'apgb', 'santos-global-group']) {
    await page.goto(`/portfolio/${slug}`)
    await expect(page.locator('article h1')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'O resultado verificável', exact: true })).toHaveCount(1)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.abiptom.gw/portfolio/${slug}`)
    const image = page.locator('figure img')
    await image.scrollIntoViewIfNeeded()
    await expect(image).toBeVisible()
    await expect.poll(() => image.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
    await expect(page.getByRole('link', { name: 'Pedir um orçamento', exact: true })).toHaveAttribute('href', '/contacto')
    await expect(page.getByRole('link', { name: 'Falar sobre uma solução semelhante', exact: true })).toHaveAttribute('href', /wa\.me\/245966865331\?text=/)
    const schema = JSON.parse(await page.locator('article script[type="application/ld+json"]').innerText())
    expect(schema['@type']).toBe('CreativeWork')
    expect(schema.citation.length).toBeGreaterThan(0)
  }
  expect((await request.get('/portfolio/projecto-inexistente')).status()).toBe(404)
})

test.beforeEach(async ({ page }) => {
  // Nenhum teste envia medições a contas reais.
  await page.route(/https:\/\/.*(facebook\.com|facebook\.net|google-analytics\.com|googletagmanager\.com).*/, route => route.fulfill({ status: 200, body: '' }))
})

test('o Analytics só arranca após consentimento e envia visitas sem parâmetros pessoais', async ({ page }) => {
  test.skip(process.env.NEXT_PUBLIC_GA_MANUAL_MEASUREMENT_READY !== '1', 'O ambiente de teste não ativou a medição GA4 manual.')
  await page.goto('/portfolio/apgb?email=teste@example.invalid#contacto')
  await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(0)
  await page.getByRole('button', { name: 'Aceitar medição', exact: true }).click()
  await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(1)
  const commands = await page.evaluate(() => (window.dataLayer || []).map(command => Array.from(command as ArrayLike<unknown>)))
  const config = commands.find(command => command[0] === 'config')
  expect(config?.[1]).toBe(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)
  expect(config?.[2]).toMatchObject({ send_page_view: false, allow_google_signals: false })
  const visits = commands.filter(command => command[0] === 'event' && command[1] === 'page_view')
  expect(visits).toHaveLength(1)
  expect(visits[0][2]).toMatchObject({ page_location: `${new URL(page.url()).origin}/portfolio/apgb` })
  expect(JSON.stringify(commands)).not.toContain('teste@example.invalid')
})

test('recusar não carrega o Pixel e a escolha pode ser alterada', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Recusar medição', exact: true })).toBeVisible()
  expect(await page.locator('script[src*="fbevents.js"]').count()).toBe(0)
  await page.getByRole('button', { name: 'Recusar medição', exact: true }).click()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Recusar medição', exact: true })).toHaveCount(0)
  expect(await page.locator('script[src*="fbevents.js"]').count()).toBe(0)
  await page.getByRole('button', { name: 'Preferências de cookies', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Aceitar medição', exact: true })).toBeVisible()
})

test('o consentimento já expirado volta a pedir uma escolha e bloqueia o SDK', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('abiptom.measurement.v1', JSON.stringify({ version: 1, accepted: true, savedAt: Date.now() - 181 * 86400000 }))
  })
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Recusar medição', exact: true })).toBeVisible()
  await expect(page.locator('script[src*="fbevents.js"]')).toHaveCount(0)
})

test('o Pixel mede uma visita por rota apenas depois do consentimento', async ({ page }) => {
  await page.addInitScript(() => {
    ;(window as any).pixelCalls = []
    ;(window as any).fbq = (...args: unknown[]) => (window as any).pixelCalls.push(args)
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Aceitar medição', exact: true }).click()
  await expect.poll(() => page.evaluate(() => (window as any).pixelCalls.filter((c: unknown[]) => c.includes('PageView')).length)).toBe(1)
  await page.locator('#main-content a[href="/contacto"]').first().click()
  await expect(page).toHaveURL(/\/contacto$/)
  await expect.poll(() => page.evaluate(() => (window as any).pixelCalls.filter((c: unknown[]) => c.includes('PageView')).length)).toBe(2)
  await page.getByRole('button', { name: 'Preferências de cookies', exact: true }).click()
  await page.getByRole('button', { name: 'Recusar medição', exact: true }).click()
  await expect(page.locator('script[src*="fbevents.js"]')).toHaveCount(0)
})

test('as páginas têm canonicals próprios e o sitemap inclui os serviços reais', async ({ page, request }) => {
  await page.goto('/contacto')
  await expect(page).toHaveTitle(/Contacto.*ABIPTOM/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.abiptom.gw/contacto')
  const response = await request.get('/sitemap.xml')
  const xml = await response.text()
  expect(xml).toContain('/servicos/desenvolvimento-web')
  expect(xml).not.toContain('/servicos/web-design')
  expect(xml).not.toContain('<lastmod>')
})

test('o carregamento do SDK respeita o consentimento e a política de segurança', async ({ page }) => {
  let sdkRequests = 0
  await page.route('https://connect.facebook.net/en_US/fbevents.js', route => {
    sdkRequests++
    return route.fulfill({ contentType: 'application/javascript', body: `
      window.pixelCalls = window.fbq.queue.slice();
      window.fbq.callMethod = function() { window.pixelCalls.push(Array.from(arguments)); };
      window.fbq.queue = [];
    ` })
  })
  const response = await page.goto('/')
  expect((await response!.allHeaders())['content-security-policy']).toContain('https://connect.facebook.net')
  expect(sdkRequests).toBe(0)
  await page.getByRole('button', { name: 'Aceitar medição', exact: true }).click()
  await expect.poll(() => sdkRequests).toBe(1)
  await expect.poll(() => page.evaluate(() => (window as any).pixelCalls?.filter((c: unknown[]) => c.includes('PageView')).length)).toBe(1)
  const calls = await page.evaluate(() => (window as any).pixelCalls)
  expect(calls).toContainEqual(['init', '2017555742213828'])
})

test('um contacto recusado pela API não conta como lead', async ({ page }) => {
  await page.addInitScript(() => {
    ;(window as any).pixelCalls = []
    ;(window as any).fbq = (...args: unknown[]) => (window as any).pixelCalls.push(args)
  })
  await page.route('**/api/contact', route => route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ error: 'Falha de teste' }) }))
  await page.goto('/contacto')
  await page.getByRole('button', { name: 'Aceitar medição', exact: true }).click()
  await page.locator('#firstName').fill('Pessoa')
  await page.locator('#lastName').fill('Teste')
  await page.locator('#email').fill('test@example.test')
  await page.locator('#phone').fill('966865331')
  await page.locator('#subject').fill('Orçamento de teste')
  await page.locator('#message').fill('Pedido simulado sem envio externo.')
  const solveCaptcha = async () => {
    const label = await page.locator('label[for="captcha"]').innerText()
    const match = label.match(/(\d+)\s*([+x-])\s*(\d+)/i)!
    const a = Number(match[1]), b = Number(match[3])
    await page.locator('#captcha').fill(String(match[2] === '+' ? a + b : match[2] === '-' ? a - b : a * b))
  }
  await solveCaptcha()
  await page.locator('form button[type="submit"]').click()
  await expect(page.locator('#main-content').getByText('Falha de teste', { exact: true })).toBeVisible()
  expect(await page.evaluate(() => (window as any).pixelCalls.filter((c: unknown[]) => c.includes('Lead')).length)).toBe(0)
  await page.route('**/api/contact', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }))
  await page.locator('form button[type="submit"]').click()
  await expect.poll(() => page.evaluate(() => (window as any).pixelCalls.filter((c: unknown[]) => c.includes('Lead')).length)).toBe(1)
  const calls = await page.evaluate(() => JSON.stringify((window as any).pixelCalls))
  expect(calls).not.toContain('test@example.test')
  expect(calls).not.toContain('966865331')
})
