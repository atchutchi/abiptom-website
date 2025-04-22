import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import { CHATBOT_CONFIG } from '@/lib/chat/chatbot-config';

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

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
  try {
    const { message, context, conversationId } = await request.json();
    
    // Carregar configuração atual
    let config = CHATBOT_CONFIG;
    try {
      const configResponse = await fetch('http://localhost:3000/api/chat/config');
      if (configResponse.ok) {
        config = await configResponse.json();
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }

    // Verificar se é uma opção do menu principal
    const mainMenuResponse = handleMainMenu(message);
    if (mainMenuResponse) {
      return NextResponse.json(mainMenuResponse);
    }

    // Verificar o contexto da última mensagem para determinar o menu atual
    const lastMessage = context.split('\n').pop()?.toLowerCase() || '';

    if (lastMessage.includes(config.conversationOptions.services.message)) {
      const serviceResponse = handleServiceMenu(message);
      if (serviceResponse) {
        return NextResponse.json(serviceResponse);
      }
    }

    if (lastMessage.includes(config.conversationOptions.contact.message)) {
      const contactResponse = handleContactMenu(message);
      if (contactResponse) {
        return NextResponse.json(contactResponse);
      }
    }

    if (lastMessage.includes(config.conversationOptions.moreInfo.message)) {
      const infoResponse = handleMoreInfoMenu(message);
      if (infoResponse) {
        return NextResponse.json(infoResponse);
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
      });
    }

    // Se não for nenhuma das opções acima, retornar ao menu principal
    return NextResponse.json({
      content: "Desculpe, não entendi sua escolha. " + config.initialMessage,
      category: 'general'
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({
      content: "Desculpe, estou tendo dificuldades técnicas. Por favor, tente novamente em alguns instantes.",
      category: 'error'
    }, { status: 500 });
  }
} 