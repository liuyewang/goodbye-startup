import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Much Money Do You Need to Start a Startup? | Goodbye Startup",
  description:
    "Real numbers for solo founders: how much runway do you actually need, what are the hidden costs, and how to calculate your break-even point.",
  alternates: { canonical: "/blog/how-much-money-do-you-need-to-start-a-startup" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much money do you need to start a SaaS startup?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A solo developer can launch a SaaS MVP for under $10k. This covers hosting ($200-600), tools ($100-300), ad testing ($1,000-5,000), and design ($500-2,000). If you quit your job, add $2,000-4,000/month for living expenses.",
      },
    },
    {
      "@type": "Question",
      name: "How many months of runway do you need?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You should have 12-18 months of runway. Most solo founders take that long to reach product-market fit. If you have $30k and burn $2k/month, you have 15 months — barely enough. Add 50% buffer for unexpected costs.",
      },
    },
    {
      "@type": "Question",
      name: "What are the hidden costs of starting a startup?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hidden costs include: your own time (opportunity cost of not working your day job), slow seasons (revenue isn't linear), technical debt (the MVP you shipped in 2 weeks takes 3 months to fix), and churn (losing 15% of users monthly means constant new acquisition).",
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
