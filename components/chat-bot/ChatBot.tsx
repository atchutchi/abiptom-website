'use client';

import { useState } from 'react';
import { ChatBotButton } from './ChatBotButton';
import { ChatBotWindow } from './ChatBotWindow';

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatBotButton onClick={() => setIsOpen(true)} />
      <ChatBotWindow 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
} 