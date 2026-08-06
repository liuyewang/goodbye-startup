"use client";

import { useI18n } from "@/lib/i18n";

export function TypingIndicator() {
  const { t } = useI18n();

  return (
    <div className="flex justify-start mb-4">
      <div className="message-ai">
        <div className="flex items-center gap-2 py-1">
          <div className="flex items-center gap-1">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
          <span className="text-sm text-dark-400">{t.sim.thinking}</span>
        </div>
      </div>
    </div>
  );
}
