import type { MetadataRoute } from "next";

const SITE_URL = "https://goodbye.help";

// Bump manually when a page's content actually changes.
// A build-time `new Date()` changes on every deploy and teaches Google to ignore lastmod.
const LAST_MODIFIED = new Date("2026-11-06");

export default function sitemap(): MetadataRoute.Sitemap {
  // /simulator is included since 2026-11-06: it is now indexable and carries a
  // server-rendered explainer (components/sim/SimulatorGuide.tsx).
  const pages = [
    "",
    "/guides",
    "/how-it-works",
    "/pricing",
    "/simulator",
    "/about",
    "/privacy",
  ];

  return pages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/simulator" ? 0.9 : 0.7,
  }));
}
