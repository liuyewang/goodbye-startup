import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT_EN } from "@/lib/prompts/system-en";
import { SYSTEM_PROMPT_ZH } from "@/lib/prompts/system-zh";

export const runtime = "edge";

interface Message {
  role: "user" | "assistant";
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

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = language === "zh" ? SYSTEM_PROMPT_ZH : SYSTEM_PROMPT_EN;

    // Build DeepSeek (OpenAI-compatible) messages format
    const fullMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.content,
      })),
    ];

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-v4-flash",
          messages: fullMessages,
          temperature: 0.7,
          max_tokens: 4096,
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("DeepSeek API error:", response.status, errorData);
      return NextResponse.json(
        { error: "Failed to get response from AI", details: errorData, status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract text from response
    const text = data?.choices?.[0]?.message?.content || "";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
