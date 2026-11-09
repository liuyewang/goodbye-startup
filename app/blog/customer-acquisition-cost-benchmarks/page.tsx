"use client";

import { useI18n } from "@/src/i18n";
import Link from "next/link";

export default function BlogCACPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen">
      <section className="relative py-16 lg:py-20 overflow-hidden bg-gradient-to-b from-primary-50/50 to-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto">
            <Link href="/blog" className="text-sm text-primary-600 mb-4 inline-block">
              ← Back to Blog
            </Link>
            <h1 className="heading-xl mb-4 text-balance">
              {t.blog.posts.cac.title}
            </h1>
            <p className="text-dark-400 text-sm">Nov 2026 · 6 min read</p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <div className="prose prose-dark max-w-none space-y-8">
            <p className="text-lg text-dark-600 leading-relaxed">
              {t.blog.posts.cac.intro}
            </p>

            <h2>{t.blog.posts.cac.section1.title}</h2>
            <p>{t.blog.posts.cac.section1.body}</p>

            <h2>{t.blog.posts.cac.section2.title}</h2>
            <div className="overflow-hidden rounded-lg border border-dark-200 my-6">
              <table className="w-full text-sm">
                <thead className="bg-dark-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Channel</th>
                    <th className="px-4 py-2 text-right font-semibold">Typical CAC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100">
                  {t.blog.posts.cac.section2.channels.map((ch) => (
                    <tr key={ch.name}>
                      <td className="px-4 py-2 text-dark-600">{ch.name}</td>
                      <td className="px-4 py-2 text-right font-mono text-primary-600">{ch.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2>{t.blog.posts.cac.section3.title}</h2>
            <p>{t.blog.posts.cac.section3.body}</p>

            <h2>{t.blog.posts.cac.section4.title}</h2>
            <p>{t.blog.posts.cac.section4.body}</p>

            <h2>{t.blog.posts.cac.section5.title}</h2>
            <p>{t.blog.posts.cac.section5.body}</p>
          </div>

          <div className="mt-16 text-center rounded-2xl gradient-bg p-10">
            <h3 className="text-2xl font-bold text-white mb-4">
              {t.blog.posts.cac.cta.title}
            </h3>
            <p className="text-white/80 mb-6">
              {t.blog.posts.cac.cta.subtitle}
            </p>
            <Link href="/simulator" className="btn bg-white text-primary-600 hover:bg-white/90 btn-lg">
              {t.common.startFree}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
