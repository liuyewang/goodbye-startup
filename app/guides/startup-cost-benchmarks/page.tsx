"use client";

import { useI18n } from "@/src/i18n";
import Link from "next/link";

export default function GuideBenchmarksPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 lg:py-20 overflow-hidden bg-gradient-to-b from-primary-50/50 to-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto">
            <Link href="/guides" className="text-sm text-primary-600 mb-4 inline-block">
              ← Back to Guides
            </Link>
            <h1 className="heading-xl mb-4 text-balance">
              {t.guide.benchmarks.title}
            </h1>
            <p className="subtitle text-balance">
              {t.guide.benchmarks.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <p className="text-dark-500 leading-relaxed mb-8">
            {t.guide.benchmarks.intro}
          </p>

          {/* Benchmarks table */}
          <div className="overflow-hidden rounded-lg border border-dark-200 mb-12">
            <table className="w-full text-sm">
              <thead className="bg-dark-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-dark-900">Metric</th>
                  <th className="px-4 py-3 text-right font-semibold text-dark-900">Typical Range</th>
                  <th className="px-4 py-3 text-left font-semibold text-dark-900">Why it matters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {t.guide.benchmarks.items.map((item) => (
                  <tr key={item.metric}>
                    <td className="px-4 py-3 text-dark-900 font-medium">{item.metric}</td>
                    <td className="px-4 py-3 text-right font-mono text-primary-600">{item.range}</td>
                    <td className="px-4 py-3 text-dark-500">{item.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-dark-900 mb-4">
            {t.guide.benchmarks.howToUse.title}
          </h2>
          <p className="text-dark-500 leading-relaxed mb-6">
            {t.guide.benchmarks.howToUse.body}
          </p>

          <ul className="space-y-3 mb-12">
            {t.guide.benchmarks.howToUse.tips.map((tip) => (
              <li key={tip} className="flex gap-3">
                <span className="text-primary-500 mt-1">→</span>
                <span className="text-dark-500">{tip}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="text-center rounded-2xl gradient-bg p-10">
            <h3 className="text-2xl font-bold text-white mb-4">
              {t.guide.benchmarks.cta.title}
            </h3>
            <p className="text-white/80 mb-6">
              {t.guide.benchmarks.cta.subtitle}
            </p>
            <Link href="/simulator" className="btn bg-white text-primary-600 hover:bg-white/90 btn-lg">
              {t.common.startFree}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
