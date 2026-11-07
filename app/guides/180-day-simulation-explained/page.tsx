"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export default function GuideSimulationPage() {
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
              {t.guide.simulation.title}
            </h1>
            <p className="subtitle text-balance">
              {t.guide.simulation.subtitle}
            </p>
            <div className="mt-4 inline-block bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-800">
              {t.guide.simulation.timeNote}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <div className="space-y-12">
            {t.guide.simulation.phases.map((phase) => (
              <div key={phase.name} className="border-l-4 border-primary-200 pl-6">
                <h2 className="text-2xl font-bold text-dark-900 mb-3">
                  {phase.name}
                </h2>
                <p className="text-dark-500 leading-relaxed mb-4">
                  {phase.description}
                </p>
                <div className="bg-dark-50 rounded-lg p-4">
                  <h4 className="font-semibold text-dark-900 mb-2 text-sm">
                    What you'll see:
                  </h4>
                  <ul className="space-y-1 text-sm text-dark-500">
                    {phase.outputs.map((output) => (
                      <li key={output}>• {output}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center rounded-2xl gradient-bg p-10">
            <h3 className="text-2xl font-bold text-white mb-4">
              {t.guide.simulation.cta.title}
            </h3>
            <p className="text-white/80 mb-6">
              {t.guide.simulation.cta.subtitle}
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
