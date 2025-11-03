import { test, expect } from '@playwright/test'

test.describe('Services Pages', () => {
  test('should load services overview page', async ({ page }) => {
    await page.goto('/servicos')
    
    // Verificar se a página de serviços carregou
    await expect(page.getByRole('heading', { name: /serviços/i })).toBeVisible()
  })

  test('should navigate to design grafico page', async ({ page }) => {
    await page.goto('/servicos')
    
    // Clicar no card de Design Gráfico
    await page.click('text=Design Gráfico')
    
    // Verificar se navegou para a página correta
    await expect(page).toHaveURL('/servicos/design-grafico')
    
    // Verificar breadcrumbs
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible()
  })

  test('should load desenvolvimento web page', async ({ page }) => {
    await page.goto('/servicos/desenvolvimento-web')
    
    // Verificar título
    await expect(page.getByRole('heading', { name: 'Desenvolvimento Web' })).toBeVisible()
    
    // Verificar breadcrumbs
    await expect(page.getByText('Serviços')).toBeVisible()
    
    // Verificar se tecnologias estão visíveis
    await expect(page.getByText('JavaScript')).toBeVisible()
    await expect(page.getByText('React')).toBeVisible()
  })

  test('should have working CTA buttons', async ({ page }) => {
    await page.goto('/servicos/design-grafico')
    
    // Verificar se há botão de CTA
    const ctaButton = page.getByRole('link', { name: /contacto|fale conosco/i })
    await expect(ctaButton).toBeVisible()
  })
})

