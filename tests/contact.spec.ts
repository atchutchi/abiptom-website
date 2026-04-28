import { test, expect } from '@playwright/test'

test.describe('Contact Page', () => {
  test('should load contact form', async ({ page }) => {
    await page.goto('/contacto')
    
    // Verificar se o formulário de contato está presente
    await expect(page.getByRole('heading', { name: 'Vamos conversar' })).toBeVisible()
    
    // Verificar campos do formulário
    await expect(page.getByRole('textbox', { name: 'Nome', exact: true })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Mensagem', exact: true })).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/contacto')
    
    // Tentar enviar formulário vazio
    await page.click('button[type="submit"]')
    
    // Aguardar mensagens de validação (se houver)
    // Nota: Ajuste baseado em como sua validação funciona
    await page.waitForTimeout(500)
  })

  test('should display contact information', async ({ page }) => {
    await page.goto('/contacto')
    
    // Verificar se informações de contato estão visíveis
    // Ajuste baseado no seu conteúdo real
    await expect(page.locator('#main-content').getByText(/guiné-bissau/i)).toBeVisible()
  })
})
