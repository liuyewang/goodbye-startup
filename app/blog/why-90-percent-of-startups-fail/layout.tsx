import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why 90% of Startups Fail (And What 10% Do Differently) | Goodbye Startup",
  description:
    "Data-driven analysis of why most startups fail: market size, CAC, churn, and runway. Learn what the successful 10% do differently.",
  alternates: { canonical: "/blog/why-90-percent-of-startups-fail" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
