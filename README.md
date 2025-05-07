# ABIPTOM Website

Bem-vindo ao repositório oficial do website da ABIPTOM, uma agência criativa e de consultoria digital sediada na Guiné-Bissau. Este site foi desenvolvido para apresentar nossos serviços, portfólio, e compartilhar insights através do nosso blog, ao mesmo tempo que implementa funcionalidades modernas e seguras.

## 🎯 Visão Geral do Projeto

O website da ABIPTOM serve como um ponto central de contacto e informação para clientes atuais e potenciais. Ele é projetado para ser moderno, responsivo, e intuitivo, refletindo a qualidade e profissionalismo da agência. As principais seções incluem: Home, Serviços, Quem Somos, Portfólio, Blog, Contacto e Trabalhe Conosco.

## ✨ Funcionalidades Implementadas

O site conta com diversas funcionalidades para melhorar a experiência do usuário e a eficiência operacional:

1.  **Formulários Seguros com CAPTCHA Matemático**:
    *   Páginas de `Contacto` e `Trabalhe Conosco` utilizam um CAPTCHA que requer a resolução de uma simples operação matemática (e.g., "Quanto é 5 + 3?") antes do envio.
    *   Isso previne spam de forma eficaz sem depender de serviços externos como o reCAPTCHA.
    *   Implementado com React Hook Form, Zod para validação, e EmailJS para o envio de emails.

2.  **Carrossel de Logos de Clientes (`Nossos Clientes`)**:
    *   Componente `ClientLogos` exibe um carrossel horizontal com rolagem automática dos logos dos clientes.
    *   Largura fixa para cada logo (168px) para garantir uma renderização consistente.
    *   Utilizado na página inicial e na página de Portfólio.

3.  **Blog com Conteúdo Dinâmico**:
    *   Seção de blog para compartilhar notícias, cases de sucesso e artigos.
    *   Atualmente destaca o "Projeto de Branding para 21 Marcas de Mulheres Empreendedoras".
    *   Página inicial exibe uma prévia do último artigo.

4.  **Integração Google Maps**:
    *   Componente `MapEmbed` para carregar de forma segura um iframe do Google Maps na página de Contacto.
    *   Configuração de Content Security Policy (CSP) para permitir iframes do Google.

5.  **Segurança Abrangente**:
    *   **Headers de Segurança**: Implementados via `middleware.ts` (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Strict-Transport-Security, Content Security Policy).
    *   **Validação de Inputs**: Utilização do Zod para validar todos os dados de formulário no frontend e backend (quando aplicável via API routes).
    *   **Proteção CSRF**: Token CSRF (`CSRFToken` component) utilizado nos formulários para prevenir ataques Cross-Site Request Forgery.
    *   **Configuração CORS**: Embora não detalhada aqui, é uma consideração importante para APIs.

6.  **Redirecionamento Estratégico de Botões**:
    *   Botões "Escolher Plano" nas páginas de serviços foram modificados para redirecionar diretamente para a página de `Contacto` (`/contacto`).

7.  **Design Responsivo e Moderno**:
    *   Layout adaptável para desktops, tablets e dispositivos móveis.
    *   Interface limpa e profissional.

8.  **Assistente Virtual (ChatBot)**:
    *   O site integra um componente `ChatBot` (visível em `app/layout.tsx`), potencialmente utilizando APIs de IA (Anthropic, Hugging Face) para interação com o usuário. *(Nota: A funcionalidade completa e estado atual deste chatbot não foram totalmente explorados nas interações recentes, mas a estrutura existe).*

## 🛠️ Stack Tecnológica

*   **Framework**: Next.js 14+ (com App Router)
*   **Linguagem**: TypeScript
*   **Estilização**: Tailwind CSS
*   **Componentes UI**: Shadcn/ui (Button, Card, Input, Label, Textarea, Toast, Alert, etc.)
*   **Gerenciamento de Formulários**: React Hook Form
*   **Validação de Esquema**: Zod
*   **Envio de Email (Cliente)**: EmailJS
*   **Ícones**: Lucide React
*   **Fontes**: Poppins (Google Fonts), Bauhaus 93 (local)
*   **Animações/Carrossel**: Embla Carousel (para o `ClientLogos`)
*   **Linting/Formatting**: ESLint, Prettier (configurações padrão do Next.js)

## 📁 Estrutura do Projeto

Uma visão geral da organização das pastas principais:

