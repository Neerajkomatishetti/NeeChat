import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

// Initialize the Gemini API
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, chat_id } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Create a readable stream for the response
    const encoder = new TextEncoder();

    let aiMSg = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Generate content stream from Gemini using the new API
          const result = await genAI.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: message }] }],
          });

          // Process each chunk from the stream
          for await (const chunk of result) {
            if (chunk.candidates && chunk.candidates[0]?.content?.parts) {
              const chunkText = chunk.candidates[0].content.parts[0]?.text;
              if (chunkText) {
                aiMSg += chunkText;
                // Send the chunk as a server-sent event
                const data = JSON.stringify({
                  type: "chunk",
                  content: chunkText,
                  done: false,
                });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              }
            }
          }

          const filePath = path.join(process.cwd(), "history.json");
          const history = JSON.parse(await fs.readFile(filePath, "utf-8"));
          const chat_index = history.chats.findIndex((c) => c.id === chat_id);
          const formattedDate = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
          history.chats[chat_index].messages.push({
            id: randomUUID(),
            isUser: true,
            content: message,
            timestamp: formattedDate,
          });
          history.chats[chat_index].messages.push({
            id: randomUUID(),
            isUser: false,
            content: aiMSg,
            timestamp: formattedDate,
          });
          await fs.writeFile(filePath, JSON.stringify(history, null, 2));

          // Send completion signal
          const doneData = JSON.stringify({
            type: "done",
            content: "",
            done: true,
          });
          controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          const errorData = JSON.stringify({
            type: "error",
            content: "Streaming failed",
            done: true,
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });
    // Return streaming response
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
