"use client";

import MarkdownRenderer from "./MarkDownRenderer";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  isStreaming?: boolean;
}

export const ChatMessage = ({
  message,
  isUser,
  isStreaming = false,
}: ChatMessageProps) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] p-4 rounded-lg ${
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message}</p>
        ) : (
          <div>
            <MarkdownRenderer>{message}</MarkdownRenderer>
            {isStreaming && <span className="animate-pulse">|</span>}
          </div>
        )}
      </div>
    </div>
  );
};
