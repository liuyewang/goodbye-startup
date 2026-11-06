import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — 180-Day Simulation Across 5 Phases",
  description:
    "See how Goodbye Startup tests your business idea: market reality check, product launch, user behavior simulation, the day-180 financial crunch, and a final lessons report.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
