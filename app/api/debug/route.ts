import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({
    deepseek_key: process.env.DEEPSEEK_API_KEY ? "set (***" + process.env.DEEPSEEK_API_KEY.slice(-4) + ")" : "NOT SET",
    gemini_key: process.env.GEMINI_API_KEY ? "set" : "NOT SET",
    site_url: process.env.NEXT_PUBLIC_SITE_URL || "NOT SET",
  });
}
