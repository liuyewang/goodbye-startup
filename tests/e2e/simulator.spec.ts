import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
test("complete simulation, recovery, export and used quota", async ({
  page,
}) => {
  await page.goto("/simulator");
  await page
    .getByLabel("Your startup idea")
    .fill(
      "A subscription tool that helps independent bookshops manage inventory.",
    );
  await page.getByLabel("Monthly operating cost (USD)").fill("100");
  await page
    .getByRole("button", { name: "Begin simulation", exact: true })
    .click();
  await expect(page.getByTestId("sim-day")).toHaveText("Day 0");
  await expect(
    page.getByRole("button", {
      name: "Interview potential customers",
      exact: true,
    }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", {
      name: "Interview potential customers",
      exact: true,
    }),
  ).toBeVisible();
  for (const day of [5, 90, 120, 150, 180]) {
    await page
      .getByRole("button", {
        name: "Interview potential customers",
        exact: true,
      })
      .click();
    await expect(page.getByTestId("sim-day")).toHaveText("Day " + day);
  }
  await expect(
    page.getByRole("heading", { name: "Simulation complete", exact: true }),
  ).toBeVisible();
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export local record", exact: true })
    .click();
  expect((await download).suggestedFilename()).toContain(".json");
  await page
    .getByRole("button", { name: "Start another simulation", exact: true })
    .click();
  await expect(
    page.getByText("Your free simulation has been used.", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("language switch preserves setup, corrupted storage is recoverable, IME does not submit", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("gs_game_state", "{broken"),
  );
  await page.goto("/simulator");
  const legacyDownload = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export previous save", exact: true })
    .click();
  const legacy = await legacyDownload;
  expect(await readFile(await legacy.path(), "utf8")).toBe("{broken");
  await expect(
    page.getByText("A previous local save is available for export.", {
      exact: true,
    }),
  ).toBeVisible();
  const idea = page.getByLabel("Your startup idea");
  await idea.fill("保留这段输入");
  await page.getByLabel("Language").selectOption("zh");
  await expect(page.getByLabel("你的创业想法")).toHaveValue("保留这段输入");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh");
  await page.getByLabel("每月运营成本（美元）").fill("100");
  await page.getByRole("button", { name: "开始模拟", exact: true }).click();
  const input = page.getByLabel("你的决策");
  await input.fill("正在输入");
  // Construct the event in the page to exercise the native isComposing flag.
  const pressSubmitShortcut = (isComposing: boolean) =>
    input.evaluate((element, composing) => {
      const event = new KeyboardEvent("keydown", {
        key: "Enter",
        ctrlKey: true,
        isComposing: composing,
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(event);
      return {
        isComposing: event.isComposing,
        prevented: event.defaultPrevented,
      };
    }, isComposing);
  expect(await pressSubmitShortcut(true)).toEqual({
    isComposing: true,
    prevented: false,
  });
  await expect(page.getByTestId("sim-day")).toHaveText("第 0 天");
  expect(await pressSubmitShortcut(false)).toEqual({
    isComposing: false,
    prevented: true,
  });
  await expect(page.getByTestId("sim-day")).toHaveText("第 5 天");
});
test("failed inference preserves decision and allows explicit retry", async ({
  page,
}) => {
  await page.goto("/simulator");
  await page
    .getByLabel("Your startup idea")
    .fill("A booking tool for independent workshops.");
  let failed = false;
  await page.route("**/api/simulations/*/turn", async (route) => {
    if (!failed) {
      failed = true;
      await route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({
          error: "AI_UNAVAILABLE",
          code: "AI_UNAVAILABLE",
          requestId: "test",
        }),
      });
    } else await route.continue();
  });
  await page
    .getByRole("button", { name: "Begin simulation", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "temporarily unavailable",
  );
  await page
    .getByRole("button", { name: "Submit decision", exact: true })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Interview potential customers",
      exact: true,
    }),
  ).toBeVisible();
});

test("local text remains exportable after deleting server save and reloading", async ({
  page,
}) => {
  await page.goto("/simulator");
  await page
    .getByLabel("Your startup idea")
    .fill("Keep this local record even after server deletion.");
  await page
    .getByRole("button", { name: "Begin simulation", exact: true })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Interview potential customers",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete server save", exact: true })
    .click();
  await page.getByRole("button", { name: "Delete save", exact: true }).click();
  await expect(
    page.getByText("Your free simulation has been used.", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Export local record", exact: true }),
  ).toBeVisible();
});

