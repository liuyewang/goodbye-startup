"use client";
import Link from "next/link";
import { useI18n } from "../i18n";
import { articles } from "./articles";
export default function ArticleIndex({
  kind,
}: {
  kind: "blog" | "guide";
}): React.JSX.Element {
  const { language, t } = useI18n();
  return (
    <div className="mx-auto max-w-4xl px-5 py-14 sm:py-20">
      <h1 className="text-4xl font-bold">
        {kind === "blog" ? t.common.blogTitle : t.common.guideTitle}
      </h1>
      <p className="mt-4 leading-relaxed text-dark-500">
        {t.common.indexIntro}
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {articles
          .filter((a) => a.kind === kind)
          .map((a) => (
            <Link
              key={a.path}
              href={a.path}
              className="rounded-2xl border border-dark-200 p-6 hover:border-primary-400"
            >
              <h2 className="text-xl font-semibold">{a.title[language]}</h2>
              <p className="mt-3 text-sm leading-relaxed text-dark-500">
                {a.intro[language]}
              </p>
            </Link>
          ))}
      </div>
      <Link
        className="mt-8 inline-block text-primary-700 underline"
        href={kind === "blog" ? "/guides" : "/blog"}
      >
        {t.common.moreReading}
      </Link>
    </div>
  );
}
