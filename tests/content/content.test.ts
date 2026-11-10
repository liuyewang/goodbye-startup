import { it, expect } from "vitest";
import {
  pages,
  articles,
  metadataFor,
  publicMarkdown,
  renderFeed,
} from "../../src/content/registry";
import { en } from "../../src/i18n/en";
import { zh } from "../../src/i18n/zh";
function paths(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object") return [prefix];
  return Object.entries(value).flatMap(([k, v]) => paths(v, prefix + "." + k));
}
it("keeps all 15 canonical public URLs within metadata budgets", () => {
  expect(pages).toHaveLength(15);
  expect(new Set(pages.map((p) => p.path)).size).toBe(15);
  for (const page of pages) {
    const m = metadataFor(page.path);
    expect(
      String((m.title as { absolute: string }).absolute).length,
    ).toBeLessThanOrEqual(60);
    expect(m.description!.length).toBeLessThanOrEqual(155);
    expect(m.alternates?.canonical).toBe(page.path);
    expect(
      m.openGraph && "url" in m.openGraph ? m.openGraph.url : undefined,
    ).toBe("https://goodbye.help" + page.path);
  }
});
it("generates four RSS articles from public content", () => {
  expect(articles.filter((a) => a.kind === "blog")).toHaveLength(4);
  expect(renderFeed().match(/<item>/g)).toHaveLength(4);
});
it("exports only public copy, never simulation data or misleading provider claims", () => {
  for (const page of pages) {
    const text = publicMarkdown(page.path);
    expect(text).toContain(page.title);
    expect(text).not.toMatch(
      /DEEPSEEK_API_KEY|session_hash|Google Gemini|\$0\.99/,
    );
  }
});
it("has identical translation leaf paths without stale simulation claims", () => {
  expect(paths(en).sort()).toEqual(paths(zh).sort());
  expect(JSON.stringify(en)).not.toMatch(
    /Google Gemini|30-day money-back|\$0\.99|one conversation|15-30 minutes/,
  );
  expect(JSON.stringify(zh)).not.toMatch(/一次对话|Gemini/);
});

it("keeps published validation-case arithmetic reproducible with the real engine", async () => {
  const { createSimulation, settleTurn } =
    await import("../../src/domain/simulation/engine");
  const guide = articles.find(
    (a) => a.path === "/guides/startup-idea-validation",
  )!;
  const cases = [
    { title: "Case 1: Weak demand", cash: 1_000_000, visits: 100, oneTime: 0 },
    {
      title: "Case 2: Expensive acquisition",
      cash: 1_000_000,
      visits: 1000,
      oneTime: 300_000,
    },
    {
      title: "Case 3: Cash exhausted early",
      cash: 10_000,
      visits: 0,
      oneTime: 0,
    },
  ];
  for (const c of cases) {
    const proposal = {
      visits: c.visits,
      signupRate: 0.1,
      paidRate: 0.1,
      monthlyChurn: 0.1,
      priceCents: 1000,
      monthlyCostCents: 150_000,
      oneTimeCostCents: c.oneTime,
      moraleDelta: 0,
      scenario: "Hypothetical arithmetic",
      insights: [{ text: "Test assumptions", metric: "cash" as const }],
      choices: ["Interview", "Prototype", "Measure"],
    };
    const initial = createSimulation({
      cashCents: c.cash,
      monthlyCostCents: 150_000,
      teamSize: 1,
      employment: "part-time",
    });
    const day0 = settleTurn(initial, proposal);
    expect(day0.cashCents).toBe(c.cash);
    const result = settleTurn(day0, proposal);
    const section = guide.sections.find((s) => s.title.en === c.title);
    expect(section, c.title).toBeDefined();
    const money =
      "$" +
      (result.cashCents / 100).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    expect(section!.body.en).toContain(`Cash after Day 5: ${money}`);
    expect(section!.body.zh).toContain(`第 5 天现金：${money}`);
    expect(section!.body.en).toContain(`Paying customers: ${result.customers}`);
    expect(section!.body.zh).toContain(`付费客户：${result.customers}`);
    expect(section!.body.en).toContain(
      `Monthly revenue: $${result.revenueCents / 100}.`,
    );
    expect(section!.body.zh).toContain(
      `月收入 $${result.revenueCents / 100}。`,
    );
    if (c.oneTime > 0) {
      const acquisitionCost = c.oneTime / result.customers / 100;
      expect(section!.body.en).toContain(
        `= $${acquisitionCost} per new paying customer`,
      );
      expect(section!.body.zh).toContain(`每位新付费客户 $${acquisitionCost}`);
      const baseline = settleTurn(day0, { ...proposal, oneTimeCostCents: 0 });
      const cash =
        "$" +
        (baseline.cashCents / 100).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      const runway = baseline.runwayMonths!.toFixed(2);
      for (const dictionary of [en, zh]) {
        const method = dictionary.howItWorks.detail.items[4].body;
        expect(method).toContain(cash);
        expect(method).toContain(runway);
      }
    }
    if (c.cash === 10_000) expect(result.status).toBe("completed");
  }
});
