import { test, expect } from '@playwright/test'

test.describe('Services Pages', () => {
  test('should load services overview page', async ({ page }) => {
    await page.goto('/servicos')
    
    // Verificar se a página de serviços carregou
    await expect(page.getByRole('heading', { name: 'Soluções que transformam' })).toBeVisible()
  })

  test('should navigate to design grafico page', async ({ page }) => {
    await page.goto('/servicos')
    
    await page.goto('/servicos/design-grafico')
    await expect(page).toHaveURL('/servicos/design-grafico')
    await expect(page.locator('h1').filter({ hasText: /Design\s+Gráfico/ })).toBeVisible()
  })

  test('should load desenvolvimento web page', async ({ page }) => {
    await page.goto('/servicos/desenvolvimento-web')
    
    // Verificar título
    await expect(page.getByRole('heading', { name: 'Desenvolvimento Web' })).toBeVisible()
    
    // Verificar breadcrumbs
    await expect(page.getByRole('link', { name: 'Serviços', exact: true }).first()).toBeVisible()
    
    // Verificar se tecnologias estão visíveis
    await expect(page.getByText('JavaScript', { exact: true })).toBeVisible()
    await expect(page.getByText('React', { exact: true })).toBeVisible()
  })

  test('should have working CTA buttons', async ({ page }) => {
    await page.goto('/servicos/design-grafico')
    
    // Verificar se há botão de CTA
    const ctaButton = page.getByRole('link', { name: /contacto|fale conosco/i })
    await expect(ctaButton).toBeVisible()
  })
})
