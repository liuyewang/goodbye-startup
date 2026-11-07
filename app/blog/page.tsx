"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export default function BlogPage() {
  const { t } = useI18n();

  const posts = [
    {
      href: "/blog/why-90-percent-of-startups-fail",
      title: t.blog.posts.whyFail.title,
      description: t.blog.posts.whyFail.description,
      readTime: "6 min read",
      date: "Nov 2026",
    },
    {
      href: "/blog/customer-acquisition-cost-benchmarks",
      title: t.blog.posts.cac.title,
      description: t.blog.posts.cac.description,
      readTime: "6 min read",
      date: "Nov 2026",
    },
    {
      href: "/blog/how-much-money-do-you-need-to-start-a-startup",
      title: t.blog.posts.howMuchMoney.title,
      description: t.blog.posts.howMuchMoney.description,
      readTime: "5 min read",
      date: "Nov 2026",
    },
    {
      href: "/blog/churn-rate-how-to-reduce",
      title: t.blog.posts.churn.title,
      description: t.blog.posts.churn.description,
      readTime: "5 min read",
      date: "Nov 2026",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 lg:py-20 overflow-hidden bg-gradient-to-b from-primary-50/50 to-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-xl mb-4 text-balance">{t.blog.title}</h1>
            <p className="subtitle text-balance">{t.blog.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.href}
                href={post.href}
                className="card-hover p-6 lg:p-8 block group"
              >
                <div className="text-sm text-dark-400 mb-2">
                  {post.date} · {post.readTime}
                </div>
                <h2 className="text-xl font-semibold text-dark-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-dark-500 leading-relaxed text-sm">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
