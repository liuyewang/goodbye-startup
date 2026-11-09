import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LanguageProvider from "@/src/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

const SITE_URL = "https://goodbye.help";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Goodbye Startup — AI Startup Simulator & Idea Validator",
    template: "%s | Goodbye Startup",
  },
  description:
    "Test your startup idea in a 180-day AI simulation. A data-driven mentor shows market reality, CAC, churn and runway before you quit. First run free.",
  keywords: [
    "startup simulator",
    "AI startup mentor",
    "startup idea validator",
    "business simulation",
    "test startup idea",
    "is my startup idea viable",
    "entrepreneurship practice",
    "runway calculator",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Goodbye Startup — AI-Powered Startup Simulator",
    description:
      "Test your startup idea in 180 days with a data-driven AI mentor. No risk, no wasted savings — just real market reality.",
    type: "website",
    url: SITE_URL,
    siteName: "Goodbye Startup",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Goodbye Startup — test your startup idea before you quit your job",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Goodbye Startup — AI-Powered Startup Simulator",
    description:
      "Test your startup idea in 180 days with a data-driven AI mentor.",
    images: ["/og.png"],
  },
};

// JSON-LD: Organization + WebApplication (GEO/SEO structured data)
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Goodbye Startup",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description:
    "A data-driven AI startup simulator that tests business ideas against realistic market data before founders quit their jobs.",
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Goodbye Startup Simulator",
  url: `${SITE_URL}/simulator`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "180-day AI-powered startup simulation with realistic traffic, conversion, churn and cash-flow models.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
        />
        <LanguageProvider><Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer /></LanguageProvider>
      </body>
    </html>
  );
}