test("a delete confirmation only applies to the save that opened it", async ({
  page,
  baseURL,
}) => {
  await page.route("**/api/simulations/*/turn", (route) =>
    route.fulfill({ status: 502, json: { code: "AI_UNAVAILABLE" } }),
  );
  await page.goto("/simulator");
  await page
    .getByLabel("Your startup idea")
    .fill("A draft that can be replaced.");
  await page
    .getByRole("button", { name: "Begin simulation", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "temporarily unavailable",
  );
  await page
    .getByRole("button", { name: "Delete server save", exact: true })
    .click();
  const confirm = page.getByRole("button", {
    name: "Delete save",
    exact: true,
  });
  await expect(confirm).toBeVisible();
  const {
    data: { run: original },
  } = await (await page.request.get("/api/session")).json();
  const headers = { Origin: baseURL! };
  expect(
    (
      await page.request.delete(`/api/simulations/${original.id}`, { headers })
    ).ok(),
  ).toBe(true);
  const replacement = await page.request.post("/api/simulations", {
    headers,
    data: {
      setup: {
        cashCents: 20000,
        monthlyCostCents: 100,
        teamSize: 1,
        employment: "part-time",
      },
    },
  });
  expect(replacement.ok()).toBe(true);
  expect((await replacement.json()).data.run.id).not.toBe(original.id);
  await page
    .getByRole("button", { name: "Refresh saved state", exact: true })
    .click();
  await expect(page.getByText("$200.00", { exact: true })).toBeVisible();
  await expect(confirm).toBeHidden();
  await expect(page.getByLabel("Your startup idea")).toHaveValue("");
});

test("refresh retains the setup idea after a lost create response", async ({
  page,
}) => {
  await page.route("**/api/simulations", async (route) => {
    expect((await route.fetch()).ok()).toBe(true);
    await route.fulfill({ status: 503, json: { code: "SERVICE_UNAVAILABLE" } });
  });
  await page.goto("/simulator");
  const idea = page.getByLabel("Your startup idea");
  const typedIdea = "A tool for local businesses with an interrupted setup.";
  await idea.fill(typedIdea);
  await page
    .getByRole("button", { name: "Begin simulation", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Refresh saved state", exact: true })
    .click();
  await expect(page.getByTestId("sim-day")).toHaveText("Day 0");
  await expect(idea).toHaveValue(typedIdea);
  await page
    .getByRole("textbox", { name: "Your decision", exact: true })
    .fill("Introduce the scenario");
  await page
    .getByRole("button", { name: "Submit decision", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Improve onboarding", exact: true }),
  ).toBeVisible();
});

test("stale tabs cannot erase a committed local turn", async ({
  page,
  context,
}) => {
  await page.goto("/simulator");
  await page
    .getByLabel("Your startup idea")
    .fill("A useful small subscription product.");
  await page
    .getByRole("button", { name: "Begin simulation", exact: true })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Interview potential customers",
      exact: true,
    }),
  ).toBeVisible();
  const stale = await context.newPage();
  await stale.goto("/simulator");
  await expect(
    stale.getByRole("button", {
      name: "Interview potential customers",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Interview potential customers", exact: true })
    .click();
  await expect(page.getByTestId("sim-day")).toHaveText("Day 5");
  await stale
    .getByRole("button", { name: "Improve onboarding", exact: true })
    .click();
  await expect(stale.getByRole("alert")).toContainText("another tab");
  await stale.reload();
  const latest = stale.getByTestId("history-stage").last();
  await expect(latest.locator("summary")).toContainText("Day 5");
  await latest.locator("summary").click();
  await expect(
    latest.getByText("Interview potential customers", { exact: true }),
  ).toBeVisible();
});
test("lost cookies retain a read-only local export", async ({
  page,
  context,
}) => {
  await page.goto("/simulator");
  await page
    .getByLabel("Your startup idea")
    .fill("Remember local text without server identity.");
  await page
    .getByRole("button", { name: "Begin simulation", exact: true })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Interview potential customers",
      exact: true,
    }),
  ).toBeVisible();
  await context.clearCookies();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Export local record", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Your startup idea")).toBeVisible();
});
test("in-app refresh preserves memory when storage writes fail", async ({
  page,
}) => {
  await page.goto("/simulator");
  await page
    .getByLabel("Your startup idea")
    .fill("Preserve memory on storage failure.");
  await page
    .getByRole("button", { name: "Begin simulation", exact: true })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Interview potential customers",
      exact: true,
    }),
  ).toBeVisible();
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("quota", "QuotaExceededError");
    };
  });
  await page
    .getByRole("button", { name: "Interview potential customers", exact: true })
    .click();
  await expect(page.getByTestId("sim-day")).toHaveText("Day 5");
  let failed = false;
  await page.route("**/api/simulations/*/turn", async (route) => {
    if (!failed) {
      failed = true;
      await route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({ code: "AI_UNAVAILABLE" }),
      });
    } else await route.continue();
  });
  await page
    .getByRole("button", { name: "Interview potential customers", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Refresh saved state", exact: true })
    .click();
  const latest = page.getByTestId("history-stage").last();
  await expect(latest.locator("summary")).toContainText("Day 5");
  await latest.locator("summary").click();
  await expect(
    latest.getByText("Interview potential customers", { exact: true }),
  ).toBeVisible();
});

