"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled = false, placeholder }: ChatInputProps) {
  const { t } = useI18n();
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;

    onSend(input.trim());
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-dark-200 bg-white px-4 pt-3 pb-safe">
      <div className="max-w-3xl mx-auto flex gap-3 pb-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder || t.sim.input.placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 px-4 py-3 min-h-[48px] bg-dark-50 border border-dark-200 rounded-xl text-base text-dark-800 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="btn-primary w-12 h-12 self-end flex-shrink-0"
          aria-label={t.sim.input.send}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </form>
  );
}
