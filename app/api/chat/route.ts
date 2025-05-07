import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import { CHATBOT_CONFIG } from '@/lib/chat/chatbot-config';
import { headers } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';

// Usar variável de ambiente para a chave de API, verificando se existe
const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
if (!apiKey && process.env.NODE_ENV === 'production') {
  console.error('AVISO: A chave de API do Hugging Face não está configurada!');
}

const hf = new HfInference(apiKey);

type MenuOption = {
  content: string;
  category: string;
};

type MainMenuOptions = {
  [key: string]: () => MenuOption;
};

type SubMenuOptions = {
  [key: string]: string;
};

// Configuração do CORS com headers de segurança
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_SITE_URL || 'https://abiptom.gw' 
    : '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handler para requisições OPTIONS (CORS preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Função para formatar o contexto da conversa
function formatConversationContext(context: string[]) {
  return context
    .map((msg, i) => `${i % 2 === 0 ? 'Cliente' : 'Assistente'}: ${msg}`)
    .join('\n');
}

// Função para limpar e formatar a resposta
function cleanResponse(response: string): string {
  return response
    .replace(/^Resposta:?/i, '')
    .replace(/^Assistente:?/i, '')
    .replace(/^Virtual:?/i, '')
    .trim();
}

function handleMainMenu(message: string): MenuOption | null {
  const mainOptions: MainMenuOptions = {
    "1": () => ({
      content: CHATBOT_CONFIG.conversationOptions.services.message,
      category: 'services'
    }),
    "2": () => ({
      content: CHATBOT_CONFIG.priceMessage,
      category: 'price'
    }),
    "3": () => ({
      content: CHATBOT_CONFIG.conversationOptions.contact.message,
      category: 'contact'
    }),
    "4": () => ({
      content: CHATBOT_CONFIG.conversationOptions.moreInfo.message,
      category: 'info'
    })
  };

  return mainOptions[message]?.() || null;
}

function handleServiceMenu(message: string): MenuOption | null {
  if (message === "0") {
    return {
      content: CHATBOT_CONFIG.initialMessage,
      category: 'general'
    };
  }

  const service = CHATBOT_CONFIG.services[parseInt(message) - 1];
  if (service) {
    return {
      content: `${service.name}:\n\n${service.description}\n\nGostaria de:\n\n1️⃣ Solicitar uma cotação\n2️⃣ Falar com um especialista\n3️⃣ Ver exemplos de projetos\n\n0️⃣ Voltar ao menu de serviços`,
      category: 'service_detail'
    };
  }

  return null;
}

function handleContactMenu(message: string): MenuOption | null {
  if (message === "0") {
    return {
      content: CHATBOT_CONFIG.initialMessage,
      category: 'general'
    };
  }

  const options: SubMenuOptions = CHATBOT_CONFIG.conversationOptions.contact.options;
  const option = options[message];
  if (option) {
    return {
      content: option + "\n\n0️⃣ Voltar ao menu principal",
      category: 'contact'
    };
  }

  return null;
}

function handleMoreInfoMenu(message: string): MenuOption | null {
  if (message === "0") {
    return {
      content: CHATBOT_CONFIG.initialMessage,
      category: 'general'
    };
  }

  const options: SubMenuOptions = CHATBOT_CONFIG.conversationOptions.moreInfo.options;
  const option = options[message];
  if (option) {
    return {
      content: option + "\n\n0️⃣ Voltar ao menu principal",
      category: 'info'
    };
  }

  return null;
}

export async function POST(request: Request) {
  // Verificar cabeçalhos para validação de origem
  const currentHeaders = await headers();
  
  try {
    // 1. Validar Origem (CORS)
    const origin = currentHeaders.get('origin');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://abiptom.gw';
    const allowedOrigins = [siteUrl];
    
    // Em desenvolvimento, permitir localhost e outras origens comuns
    if (process.env.NODE_ENV !== 'production') {
      allowedOrigins.push('http://localhost:3000');
      allowedOrigins.push('http://192.168.17.16:3000');
    }

    if (process.env.NODE_ENV === 'production' && (!origin || !allowedOrigins.includes(origin))) {
      return NextResponse.json(
        { 
          content: "Acesso não autorizado", 
          category: 'error' 
        }, 
        { status: 403, headers: corsHeaders }
      );
    }
    
    // 2. Rate Limiting para evitar abusos
    const { success: rateLimitSuccess } = await rateLimit('chat');
    if (!rateLimitSuccess) {
      return NextResponse.json(
        { 
          content: "Muitas solicitações em pouco tempo. Por favor, aguarde um momento antes de tentar novamente.", 
          category: 'error' 
        }, 
        { status: 429, headers: corsHeaders }
      );
    }

    const { message, context, conversationId } = await request.json();
    
    // Validar dados da solicitação
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { 
          content: "Formato de mensagem inválido", 
          category: 'error' 
        }, 
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Limitar tamanho da mensagem para evitar ataques
    if (message.length > 1000) {
      return NextResponse.json(
        { 
          content: "Mensagem muito longa", 
          category: 'error' 
        }, 
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Carregar configuração atual
    let config = CHATBOT_CONFIG;
    try {
      if (process.env.NODE_ENV !== 'production') {
        const configResponse = await fetch('http://localhost:3000/api/chat/config');
        if (configResponse.ok) {
          config = await configResponse.json();
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }

    // Verificar se é uma opção do menu principal
    const mainMenuResponse = handleMainMenu(message);
    if (mainMenuResponse) {
      return NextResponse.json(mainMenuResponse, { headers: corsHeaders });
    }

    // Verificar o contexto da última mensagem para determinar o menu atual
    const lastMessage = context?.split('\n').pop()?.toLowerCase() || '';

    if (lastMessage.includes(config.conversationOptions.services.message)) {
      const serviceResponse = handleServiceMenu(message);
      if (serviceResponse) {
        return NextResponse.json(serviceResponse, { headers: corsHeaders });
      }
    }

    if (lastMessage.includes(config.conversationOptions.contact.message)) {
      const contactResponse = handleContactMenu(message);
      if (contactResponse) {
        return NextResponse.json(contactResponse, { headers: corsHeaders });
      }
    }

    if (lastMessage.includes(config.conversationOptions.moreInfo.message)) {
      const infoResponse = handleMoreInfoMenu(message);
      if (infoResponse) {
        return NextResponse.json(infoResponse, { headers: corsHeaders });
      }
    }

    // Se não for uma opção de menu, verificar se é uma pergunta sobre preço
    if (message.toLowerCase().includes('preço') || 
        message.toLowerCase().includes('preco') || 
        message.toLowerCase().includes('valor') ||
        message.toLowerCase().includes('custo') ||
        message.toLowerCase().includes('orçamento') ||
        message.toLowerCase().includes('investimento')) {
      return NextResponse.json({
        content: config.priceMessage,
        category: 'price'
      }, { headers: corsHeaders });
    }

    // Se não for nenhuma das opções acima, retornar ao menu principal
    return NextResponse.json({
      content: "Desculpe, não entendi sua escolha. " + config.initialMessage,
      category: 'general'
    }, { headers: corsHeaders });

  } catch (error: any) {
    console.error('Erro na API de chat:', error);
    return NextResponse.json({
      content: "Desculpe, estou tendo dificuldades técnicas. Por favor, tente novamente em alguns instantes.",
      category: 'error'
    }, { status: 500, headers: corsHeaders });
  }
} 