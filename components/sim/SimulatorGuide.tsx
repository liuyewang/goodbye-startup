"use client";

import { useI18n } from "@/lib/i18n";

/**
 * Server-rendered explainer for /simulator.
 * The simulator itself is a client-only tool whose HTML carries almost no text,
 * so this section supplies the indexable copy. Keep it in sync with the real
 * mechanics of the run (see lib/prompts and lib/game).
 */
export default function SimulatorGuide() {
  const { t } = useI18n();
  const guide = t.sim.guide;

  return (
    <section className="border-t border-dark-100 bg-white">
      <div className="mx-auto max-w-4xl px-4 py-14">
        <h1 className="mb-4 text-3xl font-bold text-dark-900">{guide.heading}</h1>
        <p className="mb-10 leading-relaxed text-dark-500">{guide.intro}</p>

        <div className="mb-10 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="mb-3 text-lg font-semibold text-dark-900">
              {guide.inputTitle}
            </h2>
            <ul className="space-y-2 text-sm leading-relaxed text-dark-500">
              {guide.inputItems.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-primary-500">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-semibold text-dark-900">
              {guide.outputTitle}
            </h2>
            <ul className="space-y-2 text-sm leading-relaxed text-dark-500">
              {guide.outputItems.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-primary-500">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h2 className="mb-3 text-lg font-semibold text-dark-900">
          {guide.realismTitle}
        </h2>
        <p className="mb-6 leading-relaxed text-dark-500">{guide.realism}</p>

        {/* Benchmarks table */}
        <h2 className="mb-3 text-lg font-semibold text-dark-900">
          {guide.benchmarksTitle}
        </h2>
        <p className="mb-4 leading-relaxed text-dark-500 text-sm">
          {guide.benchmarksIntro}
        </p>
        <div className="mb-10 overflow-hidden rounded-lg border border-dark-200">
          <table className="w-full text-sm">
            <thead className="bg-dark-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-dark-900">Metric</th>
                <th className="px-4 py-2 text-right font-semibold text-dark-900">Typical Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {guide.benchmarks.map((b) => (
                <tr key={b.label}>
                  <td className="px-4 py-2 text-dark-600">{b.label}</td>
                  <td className="px-4 py-2 text-right font-mono text-primary-600">{b.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stages */}
        <h2 className="mb-3 text-lg font-semibold text-dark-900">
          {guide.stagesTitle}
        </h2>
        <div className="mb-10 space-y-4">
          {guide.stages.map((s) => (
            <div key={s.phase} className="rounded-lg border border-dark-200 p-4">
              <h3 className="mb-1 font-semibold text-dark-900">{s.phase}</h3>
              <p className="text-sm leading-relaxed text-dark-500">{s.description}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-dark-400">{guide.note}</p>
      </div>
    </section>
  );
}
