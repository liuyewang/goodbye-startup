import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT_EN } from "@/lib/prompts/system-en";
import { SYSTEM_PROMPT_ZH } from "@/lib/prompts/system-zh";

export const runtime = "edge";

interface Message {
  role: "user" | "model";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, language = "en" } = body as {
      messages: Message[];
      language?: "en" | "zh";
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = language === "zh" ? SYSTEM_PROMPT_ZH : SYSTEM_PROMPT_EN;

    // Build Gemini format messages
    const contents = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Add system instruction as first user message (Gemini doesn't have system prompt in API)
    const fullContents = [
      {
        role: "user",
        parts: [{ text: `[SYSTEM INSTRUCTIONS]\n${systemPrompt}\n\n[END OF SYSTEM INSTRUCTIONS]\n\nNow respond to the user's message above following these instructions. Always reply in the same language as the user's last message.` }],
      },
      ...contents,
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: fullContents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", response.status, errorData);
      return NextResponse.json(
        { error: "Failed to get response from AI", details: errorData, status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract text from response
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
