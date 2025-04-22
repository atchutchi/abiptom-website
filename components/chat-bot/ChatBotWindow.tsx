'use client';

import { useState, useRef, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Send, X } from 'lucide-react';
import { CHATBOT_CONFIG } from '@/lib/chat/chatbot-config';

type MessageCategory = 'service' | 'price' | 'contact' | 'general';

interface Message {
  type: 'user' | 'bot';
  content: string;
  category?: MessageCategory;
  timestamp: number;
}

interface ChatBotWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BotResponse {
  content: string;
  category: MessageCategory;
}

export function ChatBotWindow({ isOpen, onClose }: ChatBotWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      type: 'bot', 
      content: CHATBOT_CONFIG.initialMessage, 
      category: 'general',
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationId = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Salvar histórico quando a conversa é fechada
  useEffect(() => {
    if (!isOpen && messages.length > 1 && conversationId.current) {
      saveConversationHistory();
    }
  }, [isOpen, messages]);

  const saveConversationHistory = async () => {
    try {
      await fetch('/api/chat/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map((msg, index) => ({
            ...msg,
            id: String(index + 1)
          }))
        })
      });
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const findServiceMatch = (text: string) => {
    return CHATBOT_CONFIG.services.find(service => 
      text.toLowerCase().includes(service.name.toLowerCase()) ||
      text.toLowerCase().includes(service.description.toLowerCase())
    );
  };

  const isContactQuery = (text: string) => {
    const contactKeywords = ['contacto', 'contato', 'email', 'telefone', 'ligar', 'falar', 'endereço', 'localização'];
    return contactKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const isPriceQuery = (text: string) => {
    const priceKeywords = ['preço', 'preco', 'valor', 'custo', 'orçamento', 'investimento'];
    return priceKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const generateResponse = async (userMessage: string): Promise<BotResponse> => {
    try {
      setError(null);
      // Get context from previous messages (last 5 messages)
      const lastMessages = messages.slice(-5);
      const context = lastMessages
        .map(m => `${m.type === 'user' ? 'Usuário' : 'Assistente'}: ${m.content}`)
        .join('\n');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: context
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();

    } catch (error) {
      console.error('Error in generateResponse:', error);
      setError('Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.');
      return {
        content: "Desculpe, estou tendo dificuldades técnicas. Por favor, tente novamente em alguns instantes.",
        category: 'general'
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsTyping(true);
    setError(null);
    
    // Add user message
    setMessages(prev => [...prev, { 
      type: 'user', 
      content: userMessage,
      timestamp: Date.now()
    }]);

    try {
      const response = await generateResponse(userMessage);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: response.content,
        category: response.category,
        timestamp: Date.now()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: "Desculpe, ocorreu um erro. Por favor, tente novamente.",
        category: 'general',
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
        <Dialog.Content className="fixed bottom-24 right-4 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl z-50 flex flex-col">
          <Dialog.Title className="flex items-center justify-between p-4 border-b bg-yellow-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-bold text-lg">Assistente ABIPTOM</span>
            </div>
            <Dialog.Close className="rounded-full p-1 hover:bg-yellow-500 transition-colors">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </Dialog.Title>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px] scroll-smooth">
            {messages.map((message, index) => (
              <div
                key={`${message.timestamp}-${index}`}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.type === 'user'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-100 text-gray-800'
                  } shadow-sm`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-center">
                <div className="bg-red-100 text-red-600 rounded-lg px-4 py-2 text-sm">
                  {error}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              disabled={isTyping}
              className="bg-yellow-400 text-black px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}