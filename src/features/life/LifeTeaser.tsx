"use client";
import Link from "next/link";
import { useI18n } from "../../i18n";
import { lifeCopy } from "./copy";
export default function LifeTeaser(): React.JSX.Element {
  const { language } = useI18n();
  const c = lifeCopy[language];
  return (
    <section className="container-custom py-10">
      <div className="rounded-2xl border border-dark-200 bg-white p-6 sm:p-8">
        <p className="mb-2 text-sm font-semibold text-primary-700">
          {c.teaser}
        </p>
        <h2 className="mb-3 text-2xl font-bold">{c.title}</h2>
        <p className="mb-3 text-dark-600">{c.description}</p>
        <p className="mb-5 text-sm text-dark-500">{c.boundary}</p>
        <Link
          href="/simulator#silicon-valley"
          className="btn-secondary min-h-11 px-5 py-3"
        >
          {c.explore}
        </Link>
      </div>
    </section>
  );
}
