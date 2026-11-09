"use client";

import { useState } from "react";
import { useGame } from "@/lib/game/GameContext";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => Promise<void>;
  isTyping?: boolean;
}

export function ChatInterface({ onSendMessage, isTyping = false }: ChatInterfaceProps) {
  const { state, addMessage } = useGame();
  const [localTyping, setLocalTyping] = useState(false);

  const handleSend = async (message: string) => {
    // Add user message
    addMessage({ role: "user", content: message });

    // If external handler provided, use it
    if (onSendMessage) {
      setLocalTyping(true);
      try {
        await onSendMessage(message);
      } finally {
        setLocalTyping(false);
      }
    }
  };

  const showTyping = isTyping || localTyping;

  return (
    <div style={{ minHeight: 0 }} className="flex-1 flex flex-col overflow-hidden bg-white">
      <MessageList messages={state.messages} isTyping={showTyping} />
      <div className="flex-shrink-0">
        <ChatInput onSend={handleSend} disabled={showTyping || state.isGameOver} />
      </div>
    </div>
  );
}
