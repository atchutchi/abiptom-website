# 🌍 Guia de Configuração de Internacionalização (i18n)

Este documento explica como a internacionalização foi implementada no projeto usando `next-intl`.

## 📁 Estrutura de Arquivos

```
├── i18n.ts                    # Configuração principal do i18n
├── messages/
│   ├── pt.json               # Traduções em Português
│   └── en.json               # Traduções em Inglês
├── middleware.ts             # Middleware para detecção de idioma
└── app/
    └── [locale]/             # Pasta com rotas por idioma
```

## 🚀 Como Usar

### 1. Adicionar Novas Traduções

Edite os arquivos em `messages/`:

**messages/pt.json:**
```json
{
  "pagina": {
    "titulo": "Meu Título",
    "descricao": "Minha Descrição"
  }
}
```

**messages/en.json:**
```json
{
  "pagina": {
    "titulo": "My Title",
    "descricao": "My Description"
  }
}
```

### 2. Usar Traduções nos Componentes

```tsx
import { useTranslations } from 'next-intl'

export default function MeuComponente() {
  const t = useTranslations('pagina')
  
  return (
    <div>
      <h1>{t('titulo')}</h1>
      <p>{t('descricao')}</p>
    </div>
  )
}
```

### 3. Links Multilíngues

```tsx
import { Link } from '@/lib/navigation'

<Link href="/servicos">
  {t('nav.services')}
</Link>
```

### 4. Trocar de Idioma

O usuário pode trocar de idioma acessando:
- `/pt/pagina` - Português
- `/en/pagina` - Inglês

## 🔄 URLs Localizadas

| Português | Inglês |
|-----------|--------|
| /pt | /en |
| /pt/servicos | /en/services |
| /pt/quem-somos | /en/about |
| /pt/contacto | /en/contact |

## 🛠️ Configuração Adicional

### Adicionar Novo Idioma

1. Adicione o código do idioma em `i18n.ts`:
```typescript
export const locales = ['pt', 'en', 'fr'] as const
```

2. Crie o arquivo de mensagens:
```bash
messages/fr.json
```

3. Traduza todo o conteúdo

## 📝 Boas Práticas

1. **Use keys descritivas**: `home.services.title` em vez de `h1`
2. **Organize por seção**: Agrupe traduções relacionadas
3. **Mantenha consistência**: Use os mesmos termos em todo o site
4. **Teste ambos idiomas**: Sempre teste PT e EN

## 🐛 Troubleshooting

### "Namespace not found"
Certifique-se de que a key existe em ambos os arquivos (pt.json e en.json)

### "useTranslations must be used in Client Component"
Adicione `'use client'` no topo do arquivo

### URLs não funcionam
Verifique se o middleware está configurado corretamente em `middleware.ts`

## 📚 Recursos

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)

