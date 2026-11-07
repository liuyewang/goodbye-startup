import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://goodbye.help";

  const posts = [
    {
      title: "Why 90% of Startups Fail — And What the Other 10% Do Differently",
      href: "/blog/why-90-percent-of-startups-fail",
      date: "2026-11-07T00:00:00Z",
      description:
        "It's not about effort or luck. The data shows exactly where most founders go wrong — and what the successful ones do instead.",
    },
    {
      title: "Customer Acquisition Cost Benchmarks by Channel (2026)",
      href: "/blog/customer-acquisition-cost-benchmarks",
      date: "2026-11-07T00:00:00Z",
      description:
        "How much does it actually cost to get a paying customer? The numbers are very different from what founders expect.",
    },
    {
      title: "How Much Money Do You Actually Need to Start a Startup?",
      href: "/blog/how-much-money-do-you-need-to-start-a-startup",
      date: "2026-11-07T00:00:00Z",
      description:
        "The $30k vs $100k debate is missing the point. Here's what the real numbers look like for solo founders in 2026.",
    },
    {
      title: "How to Reduce Churn Rate: 5 Things That Actually Work",
      href: "/blog/churn-rate-how-to-reduce",
      date: "2026-11-07T00:00:00Z",
      description:
        "Churn kills more startups than competition. Here are the real benchmarks and what actually moves the needle.",
    },
  ];

  const items = posts
    .map(
      (post) => `    <item>
      <title>${post.title}</title>
      <link>${baseUrl}${post.href}</link>
      <guid>${baseUrl}${post.href}</guid>
      <pubDate>${post.date}</pubDate>
      <description>${post.description}</description>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Goodbye Startup Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Hard data about startups, validation, and why most ideas fail before they start.</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/blog/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
