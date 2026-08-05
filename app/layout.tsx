import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Goodbye Startup - AI-Powered Startup Simulator",
  description:
    "Test your startup idea in 180 days with a data-driven AI mentor. No risk, no wasted savings — just real market reality.",
  keywords: [
    "startup simulator",
    "AI mentor",
    "entrepreneurship",
    "business simulation",
    "startup idea validator",
  ],
  openGraph: {
    title: "Goodbye Startup - AI-Powered Startup Simulator",
    description:
      "Test your startup idea in 180 days with a data-driven AI mentor.",
    type: "website",
    url: "https://goodbye.help",
  },
  twitter: {
    card: "summary_large_image",
    title: "Goodbye Startup - AI-Powered Startup Simulator",
    description:
      "Test your startup idea in 180 days with a data-driven AI mentor.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
