'use client';
import Link from 'next/link';
import {useI18n} from '../i18n';
import {articles} from './articles';
export default function ArticlePage({path}:{path:string}):React.JSX.Element {
 const {language,t}=useI18n();const a=articles.find(a=>a.path===path)!;
 return <article className="mx-auto max-w-3xl px-5 py-12 sm:py-20"><Link className="text-sm text-primary-600" href={a.kind==='blog'?'/blog':'/guides'}>{t.common.backArticles}</Link><h1 className="mt-5 text-3xl font-bold leading-tight sm:text-5xl">{a.title[language]}</h1><p className="mt-4 text-sm text-dark-400">{t.common.updated}{a.updated}</p><p className="mt-6 text-lg leading-relaxed text-dark-600">{a.intro[language]}</p><div className="mt-10 space-y-9">{a.sections.map(s=><section key={s.title.en}><h2 className="mb-3 text-xl font-semibold">{s.title[language]}</h2><p className="leading-relaxed text-dark-600">{s.body[language]}</p></section>)}</div>{a.sources.length>0&&<section className="mt-10 border-t border-dark-200 pt-6"><h2 className="font-semibold">{t.common.sources}</h2><p className="mt-2 text-sm text-dark-500">{t.common.sourceNote}</p><ul className="mt-3 space-y-2">{a.sources.map(s=><li key={s.url}><a href={s.url} className="text-sm text-primary-700 underline">{s.title}</a></li>)}</ul></section>}<div className="mt-12 rounded-2xl bg-primary-50 p-6"><p className="mb-4 text-dark-600">{t.common.timeNote}</p><Link href="/simulator" className="btn-primary btn-md">{t.common.startFree}</Link></div></article>;
}
