import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chat_id = searchParams.get("chat_id");
  try {
    // Read file (must use fs.promises when using await)
    const filePath = path.join(process.cwd(), "history.json");
    const data = await fs.readFile(filePath, "utf-8");

    // Parse JSON safely
    const parsedData = JSON.parse(data);

    console.log("History data retrieval success!");
    const messages = parsedData.chats.filter((chat) => chat.id == chat_id);

    return NextResponse.json({
      messages,
    });
  } catch (err) {
    console.error("Error reading file:", err);
    return NextResponse.json(
      { error: "Failed to read history data" },
      { status: 500 },
    );
  }
}

async function addNewMessage(newMessage) {
  const filePath = path.join(process.cwd(), "history.json");

  try {
    // 1. Read the existing data
    const existingData = await fs.readFile(filePath, "utf-8");
    const parsedData = JSON.parse(existingData);
    const chat = parsedData.chats[0];

    if (chat.messages.length === 0) {
      return true;
    }

    // 2. Modify the data by adding the new chat to the start of the array
    parsedData.chats.unshift(newMessage);

    // 3. Convert the object back to a JSON string
    const updatedData = JSON.stringify(parsedData, null, 2); // Using null, 2 for pretty-printing

    // 4. Write the updated data back to the file
    await fs.writeFile(filePath, updatedData, "utf-8");

    return true;
  } catch (err) {
    console.error("Error updating history.json:", err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const chat_id = body.chat_id;

    // Create a standard timestamp
    const timestamp = new Date().toISOString();

    const newChat = {
      id: chat_id,
      title: "New Conversation",
      createdAt: timestamp,
      updatedAt: timestamp,
      messages: [],
    };

    const success = await addNewMessage(newChat);

    if (!success) {
      return NextResponse.json(
        {
          error: "Failed to add new message",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message added successfully",
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
