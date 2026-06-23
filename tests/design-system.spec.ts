import { expect, test } from '@playwright/test'

test.describe('ABIPTOM design system', () => {
  test('uses Barlow for body and Barlow Condensed for headings', async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('preloaded', 'true'))
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const fonts = await page.evaluate(() => {
      const heading = document.querySelector('h1')

      return {
        body: getComputedStyle(document.body).fontFamily,
        heading: heading ? getComputedStyle(heading).fontFamily : '',
      }
    })

    expect(fonts.body).toContain('Barlow')
    expect(fonts.heading).toContain('Barlow Condensed')
  })
})
