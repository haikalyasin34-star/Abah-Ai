import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { ChatMessageItem } from './ChatMessageItem';

interface ChatMessageListProps {
  messages: ChatMessage[];
  onRegenerateLast?: () => void;
  onRetryLast?: () => void;
  language: 'id' | 'en';
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  onRegenerateLast,
  onRetryLast,
  language,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom smoothly when messages update or stream
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4 py-4 px-2 sm:px-0">
      {messages.map((message, index) => {
        const isLastAssistant =
          index === messages.length - 1 && message.role === 'assistant';

        return (
          <ChatMessageItem
            key={message.id || `msg-${index}`}
            message={message}
            onRegenerate={isLastAssistant ? onRegenerateLast : undefined}
            onRetry={isLastAssistant && message.error ? onRetryLast : undefined}
            language={language}
          />
        );
      })}
      <div ref={bottomRef} className="h-2" />
    </div>
  );
};
