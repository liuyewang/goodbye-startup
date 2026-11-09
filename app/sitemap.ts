import type { MetadataRoute } from "next";
import { pages, SITE_URL } from "@/src/content/registry";
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((p) => ({
    url: SITE_URL + p.path,
    lastModified: new Date(p.updated),
    changeFrequency: "monthly",
    priority: p.path === "/" ? 1 : 0.7,
  }));
}
