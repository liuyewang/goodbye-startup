"use client";

export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="message-ai">
        <div className="flex items-center gap-1 py-1">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}
