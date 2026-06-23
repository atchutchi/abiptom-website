import { expect, test } from '@playwright/test'

test.describe('mobile layout', () => {
  test('home page does not create horizontal page overflow', async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('preloaded', 'true'))
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)

    const dimensions = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
    }))

    expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth)
  })
})
