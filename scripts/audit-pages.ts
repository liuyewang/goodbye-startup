import assert from "node:assert/strict";
import { pages, SITE_URL } from "../src/content/registry.ts";
const base = process.env.TEST_BASE_URL ?? "http://127.0.0.1:5173";
for (const page of pages) {
  const response = await fetch(base + page.path, {
    signal: AbortSignal.timeout(30000),
  });
  assert.equal(response.status, 200, page.path);
  const html = await response.text();
  const title = html
    .match(/<title[^>]*>([^<]+)<\/title>/)?.[1]
    ?.replaceAll("&amp;", "&");
  assert.ok(title && title.length <= 60, `${page.path}: title ${title}`);
  const canonicalTag = html.match(/<link[^>]+rel="canonical"[^>]*>/)?.[0];
  const canonical = canonicalTag?.match(/href="([^"]+)"/)?.[1];
  assert.equal(
    canonical ? new URL(canonical).href : null,
    new URL(SITE_URL + page.path).href,
    page.path + " canonical",
  );
  const og = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
  assert.equal(
    og ? new URL(og).href : null,
    new URL(SITE_URL + page.path).href,
    page.path + " OG",
  );
  for (const match of html.matchAll(
    /<script[^>]+type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs,
  ))
    JSON.parse(match[1]);
  // Content hubs must remain discoverable in server-rendered navigation.
  const footer = html.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/)?.[0];
  assert.ok(footer, page.path + " footer");
  for (const hub of ["/blog", "/guides"])
    assert.ok(footer.includes(`href="${hub}"`), page.path + " link to " + hub);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  console.log("PASS", page.path, title.length);
}
for (const path of [
  "/robots.txt",
  "/sitemap.xml",
  "/blog/feed.xml",
  "/llms.txt",
  "/content/index.md",
]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  if (path === "/sitemap.xml") {
    assert.ok(response.headers.get("content-type")?.includes("xml"));
    const xml = await response.text();
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => new URL(match[1]).href,
    );
    assert.deepEqual(
      locations.sort(),
      pages.map((page) => new URL(SITE_URL + page.path).href).sort(),
      "Sitemap must list every public canonical URL exactly once",
    );
  }
  if (path === "/robots.txt")
    assert.ok(
      (await response.text()).includes(`Sitemap: ${SITE_URL}/sitemap.xml`),
    );
  console.log("PASS", path);
}
console.log("Public page audit passed.");
