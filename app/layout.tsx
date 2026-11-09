import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LanguageProvider from "@/src/i18n";
import { metadataFor, safeJsonLd, SITE_URL } from "@/src/content/registry";
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
export const metadata: Metadata = {
  ...metadataFor("/"),
  metadataBase: new URL(SITE_URL),
  icons: { icon: "/favicon.svg" },
  robots: { index: true, follow: true },
};
const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Goodbye Startup",
    url: SITE_URL,
    logo: SITE_URL + "/favicon.svg",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Goodbye Startup Simulator",
    url: SITE_URL + "/simulator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Educational startup scenarios with AI assumptions and deterministic economic calculations.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  },
];
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans min-h-screen flex flex-col">
        {schemas.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
          />
        ))}
        <LanguageProvider>
          <Navbar />
          <main id="main-content" className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
