import { test, expect, type Route } from "@playwright/test";

for (const reduced of [true, false]) {
  test(`life loading scroll and feedback, reduced motion ${reduced}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({
      reducedMotion: reduced ? "reduce" : "no-preference",
    });
    let pending: Route | undefined;
    await page.route("https://deanchen.me/sv-life-reboot/**", (route) => {
      pending = route;
    });
    await page.goto("/simulator#silicon-valley");
    await page.getByRole("combobox").first().selectOption("en");
    const load = page.getByRole("button", {
      name: "Load original game",
      exact: true,
    });
    if (reduced) {
      await load.focus();
      await load.press("Enter");
      await expect(
        page.getByRole("button", { name: "Close external game", exact: true }),
      ).toBeFocused();
    } else await load.click();
    const region = page.getByTestId("life-game-region");
    await expect(region).toBeVisible();
    await expect(region.getByRole("status")).toContainText(
      "Loading the original game",
    );
    await expect
      .poll(async () => Math.round((await region.boundingBox())!.y))
      .toBeGreaterThanOrEqual(64);
    await expect
      .poll(async () => Math.round((await region.boundingBox())!.y))
      .toBeLessThanOrEqual(136);
    await page.getByRole("combobox").first().selectOption("zh");
    await expect(region.getByRole("status")).toContainText("正在加载原版游戏");
    await expect.poll(() => !!pending).toBe(true);
    await pending!.fulfill({
      contentType: "text/html",
      body: "<!doctype html><html><body><button autofocus>Loaded game fixture</button></body></html>",
    });
    await expect(region.getByRole("status")).toHaveCount(0);
    await expect(
      page.frameLocator("iframe").getByText("Loaded game fixture"),
    ).toBeVisible();
    await page
      .frameLocator("iframe")
      .getByRole("button", { name: "Loaded game fixture" })
      .click();
    await region
      .getByRole("button", { name: "关闭外部游戏", exact: true })
      .click();
    await expect(page.locator("iframe")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "加载原版游戏", exact: true }),
    ).toBeFocused();
  });
}

test("life slow-load notice does not hide the game or survive closing", async ({
  page,
}) => {
  await page.clock.install();
  await page.route("https://deanchen.me/sv-life-reboot/**", () => {});
  await page.goto("/simulator#silicon-valley");
  await page.getByRole("combobox").first().selectOption("en");
  await page
    .getByRole("button", { name: "Load original game", exact: true })
    .click();
  const region = page.getByTestId("life-game-region");
  await expect(region.getByRole("status")).toContainText(
    "Loading the original game",
  );
  await expect(page.getByTestId("life-loading-overlay")).toHaveCount(0);
  await expect(page.locator("iframe")).not.toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await page.clock.fastForward(16000);
  await expect(region.getByRole("status")).toContainText(
    "Taking longer than expected",
  );
  await expect(region.getByTestId("life-loading-overlay")).toHaveCount(0);
  await expect(page.locator("iframe")).toBeVisible();
  await region
    .getByRole("button", { name: "Close external game", exact: true })
    .click();
  await page.clock.fastForward(30000);
  await expect(region).toHaveCount(0);
  await page
    .getByRole("button", { name: "Load original game", exact: true })
    .click();
  await expect(
    page.getByTestId("life-game-region").getByRole("status"),
  ).toContainText("Loading the original game");
});

test("interactive iframe stays clickable and scrollable while a resource is pending", async ({
  page,
}) => {
  await page.setViewportSize({ width: 412, height: 923 });
  await page.route("https://deanchen.me/sv-life-reboot/**", async (route) => {
    if (route.request().url().endsWith("pending.png")) return;
    await route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><html><body><button onclick="this.textContent='Clicked'">Click while loading</button><p>Scrollable original content</p><div style="height:1800px"></div><p id="bottom">Bottom content</p><img src="pending.png"></body></html>`,
    });
  });
  await page.goto("/simulator#silicon-valley");
  await page.getByRole("combobox").first().selectOption("en");
  await page
    .getByRole("button", { name: "Load original game", exact: true })
    .click();
  const region = page.getByTestId("life-game-region");
  await expect(region.getByRole("status")).toContainText(
    "Loading the original game",
  );
  await page
    .frameLocator("iframe")
    .getByRole("button", { name: "Click while loading" })
    .click({ timeout: 2000 });
  await expect(
    page
      .frameLocator("iframe")
      .getByRole("button", { name: "Clicked", exact: true }),
  ).toBeVisible();
  const frame = page
    .frames()
    .find((f) => f.url().startsWith("https://deanchen.me/"))!;
  const box = (await page.locator("iframe").boundingBox())!;
  const x = box.x + box.width / 2;
  const y = Math.min(
    page.viewportSize()!.height - 20,
    Math.max(100, box.y + 200),
  );
  expect(
    await page.evaluate(
      ({ x, y }) => document.elementFromPoint(x, y)?.tagName,
      { x, y },
    ),
  ).toBe("IFRAME");
  await page.mouse.move(x, y);
  await page.mouse.wheel(0, 400);
  await expect.poll(() => frame.evaluate(() => scrollY)).toBeGreaterThan(0);
  await expect(region.getByRole("status")).toContainText(
    "Loading the original game",
  );
});