```
abiptom-website/
├── app/                     # Diretório principal do App Router (páginas, layouts)
│   ├── (main)/              # Grupo de rotas para páginas principais
│   │   ├── blog/
│   │   ├── contacto/
│   │   ├── portfolio/
│   │   ├── quem-somos/
│   │   ├── servicos/
│   │   ├── trabalhe-conosco/
│   │   └── page.tsx         # Página inicial (Home)
│   ├── api/                 # Rotas de API (ex: para validação de formulários, CSRF)
│   ├── components/          # Componentes específicos de rotas/páginas da app/
│   └── layout.tsx           # Layout principal da aplicação
├── components/              # Componentes UI globais e reutilizáveis (Shadcn/ui, etc.)
│   ├── chat-bot/
│   ├── client-logos.tsx
│   ├── csrf-token.tsx
│   ├── MapEmbed.tsx
│   └── ui/                  # Componentes base do Shadcn/ui
├── lib/                     # Funções utilitárias, tipos, dados
│   ├── data/                # Dados estáticos (ex: blog-posts.ts)
│   └── utils.ts             # Utilitários gerais (ex: cn para classnames)
├── public/                  # Arquivos estáticos
│   ├── fonts/               # Fontes locais (Bauhaus 93 Regular.ttf)
│   └── images/              # Imagens do site
├── styles/                  # Arquivos de estilo globais (se houver além de globals.css)
├── middleware.ts            # Middleware para headers de segurança, etc.
├── next.config.mjs          # Configuração do Next.js
├── tailwind.config.ts       # Configuração do Tailwind CSS
├── tsconfig.json            # Configuração do TypeScript
└── package.json             # Dependências e scripts do projeto
```

## 🎨 Fontes e Design

*   **Tipografia**:
    *   `Poppins`: Utilizada para o corpo do texto e elementos gerais, carregada via `next/font/google`.
    *   `Bauhaus 93 Regular`: Utilizada para títulos e elementos de destaque (classe `.font-bauhaus`), carregada como fonte local de `public/fonts/`.
*   **Esquema de Cores Principal**:
    *   Amarelo (ABIPTOM): Usado para destaques, botões e elementos de marca.
    *   Preto/Cinza Escuro: Usado para texto, fundos e contraste.
*   **Estilo Visual**: Moderno, limpo, e profissional com foco na usabilidade e identidade da marca.

## 🧑‍💻 Experiência do Usuário (UX)

O design e desenvolvimento do site focam em proporcionar uma experiência de usuário positiva:

*   **Navegação Intuitiva**: Menus claros e estrutura de página lógica.
*   **Responsividade**: Adaptação fluida a diferentes tamanhos de tela.
*   **Performance**: Otimizações do Next.js para carregamento rápido (embora otimizações de imagem e LCP possam ser continuamente melhoradas).
*   **Acessibilidade**: Uso de componentes Shadcn/ui que são construídos com acessibilidade em mente. Considerações semânticas de HTML.
*   **Feedback ao Usuário**: Toasts para notificações (sucesso/erro em formulários), estados de loading em botões.
*   **Segurança e Confiança**: Implementação de CAPTCHA e outros headers de segurança transmitem confiança.
*   **Conteúdo Claro e Conciso**: Textos diretos e informativos.
*   **CTAs (Call to Actions) Claros**: Botões e links que guiam o usuário para as ações desejadas.

## 🚀 Começando (Setup Local)

Siga estes passos para configurar e rodar o projeto localmente:

1.  **Pré-requisitos**:
    *   Node.js (versão 18.x ou superior recomendada)
    *   npm, yarn ou pnpm (o projeto parece ter `pnpm-lock.yaml`, então `pnpm` pode ser o gerenciador de pacotes preferido)

2.  **Clonar o Repositório**:
    ```bash
    git clone https://github.com/atchutchi/abiptom-website.git
    cd abiptom-website
    ```

3.  **Instalar Dependências**:
    Se estiver usando `pnpm`:
    ```bash
    pnpm install
    ```
    Ou `npm`:
    ```bash
    npm install
    ```
    Ou `yarn`:
    ```bash
    yarn install
    ```

