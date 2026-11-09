"use client";

import { useI18n } from "@/src/i18n";
import Link from "next/link";
import PricingPlans from "@/src/content/PricingPlans";
import { articles, safeJsonLd } from "@/src/content/registry";

export default function Home() {
  const { t, language } = useI18n();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-14 sm:py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-primary-50/50 to-white">
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

            <p className="subtitle max-w-2xl mx-auto mb-10 animate-slide-up text-balance">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-slide-up">
              <Link
                href="/simulator"
                className="btn-primary btn-lg w-full sm:w-auto"
              >
                {t.hero.ctaPrimary}
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                href="/how-it-works"
                className="btn-secondary btn-lg w-full sm:w-auto"
              >
                {t.hero.ctaSecondary}
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20 animate-fade-in">
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
            {t.problem.stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center p-6 rounded-2xl transition-all duration-200 active:scale-[0.97] ${
                  index === 0
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-600/25"
                    : "bg-white border border-dark-200 shadow-sm hover:shadow-md"
                }`}
              >
                <div
                  className={`text-3xl sm:text-4xl font-bold mb-2 ${
                    index === 0 ? "text-white" : "text-primary-600"
                  }`}
                >
                  {stat.value}
                </div>
                <div
                  className={`text-sm ${
                    index === 0 ? "text-primary-100" : "text-dark-500"
                  }`}
                >
                  {stat.label}
                </div>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.features.items.map((feature, index) => (
              <div
                key={index}
                className={`card-hover p-6 lg:p-7 ${
                  index === 0
                    ? "lg:row-span-2 bg-gradient-to-br from-primary-600 to-primary-700 border-primary-600 text-white"
                    : ""
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 ${
                    index === 0 ? "bg-white/15" : "bg-primary-100"
                  }`}
                >
                  {feature.icon}
                </div>
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    index === 0 ? "text-white" : "text-dark-900"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`leading-relaxed ${
                    index === 0 ? "text-primary-100" : "text-dark-500"
                  }`}
                >
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
                <h3 className="text-lg font-semibold text-dark-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-dark-500 leading-relaxed text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="heading-lg mb-4 text-balance">
              {t.howItWorks.title}
            </h2>
            <p className="subtitle text-balance">{t.howItWorks.subtitle}</p>
            <div className="mt-4 inline-block bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-800">
              {t.howItWorks.timeNote}
            </div>
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
                  <div
                    className={`${index % 2 === 0 ? "lg:text-right lg:pr-12" : "lg:col-start-2 lg:pl-12"}`}
                  >
                    <div
                      className={`card p-6 lg:p-8 inline-block ${index % 2 === 0 ? "lg:ml-auto" : ""}`}
                    >
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

          <PricingPlans />

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
            __html: safeJsonLd({
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
                  {t.common.myth} {item.myth}
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

      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <h2 className="heading-lg mb-4">{t.common.blogTitle}</h2>
          <p className="subtitle mb-8">{t.common.indexIntro}</p>
          <div className="grid gap-5 md:grid-cols-3">
            {articles
              .filter((a) => a.kind === "blog")
              .slice(0, 3)
              .map((a) => (
                <Link key={a.path} href={a.path} className="card-hover p-6">
                  <h3 className="text-lg font-semibold">{a.title[language]}</h3>
                  <p className="mt-3 text-sm text-dark-500">
                    {a.intro[language]}
                  </p>
                </Link>
              ))}
          </div>
          <Link href="/blog" className="mt-6 inline-block text-primary-700">
            {t.common.moreReading}
          </Link>
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
              {t.common.ctaTitle}
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto text-balance">
              {t.common.ctaBody}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/simulator"
                className="btn bg-white text-primary-600 hover:bg-white/90 btn-lg"
              >
                {t.common.startFree}
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
