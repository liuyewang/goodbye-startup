import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Much Money Do You Need to Start a Startup? | Goodbye Startup",
  description:
    "Real numbers for solo founders: how much runway do you actually need, what are the hidden costs, and how to calculate your break-even point.",
  alternates: { canonical: "/blog/how-much-money-do-you-need-to-start-a-startup" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
