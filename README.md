# ABIPTOM Website

Um website moderno e responsivo para a ABIPTOM, uma agência criativa em Guiné-Bissau especializada em design, desenvolvimento web, produção de vídeo e marketing digital.

## 🆕 Atualizações Recentes

- **Assistente Virtual**: Implementação de um chatbot inteligente para atendimento 24/7
- **Esquema de cores atualizado**: Implementação consistente do esquema de cores preto e amarelo em todas as páginas
- **Fonte Bauhaus**: Adição da fonte Bauhaus para títulos e elementos de destaque
- **Hero Section**: Atualização da imagem principal com o logo oficial da ABIPTOM
- **Design System**: Padronização de componentes UI com estilo consistente 
- **Páginas de Serviço**: Redesign completo das páginas de serviços com o novo esquema visual
- **Página "Trabalhe Conosco"**: Reformulação com nova identidade visual
- **Formulários**: Design modernizado com bordas amarelas e estilo coerente

## 🤖 Assistente Virtual

O site conta com um assistente virtual inteligente powered by Hugging Face que:

- Fornece informações sobre a empresa e serviços
- Responde dúvidas comuns dos visitantes
- Encaminha solicitações de orçamento
- Disponível 24/7 para atendimento inicial

### Tecnologias do Assistente
- Hugging Face Inference API
- React Dialog para interface
- Processamento de Linguagem Natural
- Respostas contextualizadas

### Funcionalidades do Chatbot
- Chat em tempo real
- Respostas personalizadas baseadas no contexto
- Interface moderna e responsiva
- Integração com informações da empresa
- Redirecionamento inteligente para equipe comercial
- Suporte a múltiplos tipos de consultas

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes de UI reutilizáveis
- **Lucide React** - Ícones modernos
- **React** - Biblioteca JavaScript para UI
- **Hugging Face** - API de Inteligência Artificial para o chatbot
- **Radix UI** - Componentes acessíveis para o chat

## 📁 Estrutura do Projeto

```
abiptom-website/
├── app/
│   ├── components/         # Componentes reutilizáveis
│   ├── blog/              # Página do blog
│   ├── contacto/          # Página de contato
│   ├── portfolio/         # Página de portfólio
│   ├── servicos/          # Páginas de serviços específicos
│   │   ├── animacao-2d/   # Serviço de Animação 2D
│   │   ├── design-grafico/ # Serviço de Design Gráfico
│   │   ├── marketing-digital/ # Serviço de Marketing Digital
│   │   └── ...            # Outras páginas de serviços
│   ├── trabalhe-conosco/  # Página de carreiras
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página inicial
├── public/
│   ├── fonts/            # Fontes locais (Bauhaus)
│   └── images/           # Imagens do site
│       └── abiptom.png   # Logo principal utilizado no hero
└── components/
    ├── hero-section.tsx  # Componente de hero da página inicial
    └── ui/               # Componentes UI do shadcn
```

## 🎨 Design System

### Cores
- **Amarelo** (`#FFD700`, `text-yellow`, `text-yellow-400`) - Cor principal, usada em destaques, títulos e CTAs
- **Preto** (`#000000`, `bg-black`) - Backgrounds de seções e contraste com amarelo
- **Cinza Escuro** (`#333333`, `text-gray-700`) - Textos principais
- **Cinza Claro** (`#666666`, `text-gray-300`) - Textos secundários e sobre fundos escuros

### Tipografia
- **Bauhaus** (`font-bauhaus`) - Fonte principal para títulos e elementos de destaque
- **Poppins** - Fonte secundária para textos (Google Fonts)

### Componentes Estilizados
- **Cards de Serviço**: Bordas esquerdas amarelas, fundo branco, hover com sombra
- **Botões**: Fundo amarelo com texto preto ou fundo preto com texto amarelo
- **Seções Numéricas**: Círculos amarelos com números em preto
- **Ícones de Verificação**: Amarelos para listas de recursos e benefícios

## 📱 Páginas e Funcionalidades

### Home (/)
- Hero section com logo oficial da ABIPTOM
- Seção de serviços principais
- Portfolio em destaque (6 projetos)
- Seção "Sobre Nós"
- Chamada para ação (CTA)

### Portfolio (/portfolio)
- Filtro por categorias:
  - Todos
  - Design Gráfico
  - Websites
  - Social Media
  - Vídeo
- Grid responsivo de projetos
- Efeitos de hover
- Lightbox para visualização de imagens

### Blog (/blog)
- Grid de posts
- 6 posts por página
- Newsletter signup
- Categorização de conteúdo
- Data e tempo de leitura

### Contato (/contacto)
- Formulário de contato
- Informações de contato
- Integração com redes sociais
- Mapa de localização
- Links diretos (telefone, email)

### Serviços (/servicos)
- Descrição detalhada dos serviços
- Preços e pacotes
- Processo de trabalho
- Cases de sucesso

### Trabalhe Conosco (/trabalhe-conosco)
- Informações sobre carreira na ABIPTOM
- Formulário de candidatura
- Áreas de atuação
- Benefícios de trabalhar na empresa

## 🛠 Setup e Instalação

1. Clone o repositório:
```bash
git clone https://github.com/atchutchi/abiptom-website.git
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env.local` com as variáveis necessárias:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Rode o projeto em desenvolvimento:
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

## 🔧 Configurações

### Tailwind CSS
- Configurado com cores personalizadas
- Responsividade: sm, md, lg, xl
- Plugins: forms, typography, aspect-ratio

### Next.js
- App Router
- Layout compartilhado
- Metadata dinâmica
- Otimização de imagens
- Font optimization

## 🚧 Em Desenvolvimento

- [ ] Implementação do CMS
- [ ] Área administrativa
- [ ] Sistema de blog completo
- [ ] Integração com API de email
- [ ] Analytics e SEO avançado

## 📝 Notas de Desenvolvimento

- Manter consistência no uso das cores do design system (preto e amarelo)
- Usar a fonte Bauhaus para títulos e elementos de destaque
- Aplicar a borda amarela (border-yellow-400) em cards e elementos de destaque
- Seguir padrões de componentes do shadcn/ui
- Testar responsividade em múltiplos dispositivos
- Otimizar imagens antes de commit
- Manter documentação atualizada

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

- Designer UI/UX
- Desenvolvedor Frontend
- Desenvolvedor Backend
- Gerente de Projeto

## 📞 Suporte

Para suporte, email contato@abiptom.com ou abra uma issue no repositório. 