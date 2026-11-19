"use client";
import { useState } from "react";
import { useI18n } from "../../i18n";
import { lifeCopy, LIFE_URL, LIFE_SOURCE } from "./copy";

/** Opt-in cross-origin experience; no startup data is sent to the frame. */
export default function LifeModule(): React.JSX.Element {
  const { language } = useI18n();
  const c = lifeCopy[language];
  const [loaded, setLoaded] = useState(false);
  return (
    <section className="mx-auto max-w-5xl space-y-5 px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold">{c.title}</h1>
      <p className="leading-relaxed text-dark-700">{c.description}</p>
      <p className="text-sm leading-relaxed text-dark-600">{c.boundary}</p>
      <p className="rounded-xl border border-primary-200 bg-primary-50 p-4 text-sm leading-relaxed">
        {c.privacy}
      </p>
      <p className="text-sm text-dark-600">{c.leave}</p>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          className="btn-primary min-h-11 px-5 py-3"
          onClick={() => setLoaded(!loaded)}
        >
          {loaded ? c.close : c.load}
        </button>
        <a
          className="inline-flex min-h-11 items-center text-primary-700 underline"
          href={LIFE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {c.open}
        </a>
      </div>
      {loaded && (
        <iframe
          title={c.frame}
          src={LIFE_URL}
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer"
          className="h-[75svh] min-h-[480px] w-full rounded-xl border border-dark-200 bg-white"
        />
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
