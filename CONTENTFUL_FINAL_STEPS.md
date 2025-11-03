# 🎯 Passos Finais - Contentful Rebuild Automático

## ✅ O Que Já Foi Feito

1. ✅ Conta Contentful criada
2. ✅ Space "Abiptom Blog" criado (ID: oeysvixeol45)
3. ✅ Content Model "abiptomBlog" criado com todos os campos
4. ✅ API keys configuradas no `.env.local`
5. ✅ CMA Token configurado

## 🚀 AGORA: Configure o Webhook Automático

### Passo 1: Adicionar Secrets no .env.local

Abra `.env.local` e adicione estas duas linhas:

```bash
# Webhook Security (gere valores aleatórios)
CONTENTFUL_WEBHOOK_SECRET=gere_um_valor_aleatorio_aqui
REVALIDATE_SECRET=outro_valor_aleatorio_aqui
```

**Como gerar valores aleatórios:**

Windows PowerShell:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Ou use: `abc123xyz789` (temporário para desenvolvimento)

### Passo 2: Rodar o Script de Configuração

```bash
npm run contentful:webhook
```

Isso vai:
- ✅ Conectar ao Contentful automaticamente
- ✅ Criar o webhook
- ✅ Configurar para disparar em: publish, unpublish, delete
- ✅ Filtrar apenas posts do tipo "abiptomBlog"

**Você verá:**
```
🚀 Configurando webhook no Contentful...
✅ Webhook criado com sucesso!
🎉 Configuração concluída!
```

### Passo 3: Testar o Webhook

#### 1. Criar um Post de Teste no Contentful

1. Acesse https://app.contentful.com/spaces/oeysvixeol45/entries
2. Clique em **Add entry** → **abiptomBlog**
3. Preencha os campos:
   - **Title:** Meu Primeiro Post de Teste
   - **Slug:** primeiro-post-teste
   - **Excerpt:** Resumo do post de teste
   - **Content:** Conteúdo completo aqui
   - **Cover Image:** Upload uma imagem
   - **Author:** Seu Nome
   - **Publish Date:** Hoje
   - **Featured:** Sim
4. Clique em **Publish**

#### 2. Verificar no Terminal

Com `npm run dev` rodando, você verá:

```
📝 Contentful Webhook received: {...}
📰 Blog post updated: Meu Primeiro Post de Teste
✅ Revalidation triggered
```

#### 3. Ver no Contentful (Activity Log)

1. Vá em **Settings** → **Webhooks**
2. Clique no webhook criado
3. Vá na aba **Activity log**
4. Você deve ver chamadas com **Status: 200**

### Passo 4: Migrar Posts Existentes

Você tem 1 post existente para migrar:

**Post: Branding UNIDO e AMAE**

1. **No Contentful:**
   - Add entry → abiptomBlog
   - **Title (PT):** Concluímos com Sucesso o Projeto de Branding para 21 Marcas de Mulheres Empreendedoras na Guiné-Bissau
   - **Slug:** branding-unido-amae-guine-bissau
   - **Excerpt (PT):** Em colaboração com a UNIDO e a AMAE, desenvolvemos identidades visuais e um catálogo completo para 21 marcas lideradas por mulheres empreendedoras.
   - **Content (PT):** (Copiar do arquivo `lib/data/blog-posts.ts`)
   - **Cover Image:** Upload `/public/images/blog/reuniao-com-unido-e-amae-branding.jpg`
   - **Author:** Equipe ABIPTOM
   - **Publish Date:** 2024-03-15
   - **Categories:** Branding, Cases de Sucesso
   - **Tags:** UNIDO, AMAE, Empreendedorismo Feminino
   - **Featured:** ✅ Sim

2. **Traduzir para Inglês:**
   - No dropdown de idioma (canto superior direito), selecione **English**
   - Traduza os campos:
     - Title (EN)
     - Excerpt (EN)
     - Content (EN)
   - Clique em **Publish**

---

## 🌐 Deploy em Produção (Vercel)

### 1. Configurar Variáveis na Vercel

Acesse: https://vercel.com/dashboard

1. Selecione seu projeto
2. **Settings** → **Environment Variables**
3. Adicione (copie do seu `.env.local`):
   - `CONTENTFUL_SPACE_ID` = oeysvixeol45
   - `CONTENTFUL_ACCESS_TOKEN` = (seu token)
   - `CONTENTFUL_ENVIRONMENT` = master
   - `CONTENTFUL_PREVIEW_ACCESS_TOKEN` = (seu preview token)
   - `CONTENTFUL_WEBHOOK_SECRET` = (seu secret)
   - `REVALIDATE_SECRET` = (seu secret)
   - `CMA_TOKENS` = (seu CMA token)
   - `NEXT_PUBLIC_SITE_URL` = https://abiptom.gw

### 2. Fazer Deploy

```bash
git add .
git commit -m "feat: Add Contentful CMS with auto-rebuild webhooks"
git push origin master
```

### 3. Atualizar Webhook URL

Após o deploy:

1. Vá em **Settings** → **Webhooks** no Contentful
2. Edite o webhook
3. Mude a URL de:
   - `http://localhost:3000/api/contentful-webhook`
   - Para: `https://abiptom.gw/api/contentful-webhook`
4. **Save**

### 4. Testar em Produção

1. Publique um post no Contentful
2. Aguarde 30-60 segundos
3. Acesse `https://abiptom.gw/blog`
4. Verifique se o post aparece! 🎉

---

## 📋 Checklist Final

Antes de considerar completo:

- [ ] Webhook configurado (`npm run contentful:webhook`)
- [ ] Post de teste criado e publicado
- [ ] Webhook disparou (verificar Activity Log)
- [ ] Post existente migrado para Contentful
- [ ] Tradução EN adicionada
- [ ] Variáveis configuradas na Vercel
- [ ] Deploy feito
- [ ] Webhook URL atualizada para produção
- [ ] Teste em produção funcionando

---

## 🐛 Troubleshooting Rápido

### Script falha com "401"
```bash
# Verifique se CMA_TOKENS está correto no .env.local
echo $env:CMA_TOKENS  # PowerShell
```

### Webhook não dispara
1. Verifique Activity Log no Contentful
2. Confira se o servidor está rodando (`npm run dev`)
3. Teste a URL: `http://localhost:3000/api/contentful-webhook`

### Post não aparece no site
1. Certifique-se de que está **Published** (não Draft)
2. Aguarde 1-2 minutos (pode haver delay)
3. Limpe cache do navegador (Ctrl+Shift+R)

---

## 🎉 Pronto!

Agora você tem:
- ✅ CMS completo no Contentful
- ✅ Rebuild automático quando publicar
- ✅ Suporte multilíngue (PT/EN)
- ✅ Preview antes de publicar
- ✅ Imagens otimizadas
- ✅ Rich text com formatação

**Workflow de publicação:**
1. Escrever post no Contentful
2. Clicar em Publish
3. Aguardar 1 minuto
4. Site atualizado! 🚀

---

## 📚 Documentação Relacionada

- `SETUP_CONTENTFUL.md` - Setup inicial
- `SETUP_WEBHOOKS.md` - Detalhes de webhooks
- `README_IMPROVEMENTS.md` - Visão geral de todas as melhorias

**Dúvidas? Consulte `SETUP_WEBHOOKS.md` para troubleshooting detalhado!**

