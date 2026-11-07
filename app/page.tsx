"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-primary-50/50 to-white">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />

        {/* Glow effects */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl" />

        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-primary-200 rounded-full text-sm font-medium text-primary-700 mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
              {t.hero.badge}
            </div>

            <h1 className="heading-xl mb-6 animate-slide-up text-balance">
              {t.hero.title}
              <br />
              <span className="gradient-text">{t.hero.titleHighlight}</span>
            </h1>

            <p className="subtitle max-w-2xl mx-auto mb-10 animate-slide-up text-balance" style={{ animationDelay: "0.1s" }}>
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link href="/simulator" className="btn-primary btn-lg">
                {t.hero.ctaPrimary}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/how-it-works" className="btn-secondary btn-lg">
                {t.hero.ctaSecondary}
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-dark-900 mb-1">
                {t.hero.stats.days}
              </div>
              <div className="text-sm text-dark-500">
                {t.hero.stats.daysDesc}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-dark-900 mb-1">
                {t.hero.stats.accuracy}
              </div>
              <div className="text-sm text-dark-500">
                {t.hero.stats.accuracyDesc}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-dark-900 mb-1">
                {t.hero.stats.free}
              </div>
              <div className="text-sm text-dark-500">
                {t.hero.stats.freeDesc}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Stats */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-lg mb-4 text-balance">{t.problem.title}</h2>
            <p className="subtitle text-balance">{t.problem.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-10">
            {t.problem.stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-dark-50">
                <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-dark-500">{stat.label}</div>
              </div>
            ))}
          </div>

          <p className="text-center text-dark-600 max-w-2xl mx-auto leading-relaxed">
            {t.problem.description}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="heading-lg mb-4 text-balance">{t.features.title}</h2>
            <p className="subtitle text-balance">{t.features.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.features.items.map((feature, index) => (
              <div
                key={index}
                className="card-hover p-6 lg:p-8"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-2xl mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-dark-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-dark-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who For */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="heading-lg mb-4 text-balance">{t.whoFor.title}</h2>
            <p className="subtitle text-balance">{t.whoFor.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {t.whoFor.items.map((item, index) => (
              <div key={index} className="card-hover p-6 lg:p-8">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-dark-900 mb-2">{item.title}</h3>
                <p className="text-dark-500 leading-relaxed text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="heading-lg mb-4 text-balance">{t.howItWorks.title}</h2>
            <p className="subtitle text-balance">{t.howItWorks.subtitle}</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-200 via-primary-300 to-accent-300" />

            <div className="space-y-12 lg:space-y-0">
              {t.howItWorks.steps.map((step, index) => (
                <div
                  key={index}
                  className={`relative lg:grid lg:grid-cols-2 lg:gap-12 items-center ${
                    index % 2 === 0 ? "" : "lg:direction-rtl"
                  }`}
                >
                  {/* Content */}
                  <div className={`${index % 2 === 0 ? "lg:text-right lg:pr-12" : "lg:col-start-2 lg:pl-12"}`}>
                    <div className={`card p-6 lg:p-8 inline-block ${index % 2 === 0 ? "lg:ml-auto" : ""}`}>
                      <div className="text-4xl font-bold gradient-text mb-3">
                        {step.number}
                      </div>
                      <h3 className="text-xl font-semibold text-dark-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-dark-500 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary-500 border-4 border-white shadow-lg z-10" />
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <Link href="/how-it-works" className="btn-secondary btn-lg">
              {t.common.learnMore}
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="heading-lg mb-4 text-balance">{t.pricing.title}</h2>
            <p className="subtitle text-balance">{t.pricing.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {t.pricing.plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? "gradient-bg text-white shadow-2xl shadow-primary-500/25 scale-105 z-10"
                    : "bg-white border border-dark-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-500 text-white text-sm font-semibold rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-lg font-semibold mb-2 ${plan.popular ? "text-white" : "text-dark-900"}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-bold ${plan.popular ? "text-white" : "text-dark-900"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm ${plan.popular ? "text-white/70" : "text-dark-500"}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`text-sm mt-2 ${plan.popular ? "text-white/80" : "text-dark-500"}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
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

                <Link
                  href="/pricing"
                  className={`w-full justify-center ${
                    plan.popular
                      ? "btn bg-white text-primary-600 hover:bg-white/90"
                      : "btn-secondary"
                  } btn-md`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-dark-500 mt-8">
            {t.pricing.guarantee}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-dark-50">
        {/* FAQPage structured data (GEO/SEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: t.faq.items.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            }),
          }}
        />
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="heading-lg mb-4 text-balance">{t.faq.title}</h2>
            <p className="subtitle text-balance">{t.faq.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {t.faq.items.map((item, index) => (
              <div key={index} className="card-hover p-6 lg:p-8">
                <h3 className="text-lg font-semibold text-dark-900 mb-2">
                  {item.q}
                </h3>
                <p className="text-dark-500 leading-relaxed text-sm">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Myths */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="heading-lg mb-4 text-balance">{t.myths.title}</h2>
            <p className="subtitle text-balance">{t.myths.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {t.myths.items.map((item, index) => (
              <div key={index} className="card-hover p-6 lg:p-8">
                <div className="text-sm font-semibold text-accent-600 mb-2">
                  Myth: {item.myth}
                </div>
                <p className="text-dark-500 leading-relaxed text-sm">
                  {item.truth}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="heading-lg mb-4 text-balance">{t.examples.title}</h2>
            <p className="subtitle text-balance">{t.examples.subtitle}</p>
          </div>
          <div className="grid gap-6 max-w-4xl mx-auto">
            {t.examples.items.map((item, index) => (
              <div key={index} className="card-hover p-6 lg:p-8">
                <h3 className="text-lg font-semibold text-dark-900 mb-2">
                  {item.idea}
                </h3>
                <div className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
                  {item.verdict}
                </div>
                <p className="text-dark-500 leading-relaxed text-sm">
                  {item.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        {/* Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl" />

        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="heading-lg mb-6 text-balance">
              Ready to test your idea in 15 minutes?
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto text-balance">
              Don't wait 180 days to find out if your startup fails. Simulate the whole journey in one conversation — for free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/simulator"
                className="btn bg-white text-primary-600 hover:bg-white/90 btn-lg"
              >
                {t.common.startFree}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
