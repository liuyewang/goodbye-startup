import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — First Run Free, No Card",
  description:
    "Your first 180-day startup simulation is free. Unlimited runs cost $9.99/month or a one-time $49.99 lifetime pass. 30-day money-back guarantee.",
  alternates: { canonical: "/pricing" },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
