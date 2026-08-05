"use client";

import { useI18n } from "@/lib/i18n";
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
            <p className="subtitle text-balance">
              {t.howItWorks.subtitle}
            </p>
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
                  <p className="text-dark-500 text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container-custom relative">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="heading-lg mb-6 text-balance">
              Ready to start your simulation?
            </h2>
            <p className="text-lg text-white/80 mb-10 text-balance">
              It's free to try. No credit card required.
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
