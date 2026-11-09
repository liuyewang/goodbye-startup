"use client";

import { useI18n } from "@/src/i18n";
import Link from "next/link";
import PricingPlans from "@/src/content/PricingPlans";

export default function PricingPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-primary-50/50 to-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-xl mb-6 text-balance">
              {t.pricing.title}
            </h1>
            <p className="subtitle text-balance">
              {t.pricing.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 lg:py-20">
        <div className="container-custom">
          <PricingPlans/>

          <p className="text-center text-sm text-dark-500 mt-12">
            {t.pricing.guarantee}
          </p>
        </div>
      </section>

      {/* Value Comparison */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-custom max-w-3xl">
          <h2 className="heading-md mb-4 text-center">{t.pricing.valueComparison.title}</h2>
          <p className="text-center text-dark-500 mb-10">{t.pricing.valueComparison.intro}</p>
          <div className="space-y-4 mb-8">
            {t.pricing.valueComparison.items.map((item) => (
              <div key={item.real} className="flex items-center justify-between rounded-lg border border-dark-200 p-4">
                <span className="text-dark-600">{item.real}</span>
                <span className="font-semibold text-accent-600">{item.cost}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-dark-600 font-medium">{t.pricing.valueComparison.conclusion}</p>
        </div>
      </section>

      {/* Pre-purchase FAQs */}
      <section className="py-16 lg:py-20 bg-dark-50">
        <div className="container-custom max-w-3xl">
          <h2 className="heading-md mb-10 text-center">{t.pricing.faq.heading}</h2>
          <dl className="space-y-8">
            {t.pricing.faq.items.map((item) => (
              <div key={item.q}>
                <dt className="text-lg font-semibold text-dark-900 mb-2">
                  {item.q}
                </dt>
                <dd className="text-dark-500 leading-relaxed">{item.a}</dd>
              </div>
            ))}
          </dl>
          <div className="text-center mt-12">
            <Link href="/about" className="btn-secondary btn-md">
              {t.common.learnMore}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