test("an ambiguous 503 after commit replays state without another AI attempt", async ({
  page,
}) => {
  const originalDecision = "Introduce the startup scenario";
  const newDecision = "Interview three store owners.";
  const requests: { requestId: string; decision: string }[] = [];
  await page.goto("/simulator");
  await page
    .getByLabel("Your startup idea")
    .fill("A small tool with an interrupted network response.");
  let interrupted = false;
  await page.route("**/api/simulations/*/turn", async (route) => {
    const { requestId, decision } = route.request().postDataJSON();
    requests.push({ requestId, decision });
    if (!interrupted) {
      interrupted = true;
      expect((await route.fetch()).ok()).toBe(true);
      await route.fulfill({
        status: 503,
        json: { code: "SERVICE_UNAVAILABLE" },
      });
    } else if (requests.length === 2) {
      await route.fulfill({ status: 503, json: { code: "ORIGIN_TIMEOUT" } });
    } else if (requests.length === 3) {
      await route.fulfill({ status: 429, json: { code: "RATE_LIMIT" } });
    } else await route.continue();
  });
  await page
    .getByRole("button", { name: "Begin simulation", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "temporarily unavailable",
  );
  const draft = page.getByRole("textbox", {
    name: "Your unsent decision draft",
  });
  await draft.fill(newDecision);
  await expect(page.getByText(originalDecision, { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Submit decision" }),
  ).toBeDisabled();
  await draft.press("Control+Enter");
  await page.getByRole("button", { name: "Refresh saved state" }).click();
  await expect(draft).toHaveValue(newDecision);
  await page.reload();
  await expect(draft).toHaveValue(newDecision);
  expect(requests).toHaveLength(1);
  await page.getByRole("button", { name: "Retry original decision" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "temporarily unavailable",
  );
  await expect(draft).toHaveValue(newDecision);
  await page.getByRole("button", { name: "Retry original decision" }).click();
  await expect(page.getByRole("alert")).toContainText("Too many requests");
  await expect(draft).toHaveValue(newDecision);
  await expect(
    page.getByRole("button", { name: "Submit decision" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Retry original decision" }).click();
  await expect(
    page.getByText(
      "Some AI text is missing from this browser. The server has only the numerical record; no text can be recovered from it.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Your decision", exact: true }),
  ).toHaveValue(newDecision);
  const session = await page.request.get("/api/session");
  const data = await session.json();
  expect(data.data.session.attempts).toBe(1);
  expect(data.data.run.state.version).toBe(1);
  expect(requests[0].decision).toBe(originalDecision);
  expect(requests.slice(1, 4)).toEqual(Array(3).fill(requests[0]));
  await page
    .getByRole("button", { name: "Submit decision", exact: true })
    .click();
  await expect(page.getByTestId("sim-day")).toHaveText("Day 5");
  const next = await (await page.request.get("/api/session")).json();
  expect(next.data.session.attempts).toBe(2);
  expect(next.data.run.state.version).toBe(2);
  expect(requests[4].decision).toBe(newDecision);
  expect(requests[4].requestId).not.toBe(requests[0].requestId);
});

test("a second tab cannot overwrite a stored request awaiting confirmation", async ({
  page,
  context,
}) => {
  await page.goto("/simulator");
  await page.getByLabel("Your startup idea").fill("A small workshop tool.");
  await page.getByRole("button", { name: "Begin simulation" }).click();
  await expect(page.getByTestId("sim-day")).toHaveText("Day 0");
  const second = await context.newPage();
  await second.goto("/simulator");
  await expect(second.getByTestId("sim-day")).toHaveText("Day 0");
  await page.route("**/api/simulations/*/turn", async (route) => {
    await route.fetch();
    await route.abort("failed");
  });
  await page
    .getByRole("textbox", { name: "Your decision", exact: true })
    .fill("Original workshop decision");
  await page.getByRole("button", { name: "Submit decision" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "connection was interrupted",
  );

  const decisions: string[] = [];
  await second.route("**/api/simulations/*/turn", async (route) => {
    decisions.push(route.request().postDataJSON().decision);
    await route.continue();
  });
  await second
    .getByRole("textbox", { name: "Your decision", exact: true })
    .fill("Keep this second-tab draft");
  await second.getByRole("button", { name: "Submit decision" }).click();
  await expect(
    second.getByText("Original workshop decision", { exact: true }),
  ).toBeVisible();
  expect(decisions).toEqual([]);
  await second.getByRole("button", { name: "Retry original decision" }).click();
  await expect(second.getByTestId("sim-day")).toHaveText("Day 5");
  await expect(
    second.getByRole("textbox", { name: "Your decision", exact: true }),
  ).toHaveValue("Keep this second-tab draft");
  expect(decisions).toEqual(["Original workshop decision"]);
});
