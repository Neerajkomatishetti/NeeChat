"use client";

import ChatInput from "@/components/chatinput";
import { ChatMessage } from "@/components/chat-message";
import { useEffect, useState, useRef } from "react";
import MarkdownRenderer from "@/components/MarkDownRenderer";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  isStreaming?: boolean;
}

export default function Home() {
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMarkdown = async () => {
    try {
      const response = await fetch("/api/readme");
      const text = await response.text();
      setContent(text);
    } catch (err) {
      console.error("Failed to load markdown:", err);
    }
  };

  const sendMessage = async (userMessage: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      content: userMessage,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Add empty AI message for streaming
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      content: "",
      isUser: false,
      isStreaming: true,
    };
    setMessages((prev) => [...prev, aiMsg]);

    try {
      const response = await fetch("/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "chunk") {
                aiContent += data.content;
                // Update the AI message with new content
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMsg.id ? { ...msg, content: aiContent } : msg
                  )
                );
              } else if (data.type === "done") {
                // Mark streaming as complete
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMsg.id ? { ...msg, isStreaming: false } : msg
                  )
                );
              } else if (data.type === "error") {
                throw new Error(data.content);
              }
            } catch (parseError) {
              console.error("Error parsing SSE data:", parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Update the AI message with error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsg.id
            ? {
                ...msg,
                content: "Sorry, there was an error processing your request.",
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkdown();
  }, []);

  return (
    <>
      <div className="flex relative flex-col items-center justify-center h-full w-full">
        <div className="h-[80vh] max-h-[80vh] max-w-[70vw] py-6 pb-20 mb-3 px-8 w-full mask-y-from-98% scrollbar-thin overflow-y-scroll">
          {messages.length === 0 ? (
            <MarkdownRenderer>
              {content.replace(/(\[.*?\])/g, "$1\n")}
            </MarkdownRenderer>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.content}
                  isUser={message.isUser}
                  isStreaming={message.isStreaming}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <div className="w-[90%] md:w-[60%] sticky bottom-7">
          <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
}
