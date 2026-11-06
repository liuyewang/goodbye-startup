import type { Metadata } from "next";

// Indexable since 2026-11-06: the tool page carries a server-rendered explainer
// (components/sim/SimulatorGuide.tsx) so it has real text, not an empty shell.
export const metadata: Metadata = {
  title: "Startup Simulator — Free 180-Day Test",
  description:
    "Put your startup idea through a realistic 180-day AI pressure test — market data, CAC, churn and runway. One run free, no account needed.",
  alternates: { canonical: "/simulator" },
  robots: { index: true, follow: true },
};

export default function SimulatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
