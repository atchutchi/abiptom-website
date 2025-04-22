import { NextResponse } from 'next/server';

// TODO: Implementar banco de dados
const mockConversations = [
  {
    id: '1',
    startedAt: Date.now() - 3600000,
    lastMessageAt: Date.now() - 3500000,
    messages: [
      {
        id: '1',
        type: 'user',
        content: 'Olá, gostaria de saber mais sobre seus serviços',
        timestamp: Date.now() - 3600000
      },
      {
        id: '2',
        type: 'bot',
        content: 'Claro! Oferecemos diversos serviços...',
        timestamp: Date.now() - 3500000,
        category: 'general'
      }
    ]
  }
];

export async function GET() {
  try {
    // TODO: Buscar do banco de dados
    return NextResponse.json(mockConversations);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const conversation = await request.json();
    
    // TODO: Salvar no banco de dados
    mockConversations.push({
      ...conversation,
      id: String(mockConversations.length + 1),
      startedAt: Date.now(),
      lastMessageAt: Date.now()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving chat history:', error);
    return NextResponse.json(
      { error: 'Failed to save chat history' },
      { status: 500 }
    );
  }
} 