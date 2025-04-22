import { BlogPost } from "../types/blog";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Concluímos com Sucesso o Projeto de Branding para 21 Marcas de Mulheres Empreendedoras na Guiné-Bissau",
    slug: "branding-unido-amae-guine-bissau",
    excerpt: "Em colaboração com a UNIDO e a AMAE, desenvolvemos identidades visuais e um catálogo completo para 21 marcas lideradas por mulheres empreendedoras em várias regiões da Guiné-Bissau.",
    content: `Em um projeto transformador que marca um importante capítulo no empreendedorismo feminino na Guiné-Bissau, a ABIPTOM teve o privilégio de colaborar com a UNIDO (Organização das Nações Unidas para o Desenvolvimento Industrial) e a AMAE (Associação de Mulheres de Atividade Económica) no desenvolvimento de identidades visuais para 21 marcas lideradas por mulheres empreendedoras.

Este projeto não foi apenas sobre criar logotipos; foi sobre dar voz e visibilidade a mulheres empreendedoras que estão fazendo a diferença em suas comunidades. Cada marca recebeu uma identidade visual única que reflete sua essência e valores, além de um conjunto completo de materiais de marketing.

O projeto incluiu:
- Desenvolvimento de 21 logotipos únicos
- Criação de guidelines de marca
- Produção de um catálogo completo
- Materiais de marketing personalizados
- Sessões de fotografia profissional`,
    coverImage: "/images/blog/reuniao-com-unido-e-amae-branding.jpg",
    date: "2024-03-15",
    author: {
      id: "1",
      name: "Equipe ABIPTOM",
      avatar: "/images/team/avatar.jpg",
      bio: "Equipe de design e branding da ABIPTOM"
    },
    categories: [
      {
        id: "1",
        name: "Branding",
        slug: "branding",
        description: "Projetos e insights sobre branding e identidade visual"
      },
      {
        id: "2",
        name: "Cases de Sucesso",
        slug: "cases-de-sucesso",
        description: "Histórias de projetos bem-sucedidos"
      }
    ],
    tags: [
      {
        id: "1",
        name: "UNIDO",
        slug: "unido"
      },
      {
        id: "2",
        name: "AMAE",
        slug: "amae"
      },
      {
        id: "3",
        name: "Empreendedorismo Feminino",
        slug: "empreendedorismo-feminino"
      }
    ],
    readingTime: "5 min de leitura",
    featured: true
  },
  {
    id: "2",
    title: "ABIPTOM Lidera Transformação Digital do Banco BDU",
    slug: "consultoria-digital-banco-bdu",
    excerpt: "Implementação bem-sucedida de estratégia digital completa, incluindo novo website, app mobile e presença nas redes sociais.",
    content: `A ABIPTOM teve o prazer de liderar a transformação digital completa do Banco BDU, um dos principais bancos da Guiné-Bissau. Este projeto abrangente incluiu o desenvolvimento de um novo website responsivo, um aplicativo mobile moderno e uma estratégia completa de presença digital.

O projeto focou em três pilares principais:
1. Modernização da presença digital
2. Melhoria da experiência do usuário
3. Fortalecimento da marca no ambiente digital

Resultados alcançados:
- Aumento de 150% no engajamento digital
- Redução de 40% nas chamadas ao suporte
- Crescimento de 80% na base de usuários do app`,
    coverImage: "/images/blog/banco-bdu-digital.jpg",
    date: "2024-03-10",
    author: {
      id: "2",
      name: "João Silva",
      avatar: "/images/team/joao.jpg",
      bio: "Consultor de Transformação Digital"
    },
    categories: [
      {
        id: "3",
        name: "Transformação Digital",
        slug: "transformacao-digital",
        description: "Projetos de transformação digital e consultoria"
      },
      {
        id: "2",
        name: "Cases de Sucesso",
        slug: "cases-de-sucesso"
      }
    ],
    tags: [
      {
        id: "4",
        name: "Banco BDU",
        slug: "banco-bdu"
      },
      {
        id: "5",
        name: "Desenvolvimento Web",
        slug: "desenvolvimento-web"
      },
      {
        id: "6",
        name: "App Mobile",
        slug: "app-mobile"
      }
    ],
    readingTime: "4 min de leitura",
    featured: false
  },
  {
    id: "3",
    title: "Galeria: Nos Bastidores do Projeto UNIDO e AMAE",
    slug: "galeria-projeto-unido-amae",
    excerpt: "Uma jornada visual pelos momentos marcantes do projeto de branding com as empreendedoras da Guiné-Bissau.",
    content: `Acompanhe através de imagens a jornada inspiradora do nosso projeto de branding com a UNIDO e AMAE. Esta galeria documenta os momentos mais significativos do processo de criação e implementação das identidades visuais para 21 empreendedoras.

Destaques da galeria:
- Workshops de descoberta com as empreendedoras
- Sessões de fotografia dos produtos
- Encontros de apresentação das marcas
- Momentos de celebração e empoderamento

Cada imagem conta uma história de transformação e crescimento, mostrando como o design pode ser uma ferramenta poderosa de mudança social e econômica.`,
    coverImage: "/images/blog/visita-amuguimapa-bafata-branding.jpg",
    date: "2024-03-15",
    author: {
      id: "3",
      name: "Maria Costa",
      avatar: "/images/team/maria.jpg",
      bio: "Fotógrafa e Designer"
    },
    categories: [
      {
        id: "4",
        name: "Fotografia",
        slug: "fotografia",
        description: "Projetos e galerias fotográficas"
      },
      {
        id: "1",
        name: "Branding",
        slug: "branding"
      }
    ],
    tags: [
      {
        id: "1",
        name: "UNIDO",
        slug: "unido"
      },
      {
        id: "2",
        name: "AMAE",
        slug: "amae"
      },
      {
        id: "7",
        name: "Bastidores",
        slug: "bastidores"
      }
    ],
    readingTime: "3 min de leitura",
    featured: false
  }
]; 