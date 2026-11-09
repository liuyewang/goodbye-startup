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
