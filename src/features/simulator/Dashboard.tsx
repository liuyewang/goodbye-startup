"use client";
import { useI18n } from "../../i18n";
import type { SimulationState } from "../../domain/simulation/schema";
import { simulatorCopy } from "./copy";
/** Renders only server-calculated metrics, never totals asserted by the model. */
export default function Dashboard({
  state,
}: {
  state: SimulationState;
}): React.JSX.Element {
  const { language } = useI18n();
  const c = simulatorCopy[language];
  const money = (n: number) =>
    new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n / 100);
  const entries = [
    [c.cashLabel, money(state.cashCents)],
    [c.customers, state.customers.toLocaleString()],
    [c.revenue, money(state.revenueCents)],
    [c.costLabel, money(state.monthlyCostCents)],
    [
      c.runway,
      state.runwayMonths === null ? c.noBurn : state.runwayMonths.toFixed(1),
    ],
    [c.morale, `${state.morale}/100`],
  ];
  return (
    <section
      aria-label={c.metrics}
      className="rounded-2xl border border-primary-200 bg-primary-50 p-5"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-dark-800">{c.metrics}</h2>
        <span
          data-testid="sim-day"
          className="rounded-full bg-white px-4 py-1 text-sm font-semibold text-primary-700"
        >
          {language === "zh" ? `第 ${state.day} 天` : `Day ${state.day}`}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
        {entries.map(([label, value]) => (
          <div key={label}>
            <dt className="mb-1 text-xs text-dark-500">{label}</dt>
            <dd className="break-words text-lg font-semibold tabular-nums text-dark-900">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <progress
        aria-label={c.history}
        value={state.day}
        max={180}
        className="mt-5 h-2 w-full accent-primary-600"
      />
    </section>
  );
}
