# 🔄 Guia de Configuração de Webhooks - Rebuild Automático

Este guia explica como configurar webhooks para rebuild automático quando você publicar conteúdo no Contentful.

## 🎯 O Que São Webhooks?

Webhooks permitem que o Contentful notifique seu site automaticamente quando:
- ✅ Um post é **publicado**
- ✅ Um post é **despublicado**
- ✅ Um post é **deletado**

Isso aciona um rebuild/revalidação automática do site!

## 🚀 Configuração Rápida

### Opção 1: Script Automático (Recomendado)

**Pré-requisitos:**
- `CONTENTFUL_SPACE_ID` configurado em `.env.local`
- `CMA_TOKENS` configurado em `.env.local`

```bash
# Rodar o script de configuração
npx tsx scripts/setup-contentful-webhook.ts
```

O script vai:
1. ✅ Conectar ao Contentful
2. ✅ Criar webhook automático
3. ✅ Configurar filtros (apenas blogPost)
4. ✅ Definir URL do webhook

Pronto! 🎉

---

### Opção 2: Configuração Manual

Se preferir fazer manualmente no Contentful:

#### 1. Acessar Webhooks

1. Vá para https://app.contentful.com
2. Selecione seu Space "Abiptom Blog"
3. **Settings** → **Webhooks**
4. Clique em **Add webhook**

#### 2. Configurar Webhook

**General:**
- **Name:** `ABIPTOM Auto Deploy`
- **URL:** `https://abiptom.gw/api/contentful-webhook`
  - ⚠️ Se estiver testando localmente: `http://localhost:3000/api/contentful-webhook`

**Triggers:**
Marque as opções:
- ✅ `Entry.publish`
- ✅ `Entry.unpublish`
- ✅ `Entry.delete`

**Filters (Opcional mas Recomendado):**
```json
{
  "sys.contentType.sys.id": {
    "equals": "abiptomBlog"
  }
}
```

Isso garante que apenas mudanças em Blog Posts disparem o webhook.

#### 3. Headers (Opcional)

Para maior segurança, adicione:
- **Key:** `x-webhook-secret`
- **Value:** Um secret aleatório (guarde-o!)

#### 4. Salvar

Clique em **Save**

---

## 🔐 Adicionar Variáveis de Ambiente

Adicione no `.env.local`:

```bash
# Webhook Security
CONTENTFUL_WEBHOOK_SECRET=seu_secret_aqui
REVALIDATE_SECRET=outro_secret_aleatorio

# Site URL (produção)
NEXT_PUBLIC_SITE_URL=https://abiptom.gw
```

**Gerar secrets aleatórios:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## 🌐 Deploy em Produção (Vercel)

### 1. Configurar Variáveis na Vercel

1. Acesse https://vercel.com/
2. Selecione seu projeto
3. **Settings** → **Environment Variables**
4. Adicione:
   - `CONTENTFUL_SPACE_ID`
   - `CONTENTFUL_ACCESS_TOKEN`
   - `CONTENTFUL_ENVIRONMENT`
   - `CONTENTFUL_WEBHOOK_SECRET`
   - `REVALIDATE_SECRET`
   - `CMA_TOKENS`

### 2. Deploy

```bash
git add .
git commit -m "feat: Add Contentful webhooks"
git push origin main
```

A Vercel vai fazer deploy automaticamente!

### 3. Atualizar Webhook URL

Após o deploy, atualize a URL do webhook no Contentful:
- De: `http://localhost:3000/api/contentful-webhook`
- Para: `https://abiptom.gw/api/contentful-webhook`

---

## 🧪 Testar Webhook

### 1. Teste Manual no Contentful

1. Vá em **Settings** → **Webhooks**
2. Clique no webhook criado
3. Vá na aba **Activity log**
4. Clique em **Trigger test call**
5. Verifique se recebeu **200 OK**

### 2. Teste Real

1. Abra um blog post no Contentful
2. Faça uma pequena mudança
3. Clique em **Publish**
4. Aguarde 30-60 segundos
5. Verifique se o site foi atualizado

