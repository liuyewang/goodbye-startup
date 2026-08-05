"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/lib/game/GameContext";
import { useI18n, getLanguage } from "@/lib/i18n";
import { StatusPanel } from "@/components/sim/StatusPanel";
import { ChatInterface } from "@/components/chat/ChatInterface";
import Link from "next/link";

function PaywallScreen() {
  const { t } = useI18n();

  return (
    <div className="flex-1 flex items-center justify-center bg-dark-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-3xl gradient-bg flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/25">
          <span className="text-4xl">🔒</span>
        </div>
        <h2 className="text-2xl font-bold text-dark-900 mb-3">
          {t.sim.paywall.title}
        </h2>
        <p className="text-dark-500 mb-8 leading-relaxed">
          {t.sim.paywall.description}
        </p>
        <div className="space-y-3">
          <Link href="/pricing" className="btn-primary btn-lg w-full justify-center">
            {t.sim.paywall.cta}
          </Link>
          <p className="text-sm text-dark-400">{t.sim.paywall.or}</p>
          <Link href="/pricing" className="btn-secondary btn-md w-full justify-center">
            {t.sim.paywall.lifetime}
          </Link>
        </div>
      </div>
    </div>
  );
}

function SimulatorContent() {
  const { state, addMessage, hasUsedFreeSimulation, resetGame, isLoading } = useGame();
  const { t } = useI18n();
  const [isTyping, setIsTyping] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize game with welcome message
  useEffect(() => {
    if (isLoading) return;

    // Check if this is a new game (no messages) and user hasn't used free simulation
    if (state.messages.length === 0 && !hasUsedFreeSimulation) {
      addMessage({ role: "ai", content: t.sim.welcome });
      setInitialized(true);
    } else if (state.messages.length > 0) {
      setInitialized(true);
    }
  }, [isLoading, state.messages.length, hasUsedFreeSimulation, addMessage, t.sim.welcome]);

  const handleSendMessage = async (message: string) => {
    setIsTyping(true);

    try {
      const language = getLanguage();

      // Build message history
      const history = state.messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        content: msg.content,
      }));

      // Add the new user message
      history.push({ role: "user", content: message });

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: history,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      if (data.text) {
        addMessage({ role: "ai", content: data.text });
      } else {
        addMessage({
          role: "ai",
          content: "Sorry, I couldn't generate a response. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage({
        role: "ai",
        content: "Sorry, something went wrong. Please try again later.",
      });
    } finally {
      setIsTyping(false);
    }
  };

  // Show paywall if user has used free simulation and no active game
  if (hasUsedFreeSimulation && state.messages.length === 0 && initialized) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <PaywallScreen />
      </div>
    );
  }

  // Show loading state
  if (isLoading || !initialized) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <StatusPanel />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-dark-400">{t.common.loading}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <StatusPanel />
      <ChatInterface onSendMessage={handleSendMessage} isTyping={isTyping} />
    </div>
  );
}

export default function SimulatorPage() {
  return <SimulatorContent />;
}
