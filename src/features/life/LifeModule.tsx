"use client";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "../../i18n";
import { lifeCopy, LIFE_URL, LIFE_SOURCE } from "./copy";

/** Opt-in cross-origin experience; no startup data is sent to the frame. */
export default function LifeModule(): React.JSX.Element {
  const { language } = useI18n();
  const c = lifeCopy[language];
  const [phase, setPhase] = useState<"idle" | "loading" | "slow" | "settled">(
    "idle",
  );
  const loaded = phase !== "idle";
  const regionRef = useRef<HTMLElement>(null);
  const loadRef = useRef<HTMLButtonElement>(null);
  const wasLoaded = useRef(false);
  const focusOnOpen = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (loaded) {
      regionRef.current?.scrollIntoView({
        block: "start",
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
      if (focusOnOpen.current) closeRef.current?.focus({ preventScroll: true });
    } else if (wasLoaded.current)
      loadRef.current?.focus({ preventScroll: true });
    wasLoaded.current = loaded;
  }, [loaded]);
  useEffect(() => {
    if (phase !== "loading") return;
    const timer = window.setTimeout(
      () => setPhase((current) => (current === "loading" ? "slow" : current)),
      15000,
    );
    return () => window.clearTimeout(timer);
  }, [phase]);
  const originalLink = (
    <a
      className="inline-flex min-h-11 items-center text-primary-700 underline"
      href={LIFE_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      {c.open}
    </a>
  );
  return (
    <section className="mx-auto max-w-5xl space-y-5 px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold">{c.title}</h1>
      <p className="leading-relaxed text-dark-700">{c.description}</p>
      <p className="text-sm leading-relaxed text-dark-600">{c.boundary}</p>
      <p className="rounded-xl border border-primary-200 bg-primary-50 p-4 text-sm leading-relaxed">
        {c.privacy}
      </p>
      <p className="text-sm text-dark-600">{c.leave}</p>
      {!loaded && (
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            className="btn-primary min-h-11 px-5 py-3"
            ref={loadRef}
            onClick={(event) => {
              focusOnOpen.current = event.detail === 0;
              setPhase("loading");
            }}
          >
            {c.load}
          </button>
          {originalLink}
        </div>
      )}
      {loaded && (
        <section
          ref={regionRef}
          tabIndex={-1}
          aria-label={c.gameRegion}
          data-testid="life-game-region"
          className="scroll-mt-28 space-y-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600"
        >
          <h2 className="text-lg font-semibold">{c.gameRegion}</h2>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="btn-secondary min-h-11 px-5 py-3"
              ref={closeRef}
              onClick={() => setPhase("idle")}
            >
              {c.close}
            </button>
            {originalLink}
          </div>
          {(phase === "loading" || phase === "slow") && (
            <div
              role="status"
              className="rounded-xl border border-primary-200 bg-primary-50 p-4 text-sm text-dark-800"
            >
              <p className="font-semibold">
                {phase === "loading" ? c.loading : c.slow}
              </p>
              {phase === "loading" && (
                <p className="mt-2 leading-relaxed">{c.loadingNote}</p>
              )}
            </div>
          )}
          <iframe
            title={c.frame}
            src={LIFE_URL}
            sandbox="allow-scripts allow-same-origin"
            referrerPolicy="no-referrer"
            onLoad={() =>
              setPhase((current) => (current === "idle" ? current : "settled"))
            }
            className="block h-[75svh] min-h-[480px] w-full rounded-xl border border-dark-200 bg-white"
          />
        </section>
      )}
      <p className="text-sm text-dark-600">{c.fallback}</p>
      <p className="flex flex-wrap items-center gap-3 text-sm text-dark-600">
        <span>{c.author}</span>
        <a
          className="inline-flex min-h-11 items-center text-primary-700 underline"
          href={LIFE_SOURCE}
          target="_blank"
          rel="noopener noreferrer"
        >
          {c.source}
        </a>
      </p>
    </section>
  );
}
