# 🎭 Guia de Testes E2E com Playwright

Este documento explica como rodar e criar testes end-to-end usando Playwright.

## 🚀 Primeiros Passos

### Rodar Todos os Testes

```bash
npx playwright test
```

### Rodar em Modo UI (Interativo)

```bash
npx playwright test --ui
```

### Rodar Apenas um Arquivo

```bash
npx playwright test tests/homepage.spec.ts
```

### Rodar em Modo Debug

```bash
npx playwright test --debug
```

### Ver Relatório HTML

```bash
npx playwright show-report
```

## 📁 Estrutura de Testes

```
tests/
├── homepage.spec.ts       # Testes da página inicial
├── contact.spec.ts        # Testes do formulário de contato
├── services.spec.ts       # Testes das páginas de serviços
└── accessibility.spec.ts  # Testes de acessibilidade
```

## ✍️ Criar Novo Teste

### Template Básico

```typescript
import { test, expect } from '@playwright/test'

test.describe('Minha Funcionalidade', () => {
  test('deve fazer algo específico', async ({ page }) => {
    // Navegar para a página
    await page.goto('/minha-pagina')
    
    // Verificar algo
    await expect(page.getByRole('heading', { name: 'Título' })).toBeVisible()
    
    // Interagir com a página
    await page.click('text=Botão')
    
    // Verificar resultado
    await expect(page).toHaveURL('/outra-pagina')
  })
})
```

## 🔍 Seletores Comuns

### Por Texto
```typescript
page.getByText('Fale conosco')
page.locator('text=Fale conosco')
```

### Por Role
```typescript
page.getByRole('button', { name: 'Enviar' })
page.getByRole('link', { name: 'Início' })
page.getByRole('heading', { name: 'Título' })
```

### Por Label
```typescript
page.getByLabel('Nome')
page.getByLabel('Email')
```

### Por Placeholder
```typescript
page.getByPlaceholder('Digite seu nome')
```

### CSS Selector
```typescript
page.locator('.classe')
page.locator('#id')
page.locator('button[type="submit"]')
```

## 🎯 Ações Comuns

### Navegar
```typescript
await page.goto('/servicos')
await page.goBack()
await page.goForward()
```

### Clicar
```typescript
await page.click('text=Botão')
await page.getByRole('button').click()
await page.locator('.btn').click()
```

### Preencher Formulário
```typescript
await page.fill('input[name="nome"]', 'João Silva')
await page.fill('input[type="email"]', 'joao@exemplo.com')
await page.fill('textarea', 'Minha mensagem')
```

### Selecionar
```typescript
await page.selectOption('select', 'valor')
await page.check('input[type="checkbox"]')
await page.uncheck('input[type="checkbox"]')
```

### Scroll
```typescript
await page.evaluate(() => window.scrollTo(0, 1000))
await page.locator('#elemento').scrollIntoViewIfNeeded()
```

### Aguardar
```typescript
await page.waitForTimeout(1000) // 1 segundo
await page.waitForURL('/nova-pagina')
await page.waitForLoadState('networkidle')
```

## ✅ Asserções Comuns

### Visibilidade
```typescript
await expect(page.getByText('Texto')).toBeVisible()
await expect(page.getByText('Texto')).toBeHidden()
```

### Conteúdo
```typescript
await expect(page).toHaveTitle(/ABIPTOM/)
await expect(page).toHaveURL('/servicos')
await expect(page.getByRole('heading')).toHaveText('Título')
await expect(page.locator('.item')).toHaveCount(5)
```

### Atributos
```typescript
await expect(page.locator('a')).toHaveAttribute('href', '/link')
await expect(page.locator('input')).toHaveValue('valor')
await expect(page.locator('button')).toBeDisabled()
await expect(page.locator('button')).toBeEnabled()
```

## 📸 Screenshots e Vídeos

### Tirar Screenshot
```typescript
await page.screenshot({ path: 'screenshot.png' })
await page.screenshot({ path: 'screenshot.png', fullPage: true })
```

### Habilitar Vídeo

Em `playwright.config.ts`:
```typescript
use: {
  video: 'on-first-retry',
  screenshot: 'only-on-failure',
}
```

## 🎭 Emular Dispositivos

### Mobile
```typescript
test.use({
  ...devices['iPhone 12']
})

test('deve funcionar no mobile', async ({ page }) => {
  // Teste aqui
})
```

### Tablet
```typescript
test.use({
  ...devices['iPad Pro']
})
```

## 🌐 Testar em Múltiplos Navegadores

Os testes rodam automaticamente em:
- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)
- Mobile Chrome
- Mobile Safari

Para testar apenas um:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 🐛 Debug

### Modo Debug
```bash
npx playwright test --debug
```

### Console Logs
```typescript
page.on('console', msg => console.log(msg.text()))
```

### Pausar Execução
```typescript
await page.pause() // Abre o Playwright Inspector
```

## 📊 CI/CD (GitHub Actions)

Exemplo `.github/workflows/test.yml`:
```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## 🎓 Boas Práticas

1. **Use data-testid quando necessário**
```html
<button data-testid="submit-button">Enviar</button>
```
```typescript
await page.getByTestId('submit-button').click()
```

2. **Agrupe testes relacionados**
```typescript
test.describe('Formulário de Contato', () => {
  test('validação', async ({ page }) => {})
  test('envio bem-sucedido', async ({ page }) => {})
})
```

3. **Use hooks para setup**
```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/login')
  // Login comum a todos os testes
})
```

4. **Evite waitForTimeout**
Use waiters específicos quando possível

5. **Teste o caminho feliz e casos de erro**

## 📚 Recursos

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [Selectors Guide](https://playwright.dev/docs/selectors)

