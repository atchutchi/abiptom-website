import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')
    
    // Verificar se o título está presente
    await expect(page).toHaveTitle(/ABIPTOM/)
    
    // Verificar se o logo está visível
    await expect(page.getByText('ABIPTOM')).toBeVisible()
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/')
    
    // Verificar links de navegação
    await expect(page.getByRole('link', { name: 'Início' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Quem Somos' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Serviços' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Portfólio' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Blog' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Contacto' })).toBeVisible()
  })

  test('should display services section', async ({ page }) => {
    await page.goto('/')
    
    // Verificar se a seção de serviços está presente
    await expect(page.getByRole('heading', { name: 'Transformamos ideias em realidade digital' })).toBeVisible()
    
    // Verificar alguns serviços
    await expect(page.getByText('Design Gráfico')).toBeVisible()
    await expect(page.getByText('Desenvolvimento Web')).toBeVisible()
    await expect(page.getByText('Social Media')).toBeVisible()
  })

  test('should have back to top button after scrolling', async ({ page }) => {
    await page.goto('/')
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 1000))
    
    // Aguardar um pouco para o botão aparecer
    await page.waitForTimeout(500)
    
    // Verificar se o botão "Back to Top" está visível
    const backToTopButton = page.locator('button[aria-label="Voltar ao topo"]')
    await expect(backToTopButton).toBeVisible()
  })

  test('should navigate to services page', async ({ page }) => {
    await page.goto('/')
    
    // Clicar no link de serviços
    await page.click('text=Ver todos os serviços')
    
    // Verificar se navegou para a página correta
    await expect(page).toHaveURL('/servicos')
  })
})

