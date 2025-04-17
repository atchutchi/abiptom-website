import { HfInference } from '@huggingface/inference';

export const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

export const CHATBOT_CONFIG = {
  initialMessage: "Olá! Sou o assistente virtual da ABIPTOM. Como posso ajudar?",
  companyInfo: {
    name: "ABIPTOM SARL",
    location: "Bairro Ajuda 1ª Fase, Bissau – Guiné-Bissau",
    email: "info@abiptom.gw",
    phone: "+245 966 865 331",
  },
  services: [
    {
      name: "Gestão de Redes Sociais e Marketing Digital",
      description: "Estratégias personalizadas para aumentar sua presença digital e engajamento nas redes sociais."
    },
    {
      name: "Desenvolvimento Web e Software",
      description: "Websites modernos, responsivos e soluções de software sob medida para sua empresa."
    },
    {
      name: "Design Gráfico",
      description: "Criação de flyers, brochuras, logótipos, banners e materiais visuais profissionais."
    },
    {
      name: "Web Hosting",
      description: "Serviços de alojamento web confiáveis e seguros para seu site ou aplicação."
    },
    {
      name: "SEO e Otimização",
      description: "Otimização para motores de busca e configuração profissional de canais digitais."
    },
    {
      name: "Formação e Consultoria",
      description: "Treinamentos e consultoria técnica especializada em tecnologia e marketing digital."
    }
  ],
  priceMessage: "Para obter informações detalhadas sobre os preços e solicitar um orçamento personalizado, por favor contacta a nossa equipa comercial diretamente pelo número +245 966 865 331 ou através do e-mail info@abiptom.gw. Estamos ao dispor para atender ao teu pedido de forma personalizada."
}; 