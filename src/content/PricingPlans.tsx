'use client';
import Link from 'next/link';
import {useI18n} from '../i18n';
export default function PricingPlans():React.JSX.Element {
 const {t}=useI18n();return <div className="grid gap-6 md:grid-cols-3">{t.pricing.plans.map((plan,index)=><section className="flex flex-col rounded-2xl border border-dark-200 bg-white p-6" key={plan.name}><h2 className="text-xl font-semibold">{plan.name}</h2><p className="mt-4 text-4xl font-bold">{plan.price}</p><p className="mt-2 text-sm text-dark-500">{plan.period}</p><p className="mt-4 text-dark-600">{plan.description}</p><ul className="my-6 flex-1 space-y-3 text-sm text-dark-600">{plan.features.map(feature=><li key={feature}>✓ {feature}</li>)}</ul>{index===0?<Link href="/simulator" className="btn-primary btn-md justify-center">{plan.cta}</Link>:<button disabled className="rounded-xl bg-dark-100 px-4 py-3 text-dark-500">{plan.cta}</button>}</section>)}</div>;
}
