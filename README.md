# ABIPTOM Website

Um website moderno e responsivo para a ABIPTOM, uma agência criativa em Guiné-Bissau especializada em design, desenvolvimento web, produção de vídeo e marketing digital.

## 🆕 Atualizações Recentes

- **Blog**: Implementação do sistema de blog com os primeiros cases de sucesso
- **Esquema de cores atualizado**: Implementação consistente do esquema de cores preto e amarelo em todas as páginas
- **Fonte Bauhaus**: Adição da fonte Bauhaus para títulos e elementos de destaque
- **Páginas de Serviço**: Redesign completo das páginas de serviços com o novo esquema visual
- **Cases de Sucesso**: Adição dos projetos UNIDO/AMAE e Banco BDU
- **Design System**: Padronização de componentes UI com estilo consistente

## 📝 Blog

O blog da ABIPTOM apresenta cases de sucesso e insights sobre projetos:

### Posts Recentes
- **Projeto UNIDO/AMAE**: Branding para 21 marcas de mulheres empreendedoras
- **Transformação Digital do Banco BDU**: Case study de consultoria digital
- **Galeria UNIDO/AMAE**: Bastidores do projeto de branding

### Funcionalidades Planejadas
- Categorização de posts
- Sistema de busca
- Paginação
- RSS Feed
- Newsletter integration

## 🤖 Assistente Virtual

O site conta com um assistente virtual inteligente que oferece uma experiência de navegação guiada:

- Interface estruturada com menus interativos
- Respostas predefinidas para tópicos importantes
- Sistema de navegação intuitivo com emojis numerados
- Histórico de conversas com painel administrativo
- Configurações personalizáveis via interface admin

### Funcionalidades do Assistente
- **Menus Interativos**
  - Menu principal com opções principais
  - Submenus para serviços específicos
  - Opções de contato e informações
  - Navegação simplificada com números

- **Painel Administrativo**
  - Visualização do histórico de conversas
  - Configuração de mensagens e respostas
  - Gerenciamento de serviços e informações
  - Monitoramento de interações

- **Respostas Inteligentes**
  - Mensagens predefinidas para tópicos importantes
  - Direcionamento adequado para cada tipo de solicitação
  - Respostas éticas e profissionais
  - Opção de retorno ao menu principal

### Tecnologias do Assistente
- Next.js API Routes para backend
- React Dialog para interface
- TypeScript para tipagem segura
- Sistema de histórico persistente
- Interface administrativa completa

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes de UI reutilizáveis
- **Lucide React** - Ícones modernos
- **React** - Biblioteca JavaScript para UI
- **Hugging Face** - API de Inteligência Artificial para o chatbot
- **Radix UI** - Componentes acessíveis

## 📁 Estrutura do Projeto

```
abiptom-website/
├── app/
│   ├── components/         # Componentes reutilizáveis
│   ├── blog/              # Sistema de blog
│   │   ├── page.tsx       # Página principal do blog
│   │   └── [...posts]/    # Posts individuais
│   ├── contacto/          # Página de contato
│   ├── portfolio/         # Página de portfólio
│   ├── servicos/          # Páginas de serviços
│   │   ├── animacao-2d/   
│   │   ├── design-grafico/
│   │   ├── marketing-digital/
│   │   └── ...           
│   ├── trabalhe-conosco/  # Página de carreiras
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── public/
│   ├── fonts/            # Fontes locais (Bauhaus)
│   └── images/           # Imagens do site
└── components/           # Componentes compartilhados
```

## 🎨 Design System

### Cores
- **Amarelo** (`#FFD700`) - Cor principal, destaques
- **Preto** (`#000000`) - Backgrounds e contraste
- **Cinza Escuro** (`#333333`) - Textos principais
- **Cinza Claro** (`#666666`) - Textos secundários

### Tipografia
- **Bauhaus** - Títulos e destaques
- **Poppins** - Textos gerais

## 🛣️ Roadmap

### Fase 1 - Em Andamento
- [x] Implementação do blog básico
- [x] Redesign das páginas de serviço
- [x] Integração do chatbot
- [x] Cases de sucesso iniciais
- [x] Atualização das páginas de serviço restantes
- [x] Sistema de formulários com validação

### Fase 2 - Próximos Passos
- [x] Sistema de blog avançado
  - Categorias e tags
  - Busca
  - Paginação
  - RSS Feed
- [x] Portfolio interativo
  - Filtros por categoria
  - Lightbox para imagens
  - Páginas de detalhes
- [x] Melhorias no chatbot
  - ✓ Interface estruturada com menus
  - ✓ Histórico de conversas
  - ✓ Interface admin
  - ✓ Respostas éticas e profissionais

### Fase 3 - Otimização
- [ ] SEO e Performance
  - Meta tags
  - Sitemap.xml
  - Structured data
  - OpenGraph tags
  - Otimização de imagens
- [ ] Analytics e Monitoramento
  - Google Analytics
  - Error tracking
  - Performance monitoring
  - Conversion tracking

### Fase 4 - Gestão de Conteúdo
- [ ] CMS Headless
  - Dashboard admin
  - Versionamento de conteúdo
  - Biblioteca de mídia
- [ ] Sistema de newsletters
- [ ] Área de cliente
- [ ] Sistema de orçamentos

## 🛠 Setup e Instalação

1. Clone o repositório:
```bash
git clone https://github.com/atchutchi/abiptom-website.git
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_HUGGINGFACE_API_KEY=seu_token_aqui
```

4. Rode o projeto:
```bash
npm run dev
```

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "tailwindcss": "3.x",
    "@radix-ui/react-icons": "latest",
    "lucide-react": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest"
  }
}
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

- Designer UI/UX
- Desenvolvedor Frontend
- Desenvolvedor Backend
- Gerente de Projeto

## 📞 Suporte

Para suporte, email admin@abiptom.gw ou abra uma issue no repositório.

## Segurança

### reCAPTCHA v3
O site utiliza o Google reCAPTCHA v3 para proteção contra spam e bots nos formulários de contato e candidaturas.

- Integrado nos formulários:
  - Página de Contato (`/contacto`)
  - Página de Carreiras (`/trabalhe-conosco`)

A verificação é feita de forma invisível, sem necessidade de interação do usuário, melhorando a experiência de uso.

### Variáveis de Ambiente
As chaves de API e credenciais sensíveis devem ser configuradas através de variáveis de ambiente:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=seu_site_key_aqui
RECAPTCHA_SECRET_KEY=seu_secret_key_aqui
```

⚠️ **IMPORTANTE**: Nunca commit credenciais ou chaves de API diretamente no código. Sempre use variáveis de ambiente e mantenha um arquivo `.env.example` com exemplos das variáveis necessárias. 