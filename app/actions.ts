"use server";

import path from "path";
import fs from "fs";

export async function getSidebarInfo() {
  const historyPath = path.join(process.cwd(), "history.json");
  const historyData = await fs.promises.readFile(historyPath, "utf-8");

  const sidebarInfo = JSON.parse(historyData).chats.map((chat) => ({
    id: chat.id,
    title: chat.messages[0]?.content ?? "No messages",
  }));

  return sidebarInfo;
}
