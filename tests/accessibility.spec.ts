import { test, expect } from '@playwright/test'

test.describe('Accessibility', () => {
  test('should have skip links', async ({ page }) => {
    await page.goto('/')
    
    // Focar no primeiro elemento (geralmente skip link)
    await page.keyboard.press('Tab')
    
    // Verificar se skip link está focado
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toHaveAttribute('href', '#main-content')
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    
    // Deve ter h1
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    
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
      expect(alt).toBeTruthy()
    }
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')
    
    // Navegar com Tab
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Verificar se algum elemento está focado
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should have proper aria labels', async ({ page }) => {
    await page.goto('/')
    
    // Verificar se seções têm aria-labelledby
    const servicesSection = page.locator('section[aria-labelledby="services-heading"]')
    await expect(servicesSection).toBeVisible()
  })
})

