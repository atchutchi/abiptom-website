'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: number;
  category?: string;
}

interface Conversation {
  id: string;
  messages: ChatMessage[];
  startedAt: number;
  lastMessageAt: number;
}

export function ChatHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implementar chamada à API para buscar conversas
    const mockConversations: Conversation[] = [
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

    setConversations(mockConversations);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="grid grid-cols-3 gap-4 h-[600px]">
        {/* Lista de conversas */}
        <div className="border-r pr-4">
          <div className="space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedConversation === conv.id
                    ? 'bg-yellow-100'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="text-sm font-medium">
                  Conversa #{conv.id}
                </div>
                <div className="text-xs text-gray-500">
                  {format(conv.startedAt, "d 'de' MMMM', às' HH:mm", {
                    locale: ptBR,
                  })}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {conv.messages[conv.messages.length - 1]?.content}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detalhes da conversa */}
        <div className="col-span-2">
          {selectedConversation ? (
            <div className="space-y-4">
              {conversations
                .find((c) => c.id === selectedConversation)
                ?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.type === 'user'
                          ? 'bg-yellow-100'
                          : 'bg-gray-100'
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {format(message.timestamp, 'HH:mm')}
                        {message.category && ` • ${message.category}`}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-400">
              Selecione uma conversa para ver os detalhes
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 