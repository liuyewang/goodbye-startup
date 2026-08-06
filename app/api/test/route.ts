import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({ message: "Hello from API", env: process.env.GEMINI_API_KEY ? "set" : "not set" });
}
