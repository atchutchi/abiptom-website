# 📝 Guia de Configuração do Contentful CMS

Este documento explica como configurar e usar o Contentful para gerenciar o blog.

## 🚀 Setup Inicial

### 1. Criar Conta no Contentful

1. Acesse [contentful.com](https://www.contentful.com/)
2. Crie uma conta gratuita
3. Crie um novo Space (ex: "ABIPTOM Blog")

### 2. Obter Credenciais

1. Vá em **Settings** → **API keys**
2. Clique em **Add API key**
3. Copie:
   - **Space ID**
   - **Content Delivery API - access token**
   - **Content Preview API - access token** (opcional)

### 3. Configurar .env.local

Adicione as credenciais no arquivo `.env.local`:

```bash
CONTENTFUL_SPACE_ID=seu_space_id_aqui
CONTENTFUL_ACCESS_TOKEN=seu_access_token_aqui
CONTENTFUL_ENVIRONMENT=master
```

## 📋 Criar Content Model

### Content Type: Blog Post

1. Vá em **Content model** → **Add content type**
2. Nome: **Blog Post**
3. API Identifier: **blogPost**

### Fields (Campos):

| Field Name | Field ID | Type | Validations |
|------------|----------|------|-------------|
| Title | title | Short text | Required |
| Slug | slug | Short text | Required, Unique |
| Excerpt | excerpt | Long text | Required |
| Content | content | Rich text | Required |
| Cover Image | coverImage | Media (Image) | Required |
| Author | author | Short text | Required |
| Publish Date | publishDate | Date & time | Required |
| Categories | categories | Short text, list | - |
| Tags | tags | Short text, list | - |
| Featured | featured | Boolean | - |

### Criar os Fields:

1. Click em **Add field**
2. Selecione o tipo
3. Configure o nome e ID
4. Adicione validações se necessário
5. Salve

## 📝 Adicionar Conteúdo

### Criar Primeiro Post

1. Vá em **Content** → **Add entry**
2. Selecione **Blog Post**
3. Preencha todos os campos:
   - **Title**: Título do post
   - **Slug**: URL amigável (ex: `meu-primeiro-post`)
   - **Excerpt**: Resumo curto
   - **Content**: Conteúdo completo (Rich Text)
   - **Cover Image**: Upload da imagem de capa
   - **Author**: Nome do autor
   - **Publish Date**: Data de publicação
   - **Categories**: Ex: `Branding`, `Web Design`
   - **Tags**: Ex: `tutorial`, `dicas`
   - **Featured**: Marque se quiser destaque
4. Clique em **Publish**

## 🔄 Migração de Posts Existentes

Os posts atuais em `lib/data/blog-posts.ts` precisam ser migrados manualmente:

### Post 1: Branding UNIDO e AMAE
- **Title**: Concluímos com Sucesso o Projeto de Branding...
- **Slug**: `branding-unido-amae-guine-bissau`
- **Excerpt**: Em colaboração com a UNIDO e a AMAE...
- **Content**: (copiar do arquivo TypeScript)
- **Cover Image**: `/images/blog/reuniao-com-unido-e-amae-branding.jpg`
- **Categories**: `Branding`, `Cases de Sucesso`
- **Tags**: `UNIDO`, `AMAE`, `Empreendedorismo Feminino`

## 🛠️ Usar no Código

### Buscar Todos os Posts

```typescript
import { getAllBlogPosts } from '@/lib/contentful/client'

const posts = await getAllBlogPosts('pt')
```

### Buscar Post por Slug

```typescript
import { getBlogPostBySlug } from '@/lib/contentful/client'

const post = await getBlogPostBySlug('meu-post', 'pt')
```

### Renderizar Rich Text

```typescript
import { RichTextRenderer } from '@/lib/contentful/rich-text-renderer'

<RichTextRenderer content={post.fields.content} />
```

## 🌍 Suporte Multilíngue

### Ativar Locales no Contentful

1. Vá em **Settings** → **Locales**
2. Adicione **English (en)** além do Português (pt)
3. Para cada post, adicione tradução:
   - Abra o post
   - Clique no dropdown de idioma (topo direito)
   - Selecione **English**
   - Traduza o conteúdo
   - Publique

### Usar no Código

```typescript
// Português
const postsPt = await getAllBlogPosts('pt')

// Inglês
const postsEn = await getAllBlogPosts('en')
```

## 🎨 Preview Mode (Opcional)

Para visualizar posts antes de publicar:

```typescript
// lib/contentful/preview.ts
const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN!,
  host: 'preview.contentful.com',
})
```

## 📊 Webhooks (Avançado)

Para rebuild automático quando publicar:

1. **Settings** → **Webhooks**
2. **Add webhook**
3. Nome: `Rebuild Site`
4. URL: Seu URL de deploy (ex: Vercel deploy hook)
5. Triggers: `Entry.publish`, `Entry.unpublish`

## 🐛 Troubleshooting

### "Invalid credentials"
- Verifique se o Space ID e Access Token estão corretos
- Certifique-se de usar o **Delivery API** token, não Management

### "Entry not found"
- Verifique se o post está **Published** (não apenas Saved)
- Verifique se o slug está correto

### Imagens não carregam
- URLs da Contentful começam com `//` - adicione `https:`
- Exemplo: `https:${fields.coverImage.fields.file.url}`

## 📚 Recursos

- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [Rich Text Renderer](https://www.contentful.com/developers/docs/javascript/tutorials/rendering-contentful-rich-text-with-javascript/)
- [Contentful + Next.js](https://www.contentful.com/blog/contentful-next-js/)

