import { test, expect, type Page } from "@playwright/test";
import {
  createSimulation,
  settleTurn,
} from "../../src/domain/simulation/engine";
import type { Proposal } from "../../src/domain/simulation/schema";

test.use({ timezoneId: "Asia/Shanghai" });

const setup = {
  cashCents: 1000000,
  monthlyCostCents: 100,
  teamSize: 1,
  employment: "part-time" as const,
};
const proposal: Proposal = {
  visits: 100,
  signupRate: 0.1,
  paidRate: 0.1,
  monthlyChurn: 0.1,
  priceCents: 1000,
  monthlyCostCents: 100,
  oneTimeCostCents: 0,
  moraleDelta: 0,
  scenario: "Synthetic daily quota UI fixture",
  insights: [{ text: "Check assumptions", metric: "cash" }],
  choices: ["Interview", "Test", "Pause"],
};
async function fixture(
  page: Page,
  available: boolean,
  fail: boolean | "lost" = false,
) {
  let state = createSimulation(setup);
  for (let i = 0; i < 6; i++) state = settleTurn(state, proposal);
  const oldId = "11111111-1111-4111-8111-111111111111";
  const newId = "22222222-2222-4222-8222-222222222222";
  let run = { id: oldId, state, expiresAt: Date.now() + 86400000 };
  const writes: { method: string; body: unknown }[] = [];
  await page.addInitScript(
    ({ oldId, proposal }) => {
      localStorage.setItem("goodbye-language", "en");
      localStorage.setItem(
        `gs_transcript_v1_${oldId}`,
        JSON.stringify({
          schemaVersion: 1,
          runId: oldId,
          idea: "Yesterday's original idea",
          pending: null,
          turns: [
            { version: 6, day: 180, decision: "Original choice", proposal },
          ],
        }),
      );
    },
    { oldId, proposal },
  );
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    if (request.method() === "GET") {
      await route.fulfill({
        json: {
          data: {
            session: {
              used: !available,
              attempts: 6,
              runId: run.id,
              expired: false,
              eligibleAt: available ? null : Date.now() + 86400000,
            },
            run,
            ready: true,
            mode: "mock",
          },
          requestId: "fixture",
        },
      });
      return;
    }
    writes.push({ method: request.method(), body: request.postDataJSON() });
    if (fail === true) {
      await route.fulfill({
        status: 409,
        json: {
          error: "VERSION_CONFLICT",
          code: "VERSION_CONFLICT",
          requestId: "fixture",
        },
      });
    } else if (new URL(request.url()).pathname === "/api/simulations") {
      run = { ...run, id: newId, state: createSimulation(setup) };
      if (fail === "lost" && writes.length === 1) {
        await route.abort();
        return;
      }
      await route.fulfill({ json: { data: { run }, requestId: "fixture" } });
    } else {
      run = { ...run, state: settleTurn(run.state, proposal) };
      await route.fulfill({
        json: {
          data: { run, proposal, replayed: false },
          requestId: "fixture",
        },
      });
    }
  });
  await page.goto("/simulator");
  await expect(
    page.getByRole("heading", { name: "Simulation complete", exact: true }),
  ).toBeVisible();
  return { oldId, writes };
}
test("next-day eligibility opens new setup and replaces only the reviewed old run", async ({
  page,
}) => {
  const { oldId, writes } = await fixture(page, true);
  await page
    .getByRole("button", { name: "Start another simulation", exact: true })
    .click();
  await expect(page.getByLabel("Your startup idea")).toHaveValue("");
  expect(writes).toHaveLength(0);
  await page.getByLabel("Your startup idea").fill("Today's new idea");
  await page
    .getByRole("button", { name: "Begin simulation", exact: true })
    .click();
  await expect(page.getByTestId("sim-day")).toHaveText("Day 0");
  expect(writes[0]).toMatchObject({
    method: "POST",
    body: { replaceRunId: oldId, timeZone: "Asia/Shanghai" },
  });
  expect(writes.map((x) => x.method)).toEqual(["POST", "POST"]);
  expect(
    await page.evaluate(
      (id) => localStorage.getItem(`gs_transcript_v1_${id}`),
      oldId,
    ),
  ).toContain("Yesterday's original idea");
});
test("cancelling next-day setup preserves the completed simulation", async ({
  page,
}) => {
  const { writes } = await fixture(page, true);
  await page
    .getByRole("button", { name: "Start another simulation", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Return to saved simulation", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Simulation complete", exact: true }),
  ).toBeVisible();
  expect(writes).toHaveLength(0);
});
test("failed replacement preserves input and can recover the old simulation", async ({
  page,
}) => {
  const { writes } = await fixture(page, true, true);
  await page
    .getByRole("button", { name: "Start another simulation", exact: true })
    .click();
  await page
    .getByLabel("Your startup idea")
    .fill("Keep my new idea after a conflict");
  await page
    .getByRole("button", { name: "Begin simulation", exact: true })
    .click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByLabel("Your startup idea")).toHaveValue(
    "Keep my new idea after a conflict",
  );
  await page
    .getByRole("button", { name: "Return to saved simulation", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Simulation complete", exact: true }),
  ).toBeVisible();
  expect(writes).toHaveLength(1);
});
test("same-day quota explains the local midnight reset in English and Chinese", async ({
  page,
}) => {
  const { writes } = await fixture(page, false);
  await page
    .getByRole("button", { name: "Start another simulation", exact: true })
    .click();
  await expect(
    page.getByText(
      "Today's free simulation has been used. A new one is available at midnight in your device’s time zone.",
      { exact: true },
    ),
  ).toBeVisible();
  await page.getByLabel("Language").selectOption("zh");
  await expect(
    page.getByText("今天的免费模拟资格已使用。设备系统时区的当地零点刷新。", {
      exact: true,
    }),
  ).toBeVisible();
  expect(writes).toHaveLength(0);
});

test("an open quota page renews from the server at its midnight without reloading", async ({
  page,
}) => {
  let reads = 0;
  const resetAt = Date.now() + 6000;
  await page.route("**/api/session?*", async (route) => {
    reads++;
    await route.fulfill({
      json: {
        data: {
          session: {
            used: reads === 1,
            attempts: reads === 1 ? 6 : 0,
            runId: null,
            expired: false,
            eligibleAt: reads === 1 ? resetAt : null,
            timeZone: "Asia/Shanghai",
          },
          run: null,
          ready: true,
          mode: "mock",
        },
        requestId: "fixture",
      },
    });
  });
  await page.goto("/simulator");
  await expect(
    page.getByText(
      "Today's free simulation has been used. A new one is available at midnight in your device’s time zone.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByLabel("Your startup idea")).toBeVisible({
    timeout: 12000,
  });
  expect(reads).toBeGreaterThan(1);
});

test("a lost replacement response retries the same creation before starting AI", async ({
  page,
}) => {
  const { writes } = await fixture(page, true, "lost");
  await page
    .getByRole("button", { name: "Start another simulation", exact: true })
    .click();
  await page.getByLabel("Your startup idea").fill("Retry the same new idea");
  await page
    .getByRole("button", { name: "Begin simulation", exact: true })
    .click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page
    .getByRole("button", { name: "Begin simulation", exact: true })
    .click();
  await expect(page.getByTestId("sim-day")).toHaveText("Day 0");
  expect(writes).toHaveLength(3);
  expect(writes[0].body).toEqual(writes[1].body);
  expect(writes[0].body).toHaveProperty("creationRequestId");
});
