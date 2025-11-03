import { defineConfig, devices } from '@playwright/test'

/**
 * Configuração do Playwright para testes E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  /* Rodar testes em paralelo */
  fullyParallel: true,
  
  /* Falhar o build CI se você acidentalmente deixou test.only no código */
  forbidOnly: !!process.env.CI,
  
  /* Retry em CI apenas */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out de testes paralelos em CI */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter para usar */
  reporter: 'html',
  
  /* Configurações compartilhadas para todos os projetos */
  use: {
    /* URL base para usar em ações como `await page.goto('/')` */
    baseURL: 'http://localhost:3000',
    
    /* Coletar trace em retry */
    trace: 'on-first-retry',
    
    /* Screenshot apenas em falhas */
    screenshot: 'only-on-failure',
  },

  /* Configurar projetos para major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Rodar seu servidor local antes de iniciar os testes */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})

