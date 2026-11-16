"use client";
import { useI18n } from "../../i18n";
import { TIMELINE } from "../../domain/simulation/engine";
import type { SimulationState } from "../../domain/simulation/schema";
import type { Transcript } from "./persistence";
import { historyCopy } from "./historyCopy";

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
  const money = (cents: number): string =>
    new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  const percent = (n: number): string =>
    new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en-US", {
      style: "percent",
      maximumSignificantDigits: 21,
    }).format(n);
  const day = (n: number): string =>
    language === "zh" ? `第 ${n} 天` : `Day ${n}`;
  const maxCash = Math.max(1, ...state.history.map((s) => s.cashCents));
  const zero = state.history.find((s) => s.cashCents === 0);
  return (
    <section
      data-testid="historical-review"
      className="min-w-0 space-y-4 rounded-2xl border border-dark-200 bg-white p-5 sm:p-7"
    >
      <h2 className="text-xl font-bold">{c.title}</h2>
      <p className="text-sm leading-relaxed text-dark-600">{c.scope}</p>
      {state.history.length === 0 ? (
        <p className="text-sm">{c.empty}</p>
      ) : (
        <>
          <svg
            role="img"
            aria-label={c.chart}
            viewBox="0 0 600 230"
            className="w-full"
          >
            <desc>
              {state.history
                .map((s) => `${day(s.day)}: ${money(s.cashCents)}`)
                .join("; ")}
            </desc>
            <line x1="48" y1="180" x2="552" y2="180" stroke="#64748b" />
            <text x="48" y="26" fontSize="20" fill="#334155">
              {money(maxCash)}
            </text>
            <text x="48" y="210" fontSize="20" fill="#334155">
              {day(0)}
            </text>
            <text x="552" y="210" fontSize="20" textAnchor="end" fill="#334155">
              {day(180)}
            </text>
            <text x="552" y="173" fontSize="20" textAnchor="end" fill="#334155">
              {money(0)}
            </text>
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
                  className="min-w-0 rounded-xl border border-dark-200 p-4"
                >
                  <details>
                    <summary className="cursor-pointer break-words text-sm font-semibold tabular-nums">
                      {day(s.day)} · {c.cash}: {money(s.cashCents)}
                    </summary>
                    {turn ? (
                      <div className="mt-4 space-y-3 text-sm">
                        <h3 className="font-semibold">{c.decision}</h3>
                        <p className="whitespace-pre-wrap break-words">
                          {turn.decision}
                        </p>
                        {p ? (
                          <>
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
                      <p className="mt-4 text-sm text-dark-500">{c.missing}</p>
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
