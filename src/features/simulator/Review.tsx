"use client";
import { useState } from "react";
import { useI18n } from "../../i18n";
import type { SimulationState } from "../../domain/simulation/schema";
import { assessSnapshot, projectCash } from "../../domain/simulation/review";
import { reviewCopy } from "./reviewCopy";

/** A deterministic recap and explicitly non-authoritative local comparison. */
export default function Review({
  state,
}: {
  state: SimulationState;
}): React.JSX.Element {
  const { language } = useI18n();
  const c = reviewCopy[language];
  const impliedPrice =
    state.customers > 0 ? state.revenueCents / state.customers : null;
  const knownPrice =
    impliedPrice !== null &&
    Number.isSafeInteger(impliedPrice) &&
    impliedPrice >= 0 &&
    impliedPrice <= 1_000_000
      ? impliedPrice
      : null;
  const basePrice = knownPrice ?? 1000;
  const [variable, setVariable] = useState<"price" | "cost">("price");
  const [input, setInput] = useState(String(basePrice / 100));
  const parsed = Number(input);
  const cents = Math.round(parsed * 100);
  const valid =
    input.trim() !== "" &&
    Number.isFinite(parsed) &&
    parsed >= 0 &&
    Math.abs(parsed * 100 - cents) < 0.000001 &&
    cents <= (variable === "price" ? 1_000_000 : 100_000_000);
  const base = assessSnapshot(state, basePrice);
  const compared = valid
    ? assessSnapshot(
        {
          ...state,
          monthlyCostCents:
            variable === "cost" ? cents : state.monthlyCostCents,
        },
        variable === "price" ? cents : basePrice,
      )
    : null;
  const money = (n: number): string =>
    new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en-US", {
      style: "currency",
      currency: "USD",
    }).format(n / 100);
  const runway = (n: number | null): string =>
    n === null ? c.noBurn : n.toFixed(1);
  const baselineNet = state.revenueCents - state.monthlyCostCents;
  const baselinePath = projectCash(state.cashCents, baselineNet);
  const alternatePath = compared
    ? projectCash(state.cashCents, compared.monthlyNetCents)
    : baselinePath;
  const max = Math.max(1, ...baselinePath, ...alternatePath);
  const points = (values: number[]): string =>
    values.map((n, i) => `${i * 100},${90 - (n / max) * 80}`).join(" ");
  const rows = [
    [c.cash, money(state.cashCents)],
    [c.customers, String(state.customers)],
    [c.revenue, money(state.revenueCents)],
    [c.price, knownPrice === null ? c.missingPrice : money(knownPrice)],
    [c.cost, money(state.monthlyCostCents)],
    [c.runway, runway(state.runwayMonths)],
    [
      c.target,
      knownPrice === null && state.monthlyCostCents > 0
        ? c.missingPrice
        : String(base.targetCustomers ?? c.unknown),
    ],
    [
      c.gap,
      knownPrice === null && state.monthlyCostCents > 0
        ? c.missingPrice
        : String(base.customerGap ?? c.unknown),
    ],
  ];
  function download(): void {
    const text = [
      c.title,
      c.settled,
      ...rows.map(([k, v]) => `${k}: ${v}`),
      c.action,
      c.actionBody,
      c.note,
    ].join("\n\n");
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "goodbye-review.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section
      data-testid="settled-review"
      className="space-y-5 rounded-2xl border border-primary-200 bg-white p-5 sm:p-7"
    >
      <h2 className="text-xl font-bold">{c.title}</h2>
      <p className="text-sm text-primary-700">{c.settled}</p>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-sm text-dark-500">{k}</dt>
            <dd className="break-words font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      <h3 className="font-semibold">{c.action}</h3>
      <p className="text-sm leading-relaxed text-dark-600">{c.actionBody}</p>
      <button type="button" onClick={download} className="btn-secondary btn-md">
        {c.export}
      </button>
      <details className="border-t border-dark-200 pt-5">
        <summary className="cursor-pointer font-semibold">
          {c.sensitivity}
        </summary>
        <p className="my-4 text-sm leading-relaxed text-dark-600">{c.scope}</p>
        {knownPrice === null && (
          <p className="mb-4 text-sm text-amber-800">{c.priceUnknown}</p>
        )}
        <label className="block text-sm">
          {c.variable}
          <select
            className="my-2 block w-full rounded-lg border border-dark-300 p-3"
            value={variable}
            onChange={(e) => {
              const v = e.target.value as "price" | "cost";
              setVariable(v);
              setInput(
                String(
                  (v === "price" ? basePrice : state.monthlyCostCents) / 100,
                ),
              );
            }}
          >
            <option value="price">{c.price}</option>
            <option value="cost">{c.cost}</option>
          </select>
        </label>
        <label className="block text-sm">
          {c.value}
          <input
            className="my-2 block w-full rounded-lg border border-dark-300 p-3"
            type="number"
            min="0"
            max={variable === "price" ? 10000 : 1000000}
            step="0.01"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <span className="text-xs text-dark-500">
            0 – {money(variable === "price" ? 1_000_000 : 100_000_000)}
          </span>
        </label>
        <button
          type="button"
          className="my-3 text-sm text-primary-700 underline"
          onClick={() =>
            setInput(
              String(
                (variable === "price" ? basePrice : state.monthlyCostCents) /
                  100,
              ),
            )
          }
        >
          {c.reset}
        </button>
        {!valid && (
          <p role="status" className="text-sm text-amber-800">
            {c.invalid}
          </p>
        )}
        {compared && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    <th scope="col">{c.metric}</th>
                    <th scope="col">{c.baseline}</th>
                    <th scope="col">{c.alternative}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      c.net,
                      money(baselineNet),
                      money(compared.monthlyNetCents),
                    ],
                    [
                      c.runway,
                      runway(state.runwayMonths),
                      runway(compared.runwayMonths),
                    ],
                    [
                      c.horizon,
                      money(baselinePath[3]),
                      money(alternatePath[3]),
                    ],
                  ].map(([k, a, b]) => (
                    <tr key={k}>
                      <th scope="row" className="py-3 pr-3 font-normal">
                        {k}
                      </th>
                      <td className="break-words pr-3">{a}</td>
                      <td className="break-words">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <svg
              role="img"
              aria-label={c.chart}
              viewBox="-5 -5 315 110"
              className="mt-4 w-full"
            >
              <polyline
                points={points(baselinePath)}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2"
              />
              <polyline
                points={points(alternatePath)}
                fill="none"
                stroke="#0f766e"
                strokeWidth="2"
                strokeDasharray="5 3"
              />
            </svg>
            <p className="text-xs text-dark-600">
              {c.baseline} ({c.solid}) · {c.alternative} ({c.dashed}) · 0 → 3{" "}
              {c.months}
            </p>
          </>
        )}
      </details>
      <p className="text-xs text-dark-500">{c.note}</p>
    </section>
  );
}
