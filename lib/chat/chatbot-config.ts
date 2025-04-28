export const CHATBOT_CONFIG = {
  initialMessage: 
    "Olá! Sou o assistente virtual da ABIPTOM SARL – Guardião das Novas Tecnologias.\n" +
    "Como posso ajudar-te hoje? Escolhe uma das opções:\n\n" +
    "1️⃣ Conhecer os nossos serviços\n" +
    "2️⃣ Solicitar uma cotação\n" +
    "3️⃣ Falar com a nossa equipa\n" +
    "4️⃣ Mais informações\n\n" +
    "0️⃣ Sair",
  
  priceMessage: 
    "Para fornecer uma proposta personalizada, precisamos conhecer melhor as tuas necessidades.\n\n" +
    "Como preferes prosseguir?\n" +
    "1️⃣ Agendar uma reunião\n" +
    "2️⃣ Falar por telefone: +245 955 804 184\n" +
    "3️⃣ Receber por email: comercial@abiptom.gw\n" +
    "0️⃣ Voltar ao menu anterior",

  companyInfo: {
    name: "ABIPTOM SARL",
    location: "Bairro Ajuda – 1ª Fase, Bissau, Guiné-Bissau",
    email: "comercial@abiptom.gw",
    phone: "+245 955 804 184"
  },

  services: [
    {
      name: "Desenvolvimento Web",
      description: 
        "Desenvolvemos websites e aplicações web personalizadas. Inclui planeamento, design, programação, testes, manutenção e alojamento."
    },
    {
      name: "Marketing Digital",
      description: 
        "Estratégias em redes sociais (Facebook, Instagram, TikTok, LinkedIn, etc.), SEO, anúncios pagos e criação de conteúdos digitais."
    },
    {
      name: "Design Gráfico",
      description: 
        "Criação de logotipos, flyers, brochuras, cartões de visita, banners, conteúdos visuais e identidade de marca."
    },
    {
      name: "Produção de Vídeo",
      description: 
        "Vídeos institucionais, teasers, spots promocionais e conteúdo audiovisual para redes sociais, com edição e filmagem incluída."
    },
    {
      name: "Redes e Infraestrutura",
      description: 
        "Instalação e manutenção de redes, servidores locais, configuração de infraestrutura de TI, segurança e suporte técnico."
    },
    {
      name: "Consultoria Digital",
      description: 
        "Acompanhamos a transformação digital da tua organização com soluções de gestão, automação e otimização de processos."
    }
  ],

  conversationOptions: {
    services: {
      message: 
        "Estes são os nossos principais serviços. Seleciona uma opção para saber mais:\n\n" +
        "1️⃣ Desenvolvimento Web\n" +
        "2️⃣ Marketing Digital\n" +
        "3️⃣ Design Gráfico\n" +
        "4️⃣ Produção de Vídeo\n" +
        "5️⃣ Redes e Infraestrutura\n" +
        "6️⃣ Consultoria Digital\n\n" +
        "0️⃣ Voltar ao menu principal",
      options: {
        "1": "Desenvolvimento Web",
        "2": "Marketing Digital",
        "3": "Design Gráfico",
        "4": "Produção de Vídeo",
        "5": "Redes e Infraestrutura",
        "6": "Consultoria Digital"
      }
    },

    contact: {
      message: 
        "Escolhe como preferes entrar em contacto:\n\n" +
        "1️⃣ Agendar uma reunião (Calendly)\n" +
        "2️⃣ Falar por telefone\n" +
        "3️⃣ Enviar um email\n" +
        "4️⃣ Visitar o nosso escritório\n\n" +
        "0️⃣ Voltar ao menu principal",
      options: {
        "1": "Para agendar uma reunião, acede a: https://calendly.com/abiptom",
        "2": "Liga para: +245 955 804 184",
        "3": "Envia um email para: comercial@abiptom.gw",
        "4": "Visita-nos: Bairro Ajuda – 1ª Fase, Bissau"
      }
    },

    moreInfo: {
      message: 
        "Que tipo de informação procuras?\n\n" +
        "1️⃣ Sobre a empresa\n" +
        "2️⃣ Casos de sucesso\n" +
        "3️⃣ Como trabalhamos\n" +
        "4️⃣ Tecnologias utilizadas\n\n" +
        "0️⃣ Voltar ao menu principal",
      options: {
        "1": "Somos uma empresa de referência na Guiné-Bissau nas áreas de tecnologia, design e marketing digital.",
        "2": "Consulta exemplos reais em: https://abiptom.gw/portfolio",
        "3": "Seguimos estas etapas: 1) Planeamento, 2) Execução, 3) Testes, 4) Entrega e 5) Suporte.",
        "4": "Utilizamos React, Django, WordPress, Node.js, Adobe Suite, entre outras tecnologias."
      }
    }
  },

  commonQuestions: [
    {
      question: "Quanto tempo demora o desenvolvimento de um website?",
      answer: 
        "Depende da complexidade. Projetos simples: 2–4 semanas. Projetos mais robustos podem demorar mais. Avaliamos caso a caso."
    },
    {
      question: "Oferecem alojamento e domínio?",
      answer: 
        "Sim, temos pacotes de alojamento (com SSL, email e backups). Contacta-nos para identificar o plano mais adequado ao teu projeto."
    },
    {
      question: "Como é o vosso processo de trabalho?",
      answer: 
        "Começamos com o briefing, depois planeamos, executamos, testamos e entregamos com suporte contínuo. Garantimos qualidade em cada fase."
    }
  ],

  ethicalGuidelines: [
    "Nunca fornecemos valores automaticamente.",
    "Encaminhamos sempre orçamentos para contacto direto.",
    "Mantemos tom profissional e respeitoso.",
    "Não comparamos com concorrentes.",
    "Não prometemos resultados irreais.",
    "Encaminhamos assuntos complexos à equipa humana."
  ]
};
