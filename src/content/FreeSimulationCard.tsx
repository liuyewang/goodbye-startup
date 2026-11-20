"use client";

import Link from "next/link";
import { useI18n } from "../i18n";

export default function FreeSimulationCard(): React.JSX.Element {
  const { t } = useI18n();
  const { free } = t.pricing;
  return (
    <section className="mx-auto max-w-lg rounded-2xl border border-dark-200 bg-white p-6 sm:p-8">
      <h2 className="text-xl font-semibold">{free.name}</h2>
      <p className="mt-4 text-4xl font-bold">{free.price}</p>
      <p className="mt-2 text-sm text-dark-500">{free.period}</p>
      <p className="mt-4 text-dark-600">{free.description}</p>
      <ul className="my-6 list-disc space-y-3 pl-5 text-sm text-dark-600">
        {free.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <Link
        href="/simulator"
        className="btn-primary btn-md w-full justify-center"
      >
        {free.cta}
      </Link>
    </section>
  );
}
