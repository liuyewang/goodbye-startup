"use client";
import { useI18n } from "@/src/i18n";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.JSX.Element {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-3xl px-5 py-20">
      <h1 className="text-3xl font-bold">{t.common.error}</h1>
      <button className="btn-primary btn-md mt-6" onClick={reset}>
        {t.common.retry}
      </button>
    </section>
  );
}
