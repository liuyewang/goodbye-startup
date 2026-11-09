"use client";

import { useI18n } from "@/src/i18n";
import Link from "next/link";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-primary-50/50 to-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-xl mb-6 text-balance">
              {t.about.title}
            </h1>
            <p className="subtitle text-balance">
              {t.about.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <div className="card p-8 lg:p-12">
            <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-2xl mb-6">
              🎯
            </div>
            <h2 className="heading-md mb-4">{t.about.mission.title}</h2>
            <p className="text-dark-600 text-lg leading-relaxed">
              {t.about.mission.description}
            </p>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-16 lg:py-20 bg-dark-50">
        <div className="container-custom max-w-3xl">
          <div className="card p-8 lg:p-12">
            <div className="w-14 h-14 rounded-2xl bg-accent-100 flex items-center justify-center text-2xl mb-6">
              💡
            </div>
            <h2 className="heading-md mb-4">{t.about.why.title}</h2>
            <p className="text-dark-600 text-lg leading-relaxed">
              {t.about.why.description}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="heading-lg mb-4">{t.about.values.title}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {t.about.values.items.map((value, index) => (
              <div key={index} className="card-hover p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center text-3xl mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-dark-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-dark-500 leading-relaxed">
                  {value.description}
                </p>
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
              {t.common.ctaTitle}
            </h2>
            <p className="text-lg text-white/80 mb-10 text-balance">
              {t.common.ctaBody}
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
