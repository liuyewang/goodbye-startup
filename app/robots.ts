import type { MetadataRoute } from "next";

const SITE_URL = "https://goodbye.help";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // GEO strategy: explicitly welcome AI crawlers — we want our content cited
      { userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User"], allow: "/" },
      { userAgent: ["ClaudeBot", "Claude-Web", "anthropic-ai"], allow: "/" },
      { userAgent: ["PerplexityBot", "Perplexity-User"], allow: "/" },
      { userAgent: ["Google-Extended", "Applebot-Extended"], allow: "/" },
      // General crawlers
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
