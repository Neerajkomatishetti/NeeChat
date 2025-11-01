"use client";

import ChatInput from "@/components/chatinput";
import { ChatMessage } from "@/components/chat-message";
import { useEffect, useState, useRef, useCallback } from "react";
import MarkdownRenderer from "@/components/MarkDownRenderer";
import { SidebarTrigger } from "./ui/sidebar";
import NavbarRightColumn from "./NavbarRightColumn";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToggleModal } from "@/hooks/toggleModal";
import login from "@/lib/actions/login";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  isStreaming?: boolean;
}

export default function Main({ chat_id }: { chat_id: string | null }) {
  const [content] = useState("Hi welcome to NeeChat!");
  const [messages, setMessages] = useState<Message[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { openModal, toggleModal } = useToggleModal();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`/api/v1/c/?chat_id=${chat_id}`);
      const data = await response.json();
      setMessages(data.messages[0]?.messages ?? []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  }, [chat_id]);

  useEffect(() => {
    if (chat_id) {
      fetchHistory();
    }
  }, [chat_id, fetchHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        body: JSON.stringify({ message: userMessage, chat_id }),
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
                    msg.id === aiMsg.id ? { ...msg, content: aiContent } : msg,
                  ),
                );
              } else if (data.type === "done") {
                // Mark streaming as complete
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMsg.id ? { ...msg, isStreaming: false } : msg,
                  ),
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
            : msg,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex relative flex-col items-center h-full w-full">
        {openModal && (
          <div className="flex items-center justify-center absolute top-0 right-0 left-auto bottom-0 w-[100vw] scroll-bar-hidden h-[100vh] margin-auto bg-black/10 backdrop-blur-sm z-100">
            <div className="flex flex-col items-center-safe w-auto gap-1.5 border inset-shadow-sm box-border border-solid p-2 border-primary">
              <button
                className="flex w-full justify-end-safe"
                onClick={() => {
                  toggleModal(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <Input
                className="bg-secondary rounded-none"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />
              <Input
                className="bg-secondary rounded-none"
                type="Password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />
              <Button
                className="w-full rounded-none inset-shadow-amber-600"
                onClick={() => {
                  login(formData.email, formData.password);
                  setFormData({
                    email: "",
                    password: "",
                  });
                }}
              >
                Login
              </Button>
              <h2>{"or"}</h2>
              <Button className="w-full rounded-none" onClick={() => {}}>
                Sign Up
              </Button>
            </div>
          </div>
        )}
        <nav className="flex sticky top-0 w-full z-10 items-center h-fit py-1 justify-between p-3">
          <SidebarTrigger />
          <NavbarRightColumn openModal={openModal} toggleModal={toggleModal} />
        </nav>
        <div className=" h-[70vh] sm:h-[80vh] max-h-[70vh] w-full sm:max-w-[70vw] py-6 px-2 pb-20 mb-3 mask-y-from-98% scrollbar-thin rounded-lg overflow-y-scroll">
          {messages.length === 0 ? (
            <div className="p-2 m-2">
              <MarkdownRenderer>
                {content.replace(/(\[.*?\])/g, "$1\n")}
              </MarkdownRenderer>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message: Message) => (
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
        <div className="w-[90%] h-fit md:w-[60%] z-10 sticky bottom-auto">
          <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
}
