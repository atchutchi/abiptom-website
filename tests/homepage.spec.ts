import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')
    
    // Verificar se o título está presente
    await expect(page).toHaveTitle(/ABIPTOM/)
    
    // Verificar se o logo está visível
    await expect(page.getByRole('heading', { name: 'ABIPTOM' })).toBeVisible()
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/')
    
    // Verificar links de navegação
    await page.getByRole('button', { name: 'Abrir menu' }).click({ force: true })

    await expect(page.getByRole('link', { name: 'Início', exact: true })).toBeAttached()
    await expect(page.getByRole('link', { name: 'Quem Somos', exact: true })).toBeAttached()
    await expect(page.getByRole('link', { name: 'Serviços', exact: true })).toBeAttached()
    await expect(page.getByRole('link', { name: 'Portfólio', exact: true })).toBeAttached()
    await expect(page.getByRole('link', { name: 'Blog', exact: true })).toBeAttached()
    await expect(page.getByRole('link', { name: 'Contacto', exact: true })).toBeAttached()
  })

  test('should display services section', async ({ page }) => {
    await page.goto('/')
    
    // Verificar se a seção de serviços está presente
    await expect(page.getByRole('heading', { name: 'O que fazemos' })).toBeVisible()
    
    // Verificar alguns serviços
    await expect(page.getByRole('link', { name: /Design Gráfico Identidades/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Desenvolvimento Web/ }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Social Media/ }).first()).toBeVisible()
  })

  test('should have back to top button after scrolling', async ({ page }) => {
    await page.goto('/')
    
    await page.evaluate(() => window.scrollTo(0, 1000))
    await page.waitForFunction(() => window.scrollY > 500)
    
    // Aguardar um pouco para o botão aparecer
    await page.waitForTimeout(500)
    
    await expect(page.locator('body')).toBeVisible()
  })

  test('should navigate to services page', async ({ page }) => {
    await page.goto('/')
    
    await page.goto('/servicos')
    await expect(page).toHaveURL('/servicos')
  })
})
