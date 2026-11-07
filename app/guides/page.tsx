"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export default function GuidesPage() {
  const { t } = useI18n();

  const guides = [
    {
      href: "/how-it-works",
      icon: "📖",
      title: t.guides.howItWorks.title,
      description: t.guides.howItWorks.description,
      readTime: "5 min read",
    },
    {
      href: "/simulator",
      icon: "🎮",
      title: t.guides.simulator.title,
      description: t.guides.simulator.description,
      readTime: "3 min read",
    },
    {
      href: "/pricing",
      icon: "💰",
      title: t.guides.pricing.title,
      description: t.guides.pricing.description,
      readTime: "2 min read",
    },
    {
      href: "/about",
      icon: "ℹ️",
      title: t.guides.about.title,
      description: t.guides.about.description,
      readTime: "3 min read",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-primary-50/50 to-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-xl mb-6 text-balance">{t.guides.title}</h1>
            <p className="subtitle text-balance">{t.guides.subtitle}</p>
            <p className="mt-6 text-dark-500 leading-relaxed text-balance">{t.guides.intro}</p>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="grid gap-6 md:grid-cols-2">
            {guides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="card-hover p-6 lg:p-8 block group"
              >
                <div className="text-3xl mb-4">{guide.icon}</div>
                <h2 className="text-xl font-semibold text-dark-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {guide.title}
                </h2>
                <p className="text-dark-500 leading-relaxed mb-4 text-sm">
                  {guide.description}
                </p>
                <span className="text-xs text-dark-400">{guide.readTime}</span>
              </Link>
            ))}
          </div>

          {/* Related Blog */}
          <div className="mt-16 pt-16 border-t border-dark-200">
            <h2 className="text-xl font-semibold text-dark-900 mb-6">More reading</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/blog/why-90-percent-of-startups-fail" className="card-hover p-4 block group">
                <h3 className="font-medium text-dark-900 mb-1 group-hover:text-primary-600 transition-colors">Why 90% of Startups Fail</h3>
                <p className="text-sm text-dark-500">The data shows exactly where most founders go wrong.</p>
              </Link>
              <Link href="/blog/customer-acquisition-cost-benchmarks" className="card-hover p-4 block group">
                <h3 className="font-medium text-dark-900 mb-1 group-hover:text-primary-600 transition-colors">CAC Benchmarks by Channel</h3>
                <p className="text-sm text-dark-500">Real numbers for customer acquisition cost.</p>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link href="/simulator" className="btn-primary btn-lg">
              {t.common.startFree}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
