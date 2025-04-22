import { Metadata } from 'next';
import { ChatHistory } from '@/components/admin/ChatHistory';
import { ChatConfig } from '@/components/admin/ChatConfig';

export const metadata: Metadata = {
  title: 'Admin Chatbot | ABIPTOM',
  description: 'Painel administrativo do chatbot',
};

export default function AdminChatPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Administração do Chatbot</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Histórico de Conversas</h2>
          <ChatHistory />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Configurações</h2>
          <ChatConfig />
        </div>
      </div>
    </div>
  );
} 