### 3. Ver Logs (Desenvolvimento)

```bash
npm run dev
```

No terminal você verá:
```
📝 Contentful Webhook received: {...}
📰 Blog post updated: Seu Título
✅ Revalidation triggered
```

---

## 📊 Como Funciona?

```
┌─────────────┐
│ Contentful  │
│  (Publicar) │
└──────┬──────┘
       │
       │ HTTP POST
       ▼
┌─────────────────────────┐
│ /api/contentful-webhook │
│  - Valida assinatura    │
│  - Processa evento      │
│  - Dispara revalidação  │
└──────┬──────────────────┘
       │
       │ Chama
       ▼
┌─────────────────┐
│ /api/revalidate │
│  - Revalida ISR │
│  - Limpa cache  │
└─────────────────┘
       │
       ▼
    🎉 Site Atualizado!
```

---

## 🐛 Troubleshooting

### "Webhook failed with 401"
- ✅ Verifique se `CONTENTFUL_WEBHOOK_SECRET` está correto
- ✅ Confira se está configurado tanto no Contentful quanto no `.env.local`

### "Webhook succeeded but site not updated"
- ✅ Verifique se `REVALIDATE_SECRET` está configurado
- ✅ Confira se `NEXT_PUBLIC_SITE_URL` está correto
- ✅ Aguarde 1-2 minutos (pode haver delay)

### "Cannot POST /api/contentful-webhook"
- ✅ Verifique se o arquivo `app/api/contentful-webhook/route.ts` existe
- ✅ Faça rebuild: `npm run build`
- ✅ Restart do servidor: `npm run dev`

### Webhook não dispara
- ✅ Verifique os filtros (deve ser `abiptomBlog`, não `blogPost`)
- ✅ Confira se o webhook está **ativo** no Contentful
- ✅ Veja o Activity Log no Contentful para detalhes

### Teste local com ngrok

Para testar webhooks localmente:

```bash
# 1. Instalar ngrok
npm install -g ngrok

# 2. Rodar servidor local
npm run dev

# 3. Expor localmente (em outro terminal)
ngrok http 3000

# 4. Use a URL do ngrok no webhook do Contentful
# Ex: https://abc123.ngrok.io/api/contentful-webhook
```

---

## 🔄 Alternativa: Deploy Hook da Vercel

Se preferir rebuild completo ao invés de revalidação:

### 1. Obter Deploy Hook

1. Vercel Dashboard → Seu Projeto
2. **Settings** → **Git**
3. Scroll até **Deploy Hooks**
4. Clique em **Create Hook**
   - Name: `Contentful Deploy`
   - Branch: `main`
5. Copie a URL gerada

### 2. Adicionar no Contentful

1. **Settings** → **Webhooks** → **Add webhook**
2. **Name:** `Vercel Deploy`
3. **URL:** Cole a URL do deploy hook
4. **Triggers:** `Entry.publish`, `Entry.unpublish`, `Entry.delete`
5. **Save**

**Pronto!** Agora cada publicação vai disparar um build completo.

⚠️ **Nota:** Deploy completo é mais lento (2-3 min) vs revalidação ISR (instantâneo).

---

## 📝 Checklist Final

Antes de ir para produção:

- [ ] Webhook configurado no Contentful
- [ ] URL do webhook apontando para produção
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Teste de publicação funcionando
- [ ] Activity log mostrando 200 OK
- [ ] Site atualizando em 1-2 minutos após publicar

---

## 🎓 Boas Práticas

1. **Use revalidação ISR** (mais rápido que rebuild completo)
2. **Configure secrets** para segurança
3. **Monitore Activity Log** do Contentful regularmente
4. **Teste antes de produção** usando ngrok
5. **Documente** qualquer customização

---

## 📚 Recursos

- [Contentful Webhooks Docs](https://www.contentful.com/developers/docs/webhooks/)
- [Next.js ISR Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating)
- [Vercel Deploy Hooks](https://vercel.com/docs/deployments/deploy-hooks)

---

**🎉 Parabéns! Seu blog agora atualiza automaticamente quando você publica no Contentful!** 🚀

