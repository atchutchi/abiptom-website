import { test, expect } from '@playwright/test'

test.describe('Accessibility', () => {
  test('should have skip links', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByRole('link', { name: 'Pular para o conteúdo principal' })).toHaveAttribute('href', '#main-content')
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    
    // Deve ter h1
    const h1 = page.locator('h1')
    await expect(h1.first()).toBeVisible()
    
    // Deve ter h2s
    const h2 = page.locator('h2')
    await expect(h2.first()).toBeVisible()
  })

  test('should have alt text on images', async ({ page }) => {
    await page.goto('/')
    
    // Verificar se imagens têm alt text
    const images = page.locator('img')
    const count = await images.count()
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      expect(alt).not.toBeNull()
    }
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')
    
    // Navegar com Tab
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    await expect.poll(async () => {
      return page.evaluate(() => document.activeElement?.tagName || '')
    }).not.toBe('')
  })

  test('should have proper aria labels', async ({ page }) => {
    await page.goto('/')
    
    // Verificar se seções têm aria-labelledby
    const servicesSection = page.locator('section[aria-labelledby="services-heading"]')
    await expect(servicesSection).toBeVisible()
  })
})
