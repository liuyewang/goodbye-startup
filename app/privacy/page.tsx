"use client";

import { useI18n } from "@/src/i18n";

export default function PrivacyPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 lg:py-20 overflow-hidden bg-gradient-to-b from-primary-50/50 to-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-lg mb-4">{t.privacy.title}</h1>
            <p className="text-dark-500">{t.privacy.lastUpdated}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-20">
        <div className="container-custom max-w-3xl">
          <div className="space-y-12">
            {t.privacy.sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-xl font-semibold text-dark-900 mb-4">
                  {section.title}
                </h2>
                <p className="text-dark-600 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
