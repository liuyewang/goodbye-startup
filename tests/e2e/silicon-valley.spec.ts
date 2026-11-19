import { test, expect } from "@playwright/test";

test("external life module loads only on request and preserves startup input", async ({
  page,
}) => {
  let external = 0;
  let writes = 0;
  page.on("request", (r) => {
    if (r.url().includes("deanchen.me")) external++;
    if (r.url().includes("/api/") && r.method() !== "GET") writes++;
  });
  await page.route("https://deanchen.me/sv-life-reboot/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: '<!doctype html><html lang="zh"><body>Original game fixture</body></html>',
    }),
  );
  await page.goto("/simulator");
  await page.getByRole("combobox").first().selectOption("en");
  await page
    .getByRole("textbox", { name: "Your startup idea", exact: true })
    .fill("Keep my unsubmitted idea");
  await page
    .getByRole("button", { name: "Silicon Valley Life", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Silicon Valley Life Reboot",
      exact: true,
    }),
  ).toBeVisible();
  expect(external).toBe(0);
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.getByRole("button", { name: "Load original game" }).click();
  const frame = page.locator("iframe");
  await expect(frame).toHaveAttribute(
    "sandbox",
    "allow-scripts allow-same-origin",
  );
  await expect(frame).toHaveAttribute("referrerpolicy", "no-referrer");
  await expect(
    page.frameLocator("iframe").getByText("Original game fixture"),
  ).toBeVisible();
  expect(external).toBe(1);
  await page
    .getByRole("button", { name: "Startup simulation", exact: true })
    .click();
  await expect(frame).toHaveCount(0);
  await expect(
    page.getByRole("textbox", { name: "Your startup idea", exact: true }),
  ).toHaveValue("Keep my unsubmitted idea");
  expect(writes).toBe(0);
});

test("direct module link is bilingual and never auto-loads the external game", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto("/simulator#silicon-valley");
  await page.getByRole("combobox").first().selectOption("en");
  const load = page.getByRole("button", { name: "Load original game" });
  await expect(load).toBeVisible();
  const skip = page.getByRole("link", { name: "Skip to content", exact: true });
  await skip.focus();
  await skip.press("Enter");
  await expect(load).toBeVisible();
  expect((await load.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Open original in a new tab" }),
  ).toHaveAttribute("href", "https://deanchen.me/sv-life-reboot/");
  await page.getByRole("combobox").first().selectOption("zh");
  await expect(
    page.getByRole("heading", { name: "硅谷人生重开模拟器", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("module switching preserves an active mock run and unsubmitted decision", async ({
  page,
}) => {
  let turns = 0;
  page.on("request", (r) => {
    if (r.method() === "POST" && r.url().endsWith("/turn")) turns++;
  });
  await page.goto("/simulator");
  await page.getByRole("combobox").first().selectOption("en");
  await expect(
    page.getByText("Local demo mode · no paid AI calls", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Your startup idea", exact: true })
    .fill("Synthetic local module switching");
  await page
    .getByRole("button", { name: "Begin simulation", exact: true })
    .click();
  await expect(page.getByTestId("sim-day")).toHaveText("Day 0");
  await page
    .getByRole("textbox", { name: "Your decision", exact: true })
    .fill("Keep this unsubmitted decision");
  const before = turns;
  await page
    .getByRole("button", { name: "Silicon Valley Life", exact: true })
    .click();
  await expect(page.locator("iframe")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Startup simulation", exact: true })
    .click();
  await expect(page.getByTestId("sim-day")).toHaveText("Day 0");
  await expect(
    page.getByRole("textbox", { name: "Your decision", exact: true }),
  ).toHaveValue("Keep this unsubmitted decision");
  expect(turns).toBe(before);
});
