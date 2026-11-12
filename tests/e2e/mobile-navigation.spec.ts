import { test, expect } from "@playwright/test";
import { pages } from "../../src/content/registry";

test("hero metrics stay within their cards on narrow EN and ZH screens", async ({
  page,
}) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 740 });
    await page.goto("/");
    for (const language of ["en", "zh"]) {
      await page.getByRole("combobox").first().selectOption(language);
      const cards = page.getByTestId("hero-stats").locator(":scope > div");
      await expect(cards).toHaveCount(3);
      const geometry = await cards.evaluateAll((elements) =>
        elements.map((el) => ({
          width: el.clientWidth,
          content: el.scrollWidth,
          x: el.getBoundingClientRect().x,
          y: el.getBoundingClientRect().y,
        })),
      );
      for (const card of geometry)
        expect(card.content).toBeLessThanOrEqual(card.width);
      if (width < 640) expect(geometry[1].y).toBeGreaterThan(geometry[0].y);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
});

test("every public page supports keyboard back-to-top with reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 360 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of pages) {
    await page.goto(route.path);
    await page.getByRole("combobox").first().selectOption("en");
    await page.evaluate(() =>
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "instant",
      }),
    );
    const button = page.getByRole("button", {
      name: "Back to top",
      exact: true,
    });
    await expect(button).toBeVisible();
    await button.focus();
    await page.keyboard.press("Enter");
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    await expect(page.locator("#main-content")).toBeFocused();
    await expect(button).toHaveCount(0);
  }
  await page.getByRole("combobox").first().selectOption("zh");
  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await expect(
    page.getByRole("button", { name: "回到顶部", exact: true }),
  ).toBeVisible();
});
