"use client";

import { useI18n } from "@/src/i18n";
import Link from "next/link";

export default function HowItWorksPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-primary-50/50 to-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-xl mb-6 text-balance">
              {t.howItWorks.title}
            </h1>
            <p className="subtitle text-balance">{t.howItWorks.subtitle}</p>
            <div className="mt-6 inline-block bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-800">
              {t.howItWorks.timeNote}
            </div>
          </div>
        </div>
      </section>

      {/* Steps Detail */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="space-y-16">
            {t.howItWorks.steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row gap-8 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Number / Visual */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-3xl gradient-bg flex items-center justify-center shadow-xl shadow-primary-500/25">
                    <span className="text-5xl font-bold text-white">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-2xl font-bold text-dark-900 mb-3">
                    {step.title}
                  </h2>
                  <p className="text-dark-500 text-lg leading-relaxed mb-4">
                    {step.description}
                  </p>
                  <p className="text-dark-400 leading-relaxed text-sm">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is actually being computed */}
      <section className="pb-24">
        <div className="container-custom max-w-4xl">
          <h2 className="heading-md mb-4">{t.howItWorks.detail.heading}</h2>
          <p className="text-dark-500 text-lg leading-relaxed mb-10">
            {t.howItWorks.detail.intro}
          </p>
          <dl className="space-y-8">
            {t.howItWorks.detail.items.map((item) => (
              <div key={item.title}>
                <dt className="text-lg font-semibold text-dark-900 mb-2">
                  {item.title}
                </dt>
                <dd className="text-dark-500 leading-relaxed">{item.body}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-sm text-dark-600">
            {t.howItWorks.detail.reviewed}
          </p>
          <a
            className="mt-3 inline-block text-primary-700 underline"
            href={t.howItWorks.detail.sourceUrl}
          >
            {t.howItWorks.detail.sourceLabel}
          </a>
          <p className="text-dark-500 mt-10">{t.howItWorks.detail.closing}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container-custom relative">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="heading-lg mb-6 text-balance">
              {t.common.ctaTitle}
            </h2>
            <p className="text-lg text-white/80 mb-10 text-balance">
              {t.common.ctaBody}
            </p>
            <Link
              href="/simulator"
              className="btn bg-white text-primary-600 hover:bg-white/90 btn-lg"
            >
              {t.common.startFree}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
