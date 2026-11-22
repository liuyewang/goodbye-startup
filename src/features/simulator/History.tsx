"use client";
import { useI18n } from "../../i18n";
import { TIMELINE } from "../../domain/simulation/engine";
import type { SimulationState } from "../../domain/simulation/schema";
import type { Transcript } from "./persistence";
import { historyCopy } from "./historyCopy";
import { simulationFormat } from "./format";

/** Numeric snapshots come only from the server; local text never supplies balances. */
export default function History({
  state,
  record,
}: {
  state: SimulationState;
  record: Transcript | null;
}): React.JSX.Element {
  const { language } = useI18n();
  const c = historyCopy[language];
  const { money, percent } = simulationFormat[language];
  const day = (n: number): string =>
    language === "zh" ? `第 ${n} 天` : `Day ${n}`;
  const maxCash = Math.max(1, ...state.history.map((s) => s.cashCents));
  const zero = state.history.find((s) => s.cashCents === 0);
  return (
    <section
      aria-labelledby="simulation-history-title"
      data-testid="historical-review"
      className="min-w-0 space-y-4 rounded-2xl border border-dark-200 bg-white p-5 sm:p-7"
    >
      <h2 id="simulation-history-title" className="text-xl font-bold">
        {c.title}
      </h2>
      <p className="text-sm leading-relaxed text-dark-600">{c.scope}</p>
      {state.history.length === 0 ? (
        <p className="text-sm">{c.empty}</p>
      ) : (
        <>
          <figure className="space-y-2">
            <figcaption className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-dark-700">
              <span>
                {c.maximum}: {money(maxCash)}
              </span>
              <span>
                {c.baseline}: {money(0)}
              </span>
            </figcaption>
            <svg
              role="img"
              aria-label={c.chart}
              viewBox="0 0 600 200"
              className="w-full"
            >
              <desc>
                {state.history
                  .map((s) => `${day(s.day)}: ${money(s.cashCents)}`)
                  .join("; ")}
              </desc>
              <line x1="48" y1="180" x2="552" y2="180" stroke="#64748b" />
              {state.history.map((s) => (
                <circle
                  key={s.day}
                  data-day={s.day}
                  cx={48 + (s.day / 180) * 504}
                  cy={180 - (s.cashCents / maxCash) * 140}
                  r="6"
                  fill={s.cashCents === 0 ? "#b91c1c" : "#4f46e5"}
                >
                  <title>
                    {day(s.day)} · {c.cash}: {money(s.cashCents)}
                  </title>
                </circle>
              ))}
            </svg>
            <div className="flex justify-between gap-4 px-[8%] text-xs text-dark-700">
              <span>{day(0)}</span>
              <span>{day(180)}</span>
            </div>
          </figure>
          {zero && (
            <p className="text-sm font-medium text-red-800">
              {c.zero} {zero.day}
              {c.zeroEnd} {c.zeroNote}
            </p>
          )}
          {state.history.some((s) => s.day === 0) && (
            <p className="text-sm text-dark-600">{c.init}</p>
          )}
          <ol className="space-y-3">
            {state.history.map((s) => {
              const version = TIMELINE.findIndex((n) => n === s.day) + 1;
              const turn =
                version > 0 && version <= state.version
                  ? record?.turns.find(
                      (t) => t.version === version && t.day === s.day,
                    )
                  : undefined;
              const p = turn?.proposal;
              const entries = p
                ? [
                    [c.visits, String(p.visits)],
                    [c.signup, percent(p.signupRate)],
                    [c.paid, percent(p.paidRate)],
                    [c.churn, percent(p.monthlyChurn)],
                    [c.price, money(p.priceCents)],
                    [c.cost, money(p.monthlyCostCents)],
                    [c.oneTime, money(p.oneTimeCostCents)],
                    [c.morale, String(p.moraleDelta)],
                  ]
                : [];
              return (
                <li
                  key={s.day}
                  data-testid="history-stage"
                  className="min-w-0 rounded-xl border border-dark-200"
                >
                  <details>
                    <summary className="min-h-11 cursor-pointer break-words px-4 py-3 text-sm font-semibold tabular-nums focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                      {day(s.day)} · {c.cash}: {money(s.cashCents)}
                    </summary>
                    {turn ? (
                      <div className="mt-4 space-y-3 px-4 pb-4 text-sm">
                        <h3 className="font-semibold">{c.decision}</h3>
                        <p className="whitespace-pre-wrap break-words">
                          {turn.decision}
                        </p>
                        {p ? (
                          <>
                            <h3 className="font-semibold">{c.narrative}</h3>
                            <p className="whitespace-pre-wrap break-words">
                              {p.scenario}
                            </p>
                            <ul className="list-disc space-y-1 pl-5 text-dark-600">
                              {p.insights.map((insight, index) => (
                                <li key={index} className="break-words">
                                  {insight.text}
                                </li>
                              ))}
                            </ul>
                            <h3 className="font-semibold">
                              {s.day === 0 ? c.initialization : c.assumptions}
                            </h3>
                            <dl className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                              {entries.map(([label, value]) => (
                                <div key={label}>
                                  <dt className="text-dark-500">{label}</dt>
                                  <dd className="break-words tabular-nums">
                                    {value}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </>
                        ) : (
                          <p className="text-dark-500">
                            {c.missingAssumptions}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-4 px-4 pb-4 text-sm text-dark-500">
                        {c.missing}
                      </p>
                    )}
                  </details>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </section>
  );
}
