import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Validate a Startup Idea Before You Build Anything | Goodbye Startup",
  description:
    "The 5-step framework to test your startup idea before spending $50,000 and 6 months. Learn why validation beats building.",
  alternates: { canonical: "/guides/startup-idea-validation" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
