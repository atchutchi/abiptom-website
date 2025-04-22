import { NextResponse } from 'next/server';
import { CHATBOT_CONFIG } from '@/lib/chat/chatbot-config';

// TODO: Implementar persistência das configurações
let currentConfig = { ...CHATBOT_CONFIG };

export async function GET() {
  try {
    return NextResponse.json(currentConfig);
  } catch (error) {
    console.error('Error fetching chat config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat config' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const newConfig = await request.json();
    
    // Validar configuração
    if (!newConfig.initialMessage || !newConfig.priceMessage || !newConfig.companyInfo || !newConfig.services) {
      return NextResponse.json(
        { error: 'Invalid configuration' },
        { status: 400 }
      );
    }

    // TODO: Salvar em arquivo ou banco de dados
    currentConfig = { ...newConfig };

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating chat config:', error);
    return NextResponse.json(
      { error: 'Failed to update chat config' },
      { status: 500 }
    );
  }
} 