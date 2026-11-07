import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Acquisition Cost Benchmarks by Channel | Goodbye Startup",
  description:
    "Real CAC benchmarks for early-stage startups by channel: paid ads, content, social, and word-of-mouth. Learn how to calculate your break-even point.",
  alternates: { canonical: "/blog/customer-acquisition-cost-benchmarks" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a good customer acquisition cost (CAC) for SaaS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The golden rule is LTV should be 3x your CAC. For a $10/month SaaS product with 6-month average lifetime, LTV is $60, so CAC should be under $20. By channel: Google Ads $50-200, Facebook $20-80, TikTok $10-40, content marketing $5-20, word-of-mouth $0-5.",
      },
    },
    {
      "@type": "Question",
      name: "Why do most founders underestimate CAC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most founders look at CPC ($5 per click) and think it's cheap. They forget that only 1% of visitors convert to sign-ups, and only 1-2% of sign-ups convert to paying customers. That $5 click becomes a $250-500 paying customer — 3-5x higher than they expected.",
      },
    },
    {
      "@type": "Question",
      name: "How can I reduce customer acquisition cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The fastest way is improving conversion: going from 1% to 3% conversion cuts CAC by 2/3. The second fastest is building something worth sharing so word-of-mouth starts contributing. Most founders scale ads before testing either lever.",
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
