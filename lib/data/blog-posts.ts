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
  }
]; 