import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why 90% of Startups Fail (And What 10% Do Differently) | Goodbye Startup",
  description:
    "Data-driven analysis of why most startups fail: market size, CAC, churn, and runway. Learn what the successful 10% do differently.",
  alternates: { canonical: "/blog/why-90-percent-of-startups-fail" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What percentage of startups actually fail?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Research consistently shows that 70-90% of startups fail within the first 3 years. CB Insights analyzed 101 post-mortems and found the top reasons are: no market need (42%), ran out of cash (29%), wrong team (23%), and got outcompeted (19%).",
      },
    },
    {
      "@type": "Question",
      name: "Why do most startups fail, not competition?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The #1 reason startups fail is no market need (42%), not competition. Most founders build something nobody asked for, spending 6-12 months on development before discovering the market doesn't want it. The second biggest reason is running out of cash (29%).",
      },
    },
    {
      "@type": "Question",
      name: "What do the successful 10% of founders do differently?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Successful founders validate first, build second. They spend $50 on a landing page before spending $50,000 on development. They talk to 50 potential customers before writing code. They know their CAC before launching ads. Most importantly, they test assumptions in 15 minutes, not 6 months.",
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
