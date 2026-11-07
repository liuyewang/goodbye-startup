import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Startup Cost Benchmarks: CAC, Churn, LTV & More | Goodbye Startup",
  description:
    "Real industry benchmarks for early-stage startups: customer acquisition cost, churn rate, conversion rates, and how to use them to test your idea.",
  alternates: { canonical: "/guides/startup-cost-benchmarks" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
