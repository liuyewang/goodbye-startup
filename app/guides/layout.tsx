import type { Metadata } from "next";

// /guides is a hub page; without this layout it inherits the root canonical "/"
// and the root title, which contradicts being listed in app/sitemap.ts.
export const metadata: Metadata = {
  title: "Startup Guides — Read Before You Build",
  description:
    "Four short guides on the 180-day simulation, the AI mentor, pricing and what we built — read them before you test your idea.",
  alternates: { canonical: "/guides" },
};

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
