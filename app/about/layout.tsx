import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Why We Built a Startup Simulator",
  description:
    "Goodbye Startup exists to save founders from bad ideas: a data-driven AI mentor that shows market reality before you quit your job or drain your savings.",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
