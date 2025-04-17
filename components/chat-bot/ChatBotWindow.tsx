'use client';

import { useState, useRef, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Send, X } from 'lucide-react';
import { CHATBOT_CONFIG } from '@/lib/chat/chatbot-config';

interface Message {
  type: 'user' | 'bot';
  content: string;
}

interface ChatBotWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatBotWindow({ isOpen, onClose }: ChatBotWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', content: CHATBOT_CONFIG.initialMessage }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Adiciona a mensagem do usuário
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);

    // Simula processamento da mensagem (aqui você implementará a lógica com Hugging Face)
    // Por enquanto, vamos apenas dar uma resposta padrão
    setTimeout(() => {
      let response = "Entendi sua mensagem. ";
      
      // Verifica se é uma pergunta sobre preços
      if (userMessage.toLowerCase().includes('preço') || 
          userMessage.toLowerCase().includes('preco') || 
          userMessage.toLowerCase().includes('valor') ||
          userMessage.toLowerCase().includes('custo')) {
        response = CHATBOT_CONFIG.priceMessage;
      } else {
        response += "Como posso ajudar mais?";
      }

      setMessages(prev => [...prev, { type: 'bot', content: response }]);
    }, 1000);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed bottom-24 right-4 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl z-50 flex flex-col">
          <Dialog.Title className="flex items-center justify-between p-4 border-b">
            <span className="font-bold text-lg">Assistente ABIPTOM</span>
            <Dialog.Close className="rounded-full p-1 hover:bg-gray-100">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </Dialog.Title>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.type === 'user'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-black px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 