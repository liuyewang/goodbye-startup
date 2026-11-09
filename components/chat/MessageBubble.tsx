"use client";

import type { Message } from "@/lib/game/types";

interface MessageBubbleProps {
  message: Message;
}

function renderMarkdown(text: string): string {
  // Escape HTML first
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headers
  html = html.replace(/^### (.*$)/gm, "<h3 class='font-bold text-base mt-4 mb-2'>$1</h3>");
  html = html.replace(/^#### (.*$)/gm, "<h4 class='font-bold text-sm mt-3 mb-2'>$1</h4>");
  html = html.replace(/^##### (.*$)/gm, "<h5 class='font-bold text-sm mt-3 mb-1'>$1</h5>");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Horizontal rule
  html = html.replace(/^---$/gm, "<hr class='my-4 border-dark-200' />");

  // Unordered lists
  html = html.replace(/^- (.*$)/gm, "<li class='ml-4 list-disc'>$1</li>");
  html = html.replace(/(<li.*<\/li>\n?)+/g, "<ul class='my-2 space-y-1'>$&</ul>");

  // Ordered lists
  html = html.replace(/^\d+\. (.*$)/gm, "<li class='ml-4 list-decimal'>$1</li>");
  html = html.replace(/(<li.*<\/li>\n?)+/g, (match) => {
    if (match.includes("list-disc")) return match;
    return `<ol class='my-2 space-y-1'>${match}</ol>`;
  });

  // Line breaks
  html = html.replace(/\n/g, "<br />");

  return html;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex message-enter ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={isUser ? "message-user" : "message-ai"}>
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed text-sm">
            {message.content}
          </p>
        ) : (
          <div
            className="prose prose-sm max-w-none leading-relaxed text-sm"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
          />
        )}
      </div>
    </div>
  );
}
