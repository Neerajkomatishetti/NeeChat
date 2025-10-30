"use client";

import MarkdownRenderer from "./MarkDownRenderer";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  isStreaming?: boolean;
  isLoading?: boolean;
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
            {isStreaming && (
              <div className="flex size-fit bg-secondary">
                <div className="text-3xl transition-all animate-bounce">.</div>
                <div className="text-3xl transition-all delay-100 animate-bounce">
                  .
                </div>
                <div className="text-3xl transition-all delay-200 animate-bounce">
                  .
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
