interface Message {
  id: string;
  role: string;
  content: string;
  timestamp: string;
}

interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

interface HistoryData {
  chats: Chat[];
}

import { v4 as uuid } from "uuid"
import history from "../history.json" assert { type: "json" };
const typedHistory = history as HistoryData;

export const getChat = (id: string): Message[] => {
  const chat = typedHistory.chats.find((c) => c.id === id);
  if (!chat) throw new Error(`Chat with id "${id}" not found`);
  return chat.messages;
};

export const updateChat = (id: string, message:Message) => {
  const chat = typedHistory.chats.find((c) => c.id === id);
  if (!chat) {
    throw new Error(`Chat with id "${id}" not found`);
  } else {
    chat.messages.push(message);
  }

  return chat.messages;
};

export const createChat = (message:Message) => {
    const chats = typedHistory.chats;
    const id = uuid();
    const title = ` chat_${id}`;
    const createdAt = Date.now();
    const updatedAt = message.timestamp;

    const chat:Chat = {
        id:id,
        title:title,
        createdAt:createdAt.toString(),
        updatedAt:updatedAt,
        messages:[message]
    }

    try{
        chats.push(chat)
        return true
    }catch(e) {
        return false
    }    

}
