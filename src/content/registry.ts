import type { Metadata } from "next";
import { articles } from "./articles.ts";
import { en } from "../i18n/en.ts";
export { articles };
export const SITE_URL = "https://goodbye.help";
export type PublicPage = {
  path: string;
  title: string;
  description: string;
  updated: string;
};
const page = (
  path: string,
  title: string,
  description: string,
): PublicPage => ({
  path,
  title,
  description,
  updated: [
    "/",
    "/about",
    "/how-it-works",
    "/guides/startup-idea-validation",
  ].includes(path)
    ? "2026-11-10"
    : "2026-11-09",
});
export const pages: PublicPage[] = [
  page(
    "/",
    "AI Startup Simulator",
    "Explore startup assumptions in 180 simulated days, about 15 real minutes. Track cash, customers and runway. One free simulation; no account required.",
  ),
  page(
    "/simulator",
    "Startup Simulator",
    "Set your resources, make decisions and explore an assumption-based startup scenario. 180 simulated days take about 15 real minutes.",
  ),
  page(
    "/how-it-works",
    "How It Works",
    "Learn how six simulated stages turn AI assumptions into calculated cash, customers and runway. Real use takes about 15 minutes.",
  ),
  page(
    "/pricing",
    "Pricing",
    "One free simulation is available. Paid plans are not yet offered. Learn about anonymous eligibility, retries, local records and exports.",
  ),
  page(
    "/about",
    "About",
    "Goodbye Startup helps aspiring founders practice decisions, understand model assumptions and choose their next real-world experiment.",
  ),
  page(
    "/privacy",
    "Privacy",
    "How browser transcripts, DeepSeek inference, anonymous numerical saves, cookies and 30-day and 180-day retention periods work.",
  ),
  page(
    "/blog",
    "Startup Learning Blog",
    "Clear explanations of startup assumptions, acquisition costs, retention and cash planning, with formulas, examples and source links.",
  ),
  page(
    "/guides",
    "Startup Guides",
    "Practical guides to validating ideas, understanding simulation stages and stress-testing cost assumptions.",
  ),
  ...articles.map((a) =>
    page(
      a.path,
      (
        {
          "/blog/why-90-percent-of-startups-fail": "Why Startups Fail",
          "/blog/how-much-money-do-you-need-to-start-a-startup":
            "Startup Funding Needs",
          "/blog/customer-acquisition-cost-benchmarks":
            "Customer Acquisition Cost",
          "/blog/churn-rate-how-to-reduce": "Understanding Churn",
          "/guides/startup-idea-validation": "Validate Your Startup Idea",
          "/guides/startup-cost-benchmarks": "Startup Cost Assumptions",
          "/guides/180-day-simulation-explained": "The 180-Day Simulation",
        } as Record<string, string>
      )[a.path],
      a.intro.en.length <= 155 ? a.intro.en : a.intro.en.split(". ")[0] + ".",
    ),
  ),
];
/** Every route has an absolute title and independent canonical/OG URL. */
export function metadataFor(path: string): Metadata {
  const p = pages.find((v) => v.path === path);
  if (!p) throw Error("Unknown public route");
  const title = `${p.title} | Goodbye Startup`;
  return {
    title: { absolute: title },
    description: p.description,
    alternates: {
      canonical: p.path,
      ...(path === "/blog"
        ? { types: { "application/rss+xml": "/blog/feed.xml" } }
        : {}),
    },
    openGraph: {
      title,
      description: p.description,
      url: SITE_URL + p.path,
      type: "website",
      siteName: "Goodbye Startup",
      images: [
        {
          url: SITE_URL + "/og.png",
          width: 1200,
          height: 630,
          alt: "Goodbye Startup",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: p.description,
      images: [SITE_URL + "/og.png"],
    },
  };
}
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object")
    return Object.values(value).flatMap(strings);
  return [];
}
/** Public text only; neither storage nor API modules are imported here. */
export function publicMarkdown(path: string): string {
  const p = pages.find((p) => p.path === path);
  if (!p) throw Error("Unknown public route");
  const a = articles.find((a) => a.path === path);
  const section =
    path === "/"
      ? [en.hero, en.features, en.examples, en.faq]
      : path === "/pricing"
        ? en.pricing
        : path === "/privacy"
          ? en.privacy
          : path === "/about"
            ? en.about
            : path === "/how-it-works"
              ? en.howItWorks
              : null;
  const text = a
    ? [
        a.intro.en,
        ...a.sections.flatMap((s) => ["## " + s.title.en, s.body.en]),
        "## Sources",
        ...a.sources.map((s) => `- [${s.title}](${s.url})`),
      ]
    : section
      ? strings(section)
      : path === "/simulator"
        ? [
            "Set your cash, monthly cost, team and commitment. AI proposes assumptions; code calculates outcomes. Stages: simulated Days 0, 5, 90, 120, 150, 180. All days are simulated; real use takes about 15 minutes.",
            "Text stays in your browser. Anonymous numerical state expires after 30 days; used eligibility after 180 days. There is no live research or paid checkout.",
          ]
        : articles
            .filter((a) => a.kind === (path === "/blog" ? "blog" : "guide"))
            .map((a) => `- [${a.title.en}](${SITE_URL + a.path})`);
  return `# ${p.title}\n\nCanonical: ${SITE_URL + p.path}\nUpdated: ${p.updated}\n\n${text.join("\n\n")}\n`;
}
const xml = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
/** RSS remains a static asset for reliable routing on Cloudflare. */
export function renderFeed(): string {
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Goodbye Startup Blog</title><link>${SITE_URL}/blog</link><description>Startup learning, assumptions and formulas</description>${articles
    .filter((a) => a.kind === "blog")
    .map(
      (a) =>
        `<item><title>${xml(a.title.en)}</title><link>${SITE_URL + a.path}</link><guid>${SITE_URL + a.path}</guid><pubDate>${new Date(a.published + "T00:00:00Z").toUTCString()}</pubDate><description>${xml(a.intro.en)}</description></item>`,
    )
    .join("")}</channel></rss>\n`;
}
/** Escape script-closing characters even when today’s schema has only trusted copy. */
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}
