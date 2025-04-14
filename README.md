# ABIPTOM Website

Um website moderno e responsivo para a ABIPTOM, uma agência criativa em Guiné-Bissau especializada em design, desenvolvimento web, produção de vídeo e marketing digital.

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes de UI reutilizáveis
- **Lucide React** - Ícones modernos
- **React** - Biblioteca JavaScript para UI

## 📁 Estrutura do Projeto

```
abiptom-website/
├── app/
│   ├── components/         # Componentes reutilizáveis
│   ├── blog/              # Página do blog
│   ├── contato/           # Página de contato
│   ├── portfolio/         # Página de portfólio
│   ├── servicos/         # Página de serviços
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página inicial
├── public/
│   ├── fonts/            # Fontes locais (Bauhaus)
│   └── images/           # Imagens do site
└── components/
    └── ui/               # Componentes UI do shadcn
```

## 🎨 Design System

### Cores
- **Amarelo** (`#FFD700`) - Cor principal, usada em destaques e CTAs
- **Preto** (`#000000`) - Backgrounds e títulos
- **Cinza Escuro** (`#333333`) - Textos principais
- **Cinza Claro** (`#666666`) - Textos secundários

### Tipografia
- **Bauhaus** - Fonte principal para títulos (local)
- **Poppins** - Fonte secundária para textos (Google Fonts)

## 📱 Páginas e Funcionalidades

### Home (/)
- Hero section com animações
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

### Contato (/contato)
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

## 🛠 Setup e Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/abiptom-website.git
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

- Manter consistência no uso das cores do design system
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