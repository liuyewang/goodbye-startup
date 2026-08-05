"use client";

import type { Message } from "@/lib/game/types";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={isUser ? "message-user" : "message-ai"}>
        <p className="whitespace-pre-wrap leading-relaxed text-sm">
          {message.content}
        </p>
      </div>
    </div>
  );
}
