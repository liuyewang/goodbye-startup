import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Reduce Churn Rate: 5 Things Actually Work | Goodbye Startup",
  description:
    "Churn kills early-stage startups. Learn the real benchmarks for monthly churn and what actually works to reduce it — not the generic advice.",
  alternates: { canonical: "/blog/churn-rate-how-to-reduce" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a good monthly churn rate for SaaS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For early-stage B2C SaaS, 3-5% monthly churn is typical. Anything above 7% monthly means you're losing more customers than you can replace. At 10% monthly churn, your entire customer base turns over every 10 months. The best products get it under 2%.",
      },
    },
    {
      "@type": "Question",
      name: "What actually reduces churn, not generic advice?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "5 things that work: (1) Design for the 'aha moment' in the first 5 minutes — the first 72 hours matter most. (2) Send one 30-day check-in email asking 'is this working for you?'. (3) Offer annual plans with 20% discount — cuts churn by 50%. (4) Reduce features — fewer = more focused = higher retention. (5) Talk to 5 churned users every month.",
      },
    },
    {
      "@type": "Question",
      name: "Why is churn more important than acquisition?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you have 100 users and 5% monthly churn, you lose 5 users/month. You need 5 new users just to stay flat. At 10% churn, you need 10 new users per month. At that rate, acquisition costs eat all your revenue. The math only works when churn is below 3%.",
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
