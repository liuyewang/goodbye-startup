import type { Metadata } from "next";

// The simulator is an interactive tool, not indexable content.
export const metadata: Metadata = {
  title: "Start Your Simulation",
  description:
    "Put your startup idea through a realistic 180-day AI pressure test — market data, CAC, churn, and runway.",
  robots: { index: false, follow: false },
};

export default function SimulatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
