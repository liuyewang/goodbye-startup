"use client";

import { useI18n } from "@/src/i18n";
import Link from "next/link";

export default function GuideValidationPage() {
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
              {t.guide.validation.title}
            </h1>
            <p className="subtitle text-balance">
              {t.guide.validation.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <div className="prose prose-dark max-w-none">
            <h2>{t.guide.validation.section1.title}</h2>
            <p>{t.guide.validation.section1.body}</p>

            <h2>{t.guide.validation.section2.title}</h2>
            <p>{t.guide.validation.section2.body}</p>
            <ul>
              {t.guide.validation.section2.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>

            <h2>{t.guide.validation.section3.title}</h2>
            <p>{t.guide.validation.section3.body}</p>

            <h2>{t.guide.validation.section4.title}</h2>
            <p>{t.guide.validation.section4.body}</p>

            <h2>{t.guide.validation.section5.title}</h2>
            <p>{t.guide.validation.section5.body}</p>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center rounded-2xl gradient-bg p-10">
            <h3 className="text-2xl font-bold text-white mb-4">
              {t.guide.validation.cta.title}
            </h3>
            <p className="text-white/80 mb-6">
              {t.guide.validation.cta.subtitle}
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
