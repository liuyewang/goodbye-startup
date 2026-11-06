import type { MetadataRoute } from "next";

const SITE_URL = "https://goodbye.help";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/how-it-works",
    "/pricing",
    "/about",
    "/simulator",
    "/privacy",
  ];

  return pages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/simulator" ? 0.9 : 0.7,
  }));
}
