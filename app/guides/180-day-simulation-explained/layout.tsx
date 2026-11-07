import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "180-Day Startup Simulation Explained | Goodbye Startup",
  description:
    "A detailed walkthrough of every phase of the 180-day startup simulation: what happens, what data you'll see, and what decisions you'll make.",
  alternates: { canonical: "/guides/180-day-simulation-explained" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
