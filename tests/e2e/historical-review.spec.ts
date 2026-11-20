import { test, expect } from "@playwright/test";
import {
  createSimulation,
  settleTurn,
} from "../../src/domain/simulation/engine";
import type { Proposal } from "../../src/domain/simulation/schema";

const proposal: Proposal = {
  visits: 100,
  signupRate: 0.000049,
  paidRate: 0.1,
  monthlyChurn: 0.05,
  priceCents: 1000,
  monthlyCostCents: 150000,
  oneTimeCostCents: 0,
  moraleDelta: 0,
  scenario: "Assume trial demand, not market evidence.",
  insights: [{ text: "Test a paid offer", metric: "customers" }],
  choices: ["Interview", "Test", "Pause"],
};
function fixture(early = false, limit = 6) {
  let state = createSimulation({
    cashCents: early ? 100 : 1000000,
    monthlyCostCents: 150000,
    teamSize: 1,
    employment: "part-time",
  });
  while (state.status !== "completed" && state.version < limit)
    state = settleTurn(state, proposal);
  return state;
}
for (const variant of [
  "full",
  "missing",
  "wrong-day",
  "wrong-run",
  "early",
  "running",
  "partial",
  "extreme",
] as const) {
  test(`historical review: ${variant}`, async ({ page }) => {
    const state = fixture(variant === "early", variant === "running" ? 2 : 6);
    if (variant === "extreme") {
      state.cashCents = 1_000_000_000;
      state.history = state.history.map((s) => ({
        ...s,
        cashCents: 1_000_000_000,
      }));
    }
    await page.addInitScript(
      ({ state, proposal, variant }) => {
        localStorage.setItem("gs_language", "en");
        if (variant !== "missing" && variant !== "early")
          localStorage.setItem(
            "gs_transcript_v1_history",
            JSON.stringify({
              schemaVersion: 1,
              runId: variant === "wrong-run" ? "another-run" : "history",
              idea: "Tutor tool",
              pending: null,
              turns: state.history.map((s, index) => ({
                version: index + 1,
                day: variant === "wrong-day" ? 179 : s.day,
                decision: `Decision for stage ${s.day}`,
                proposal: variant === "partial" ? null : proposal,
              })),
            }),
          );
      },
      { state, proposal, variant },
    );
    let writes = 0;
    await page.route("**/api/**", async (route) => {
      if (route.request().method() !== "GET") {
        writes++;
        await route.abort();
        return;
      }
      await route.fulfill({
        json: {
          data: {
            session: {
              used: true,
              attempts: state.version,
              runId: "history",
              expired: false,
              eligibleAt: null,
            },
            run: { id: "history", state, expiresAt: Date.now() + 86400000 },
            ready: true,
            mode: "mock",
          },
          requestId: "fixture-history",
        },
      });
    });
    await page.goto("/simulator");
    const history = page.getByTestId("historical-review");
    await expect(history).toBeVisible();
    await expect(
      history.getByRole("img", {
        name: "Settled cash at recorded simulation stages",
      }),
    ).toBeVisible();
    await expect(history.getByTestId("history-stage")).toHaveCount(
      state.history.length,
    );
    await expect(
      history.getByText(
        "Day 0 initializes the scenario; its AI assumptions do not charge costs.",
      ),
    ).toBeVisible();
    const points = await history
      .locator("circle")
      .evaluateAll((nodes) => nodes.map((n) => Number(n.getAttribute("cx"))));
    expect(points).toHaveLength(state.history.length);
    expect(points.every(Number.isFinite)).toBe(true);
    if (["full", "running", "partial", "extreme"].includes(variant)) {
      if (state.history.length > 2)
        expect(points[2] - points[1]).toBeCloseTo((points[1] - points[0]) * 17);
      const last = history.getByTestId("history-stage").last();
      await last.locator("summary").click();
      await expect(
        last.getByText(`Decision for stage ${state.day}`, { exact: true }),
      ).toBeVisible();
      if (variant === "partial")
        await expect(
          last.getByText("Local assumptions are unavailable for this stage."),
        ).toBeVisible();
      else {
        await expect(
          last.getByText(proposal.scenario, { exact: true }),
        ).toBeVisible();
        await expect(
          last.getByText("Test a paid offer", { exact: true }),
        ).toBeVisible();
        await expect(last.getByText("5%", { exact: true })).toBeVisible();
        await expect(last.getByText("0.0049%", { exact: true })).toBeVisible();
        await expect(
          last.getByText("$1,500.00", { exact: true }),
        ).toBeVisible();
        await expect(last.getByText("$0.00", { exact: true })).toBeVisible();
      }
      if (variant === "running") {
        const action = page.getByRole("button", { name: "Submit decision" });
        await expect(action).toBeVisible();
        expect(
          await action.evaluate((el) => el.getBoundingClientRect().top),
        ).toBeLessThan(
          await history.evaluate((el) => el.getBoundingClientRect().top),
        );
      }
      if (variant === "extreme")
        await expect(last.locator("summary")).toContainText("$10,000,000.00");
    } else {
      const last = history.getByTestId("history-stage").last();
      await last.locator("summary").click();
      await expect(
        last.getByText(
          "Local decision and assumptions are unavailable for this stage.",
        ),
      ).toBeVisible();
      await expect(history.getByText(/Decision for stage/)).toHaveCount(0);
    }
    if (variant === "early") {
      expect(state.day).toBe(5);
      await expect(
        history.getByText("Cash reached zero at recorded Day 5."),
      ).toBeVisible();
      expect(points[1]).toBeGreaterThan(points[0]);
    }
    await expect(history.locator("polyline, path")).toHaveCount(0);
    await page.setViewportSize({ width: 320, height: 780 });
    await page.getByRole("combobox").first().selectOption("zh");
    await expect(
      history.getByRole("heading", { name: "这次模拟的现金与决策" }),
    ).toBeVisible();
    const axis = history.getByText("第 0 天", { exact: true });
    await expect(axis).toBeVisible();
    const fontSize = await axis.evaluate((el) => {
      const scale =
        el instanceof SVGGraphicsElement
          ? Math.abs(el.getScreenCTM()?.a ?? 1)
          : 1;
      return parseFloat(getComputedStyle(el).fontSize) * scale;
    });
    const summary = history
      .getByTestId("history-stage")
      .first()
      .locator("summary");
    const targetHeight = await summary.evaluate(
      (el) => el.getBoundingClientRect().height,
    );
    console.log({ variant, width: 320, fontSize, targetHeight });
    expect.soft(fontSize).toBeGreaterThanOrEqual(12);
    expect.soft(targetHeight).toBeGreaterThanOrEqual(44);
    await summary.focus();
    await summary.press("Enter");
    expect(
      await summary.evaluate(
        (el) => (el.parentElement as HTMLDetailsElement).open,
      ),
    ).toBe(true);
    await summary.click({ position: { x: 2, y: 2 } });
    expect(
      await summary.evaluate(
        (el) => (el.parentElement as HTMLDetailsElement).open,
      ),
    ).toBe(false);
    if (variant === "full" || variant === "extreme") {
      await page.addStyleTag({
        content:
          '[data-testid="historical-review"] figcaption, [data-testid="historical-review"] figure > div { font-size: 24px; line-height: 32px; }',
      });
      expect(
        await axis.evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
      ).toBe(24);
      expect(
        await history.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(writes).toBe(0);
  });
}
