import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How the 180-Day Simulation Works",
  description:
    "See how Goodbye Startup tests your idea: market reality check, launch, user behavior, the day-180 financial crunch, and a lessons report.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
