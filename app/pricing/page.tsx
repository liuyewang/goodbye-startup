"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";

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
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {t.pricing.plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? "gradient-bg text-white shadow-2xl shadow-primary-500/25 md:scale-105 z-10"
                    : "bg-white border border-dark-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-500 text-white text-sm font-semibold rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className={`text-lg font-semibold mb-2 ${plan.popular ? "text-white" : "text-dark-900"}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-bold ${plan.popular ? "text-white" : "text-dark-900"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm ${plan.popular ? "text-white/70" : "text-dark-500"}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`text-sm mt-3 ${plan.popular ? "text-white/80" : "text-dark-500"}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <svg
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular ? "text-white" : "text-primary-500"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`text-sm ${plan.popular ? "text-white/90" : "text-dark-600"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full justify-center ${
                    plan.popular
                      ? "btn bg-white text-primary-600 hover:bg-white/90"
                      : "btn-primary"
                  } btn-md`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-dark-500 mt-12">
            {t.pricing.guarantee}
          </p>
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
