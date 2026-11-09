"use client";
import Link from "next/link";
import { useI18n } from "@/src/i18n";
export default function NotFound(): React.JSX.Element {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-3xl px-5 py-20">
      <h1 className="text-3xl font-bold">{t.common.notFound}</h1>
      <Link className="mt-6 inline-block text-primary-700 underline" href="/">
        {t.common.returnHome}
      </Link>
    </section>
  );
}
