import { MessageCircle } from 'lucide-react';

interface ChatBotButtonProps {
  onClick: () => void;
}

export function ChatBotButton({ onClick }: ChatBotButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 w-16 h-16 bg-yellow-400 text-black rounded-full shadow-lg hover:bg-yellow-500 transition-colors flex items-center justify-center z-50"
      aria-label="Abrir chat"
    >
      <MessageCircle className="w-8 h-8" />
    </button>
  );
} 