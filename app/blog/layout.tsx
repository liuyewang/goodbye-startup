import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Goodbye Startup",
  description:
    "Data-driven articles about startup failure rates, validation, customer acquisition cost, and what it actually takes to build a profitable business.",
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": "/blog/feed.xml",
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
