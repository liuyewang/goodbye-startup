"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/src/i18n";

export default function BackToTop(): React.JSX.Element | null {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const update = (): void => setIsVisible(window.scrollY > 320);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (!isVisible) return null;
  return (
    <button
      type="button"
      aria-label={t.common.backToTop}
      title={t.common.backToTop}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:right-6"
      onClick={() => {
        document.getElementById("main-content")?.focus({ preventScroll: true });
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
      }}
    >
      <svg
        aria-hidden="true"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 12 6-6 6 6M12 6v14" />
      </svg>
    </button>
  );
}
