import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import { CHATBOT_CONFIG } from '@/lib/chat/chatbot-config';

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json();

    // First check for specific patterns
    if (message.toLowerCase().includes('preço') || 
        message.toLowerCase().includes('preco') || 
        message.toLowerCase().includes('valor') ||
        message.toLowerCase().includes('custo') ||
        message.toLowerCase().includes('orçamento') ||
        message.toLowerCase().includes('investimento')) {
      return NextResponse.json({
        content: CHATBOT_CONFIG.priceMessage,
        category: 'price'
      });
    }

    // Check for contact queries
    if (message.toLowerCase().includes('contacto') || 
        message.toLowerCase().includes('contato') || 
        message.toLowerCase().includes('email') ||
        message.toLowerCase().includes('telefone') ||
        message.toLowerCase().includes('ligar') ||
        message.toLowerCase().includes('falar') ||
        message.toLowerCase().includes('endereço') ||
        message.toLowerCase().includes('localização')) {
      const { email, phone, location } = CHATBOT_CONFIG.companyInfo;
      return NextResponse.json({
        content: `Você pode nos contactar através do:\nEmail: ${email}\nTelefone: ${phone}\nEndereço: ${location}`,
        category: 'contact'
      });
    }

    // Check for service queries
    const serviceMatch = CHATBOT_CONFIG.services.find(service => 
      message.toLowerCase().includes(service.name.toLowerCase()) ||
      message.toLowerCase().includes(service.description.toLowerCase())
    );

    if (serviceMatch) {
      return NextResponse.json({
        content: `Sobre nosso serviço de ${serviceMatch.name}:\n${serviceMatch.description}\n\nGostaria de saber mais detalhes ou solicitar um orçamento?`,
        category: 'service'
      });
    }

    // Use text generation for general queries
    try {
      const completion = await hf.textGeneration({
        model: 'bigscience/bloomz',  // Multilingual model that supports Portuguese
        inputs: `Você é um assistente virtual profissional e amigável da ABIPTOM SARL, uma empresa de tecnologia em Guiné-Bissau.
Responda de forma clara e concisa em português.

Informações da empresa:
- Nome: ABIPTOM SARL
- Localização: Bairro Ajuda 1ª Fase, Bissau – Guiné-Bissau
- Email: info@abiptom.gw
- Telefone: +245 966 865 331

Contexto anterior da conversa:
${context}

Pergunta do cliente:
${message}

Resposta profissional:`,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
          return_full_text: false
        }
      });

      let response = completion.generated_text || "Desculpe, não consegui processar sua mensagem. Pode tentar novamente?";
      
      // Clean up the response
      response = response.replace(/^Resposta profissional:/, '').trim();
      
      return NextResponse.json({
        content: response,
        category: 'general'
      });

    } catch (aiError) {
      console.error('AI Error:', aiError);
      // Fallback to a generic response
      return NextResponse.json({
        content: "Entendi sua mensagem. Como posso ajudar mais? Se precisar de informações específicas sobre nossos serviços, preços ou contato, é só me perguntar!",
        category: 'general'
      });
    }

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({
      content: "Desculpe, estou tendo dificuldades técnicas. Por favor, tente novamente em alguns instantes.",
      category: 'general'
    }, { status: 500 });
  }
} 