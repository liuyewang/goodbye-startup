import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("settled recap excludes stale AI totals and comparison never calls AI", async ({
  page,
}) => {
  const stale = "17 paying customers and about two months of runway.";
  const state = {
    schemaVersion: 1,
    version: 6,
    status: "completed",
    day: 180,
    cashCents: 161700,
    customers: 22,
    revenueCents: 22000,
    monthlyCostCents: 150000,
    morale: 50,
    runwayMonths: 161700 / 128000,
    setup: {
      cashCents: 1000000,
      monthlyCostCents: 150000,
      teamSize: 1,
      employment: "part-time",
    },
    history: [
      {
        day: 150,
        cashCents: 289700,
        customers: 17,
        revenueCents: 17000,
        monthlyCostCents: 150000,
        morale: 50,
        runwayMonths: 289700 / 133000,
      },
      {
        day: 180,
        cashCents: 161700,
        customers: 22,
        revenueCents: 22000,
        monthlyCostCents: 150000,
        morale: 50,
        runwayMonths: 161700 / 128000,
      },
    ],
  };
  const proposal = {
    visits: 100,
    signupRate: 0.1,
    paidRate: 0.1,
    monthlyChurn: 0.05,
    priceCents: 1000,
    monthlyCostCents: 150000,
    oneTimeCostCents: 0,
    moraleDelta: 0,
    scenario: stale,
    insights: [{ text: "Validate the offer.", metric: "customers" }],
    choices: ["Interview", "Test", "Pause"],
  };
  await page.addInitScript(
    ({ proposal }) => {
      localStorage.setItem("goodbye-language", "en");
      localStorage.setItem(
        "gs_transcript_v1_feedback",
        JSON.stringify({
          schemaVersion: 1,
          runId: "feedback",
          idea: "Tutor reminders",
          pending: null,
          turns: [
            { version: 6, day: 180, decision: "Test reminders", proposal },
          ],
        }),
      );
    },
    { proposal },
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
            attempts: 6,
            runId: "feedback",
            expired: false,
            eligibleAt: null,
          },
          run: { id: "feedback", state, expiresAt: Date.now() + 86400000 },
          ready: true,
          mode: "mock",
        },
        requestId: "fixture",
      },
    });
  });
  await page.goto("/simulator");
  await page.getByRole("combobox").first().selectOption("en");
  const recap = page.getByTestId("settled-review");
  await expect(recap.getByText("22", { exact: true })).toBeVisible();
  await expect(recap.getByText("150", { exact: true })).toBeVisible();
  await expect(recap.getByText("128", { exact: true })).toBeVisible();
  await expect(page.getByText(stale, { exact: true }).first()).toBeHidden();
  await recap.locator("summary").click();
  await recap.getByLabel("Comparison value (USD)").fill("20");
  await expect(
    recap.getByRole("img", {
      name: "Hypothetical cash paths over months 0 to 3",
    }),
  ).toBeVisible();
  await expect(recap.getByText("150", { exact: true })).toBeVisible();
  const downloadEvent = page.waitForEvent("download");
  await recap.getByRole("button", { name: "Download one-page review" }).click();
  const download = await downloadEvent;
  const text = await readFile((await download.path())!, "utf8");
  expect(text).toContain("Customers needed to break even: 150");
  expect(text).toContain("Paying customers: 22");
  expect(text).not.toContain(stale);
  await recap.getByLabel("Comparison value (USD)").fill("0.001");
  await expect(recap.getByRole("status")).toBeVisible();
  await recap.getByLabel("Comparison value (USD)").fill("-1");
  await expect(recap.getByRole("status")).toBeVisible();
  await page.getByRole("combobox").first().selectOption("zh");
  await expect(
    recap.getByRole("heading", { name: "你的一页复盘" }),
  ).toBeVisible();
  expect(writes).toBe(0);
});

test("review handles unknown pricing, free pricing and zero costs", async ({
  page,
}) => {
  for (const variant of ["unknown", "free", "zero-cost"]) {
    const cost = variant === "zero-cost" ? 0 : 150000;
    const snapshot = {
      day: 180,
      cashCents: 161700,
      customers: variant === "free" ? 22 : 0,
      revenueCents: 0,
      monthlyCostCents: cost,
      morale: 50,
      runwayMonths: cost === 0 ? null : 161700 / cost,
    };
    await page.route("**/api/session", (route) =>
      route.fulfill({
        json: {
          data: {
            session: {
              used: true,
              attempts: 6,
              runId: variant,
              expired: false,
              eligibleAt: null,
            },
            run: {
              id: variant,
              state: {
                ...snapshot,
                schemaVersion: 1,
                version: 6,
                status: "completed",
                setup: {
                  cashCents: 1000000,
                  monthlyCostCents: 150000,
                  teamSize: 1,
                  employment: "part-time",
                },
                history: [snapshot],
              },
              expiresAt: Date.now() + 86400000,
            },
            ready: true,
            mode: "mock",
          },
          requestId: "edge",
        },
      }),
    );
    await page.goto("/simulator");
    await page.getByRole("combobox").first().selectOption("en");
    const review = page.getByTestId("settled-review");
    await expect(review).toBeVisible();
    const expected =
      variant === "zero-cost"
        ? "Customers needed to break even: 0"
        : variant === "free"
          ? "Unavailable at this price"
          : "Unknown saved unit price";
    const event = page.waitForEvent("download");
    await review
      .getByRole("button", { name: "Download one-page review" })
      .click();
    const file = await event;
    const text = await readFile((await file.path())!, "utf8");
    expect(text).toContain(expected);
    expect(text).not.toMatch(/NaN|Infinity/);
    await page.unroute("**/api/session");
  }
});