4.  **Configurar Variáveis de Ambiente**:
    Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes variáveis. Consulte também o `.env.example` se existir.

    ```env
    # Chaves do EmailJS (obtenha no dashboard do EmailJS)
    NEXT_PUBLIC_EMAILJS_SERVICE_ID=SEU_SERVICE_ID
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT=SEU_TEMPLATE_ID_CONTACTO
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CAREERS=SEU_TEMPLATE_ID_TRABALHE_CONOSCO
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=SUA_PUBLIC_KEY

    # Segredo para CSRF (gere uma string aleatória segura, ex: openssl rand -base64 32)
    CSRF_SECRET=SEU_SEGREDO_CSRF_DE_MINIMO_32_CARACTERES

    # Opcional: Google Analytics
    NEXT_PUBLIC_GA_MEASUREMENT_ID=SEU_GA_ID

    # URL base para metadados e links canônicos
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    ```
    **Importante**: Nunca comite seu arquivo `.env.local` com chaves reais para o repositório. Adicione `.env.local` ao seu `.gitignore`.

5.  **Rodar o Servidor de Desenvolvimento**:
    ```bash
    pnpm dev
    ```
    Ou `npm run dev` / `yarn dev`.

    Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o site.

## 🚢 Deploy (Publicação)

Recomendamos **Vercel** para o deploy de aplicações Next.js devido à sua integração nativa e otimizações.

**Passos para Deploy com Vercel:**

1.  **Push para um Repositório Git**:
    Certifique-se que seu código está atualizado em um repositório Git (GitHub, GitLab, Bitbucket).

2.  **Criar uma Conta na Vercel**:
    Se ainda não tem, crie uma conta em [vercel.com](https://vercel.com/).

3.  **Importar Projeto na Vercel**:
    *   No seu dashboard da Vercel, clique em "Add New..." -> "Project".
    *   Escolha "Import Git Repository" e conecte sua conta Git.
    *   Selecione o repositório do seu site ABIPTOM.
    *   Vercel geralmente detecta automaticamente que é um projeto Next.js e configura as definições de build corretamente.

4.  **Configurar Variáveis de Ambiente na Vercel**:
    *   Nas configurações do seu projeto na Vercel (Settings -> Environment Variables), adicione todas as variáveis de ambiente que você configurou no seu `.env.local`:
        *   `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
        *   `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT`
        *   `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CAREERS`
        *   `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
        *   `CSRF_SECRET`
        *   `NEXT_PUBLIC_GA_MEASUREMENT_ID` (se estiver usando)
        *   `NEXT_PUBLIC_SITE_URL` (defina para a URL de produção do seu site, ex: `https://abiptom.gw`)

5.  **Deploy**:
    *   Clique no botão "Deploy". Vercel irá construir e publicar seu site.
    *   Após o deploy, você receberá uma URL de produção e URLs de preview para cada push para branches.

**Considerações Adicionais para Deploy:**

*   **Domínio Personalizado**: Você pode configurar um domínio personalizado (ex: `abiptom.gw`) nas configurações do projeto na Vercel.
*   **Build & Output Settings**: Geralmente, as configurações padrão da Vercel para Next.js são ideais (`next build` como build command, output directory `.next`).
*   **Middleware**: O `middleware.ts` será executado automaticamente pela Vercel em Edge Functions.

## 📜 Scripts Disponíveis

No `package.json`, você encontrará os seguintes scripts:

*   `npm run dev`: Inicia o servidor de desenvolvimento.
*   `npm run build`: Gera a build de produção do site.
*   `npm run start`: Inicia um servidor de produção (após `build`).
*   `npm run lint`: Executa o linter (ESLint) para verificar a qualidade do código.

## 🔄 Atualizações e Roadmap (Resumido do README anterior)

O projeto tem um roadmap que inclui:

*   **Blog Avançado**: Categorias, tags, busca, paginação.
*   **Portfólio Interativo**: Filtros, lightbox, detalhes de projeto.
*   **Melhorias no Chatbot**: Se for mantido.
*   **Otimização SEO e Performance**: Meta tags, sitemap, dados estruturados.
*   **Analytics**: Integração e monitoramento.
*   **CMS Headless**: Para gerenciamento de conteúdo facilitado.

## 🤝 Contribuição

Se desejar contribuir (para membros da equipe ou colaboradores externos):

1.  Fork o projeto (se externo).
2.  Crie uma nova branch (`git checkout -b feature/NovaFuncionalidade`).
3.  Faça suas alterações e commit (`git commit -m 'Adicionar NovaFuncionalidade'`).
4.  Push para a branch (`git push origin feature/NovaFuncionalidade`).
5.  Abra um Pull Request para revisão.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes (se existir, caso contrário, considere adicionar um).

---

Este README atualizado deve fornecer uma excelente visão geral do seu projeto ABIPTOM, suas funcionalidades, e como gerenciá-lo. 