'use client';
import { useI18n } from '@/src/i18n';
export default function LanguageSwitcher():React.JSX.Element {
 const {language,setLanguage}=useI18n();
 return <label className="text-sm text-dark-700"><span className="sr-only">{language==='zh'?'语言':'Language'}</span><select className="rounded-lg border border-dark-200 bg-white px-2 py-2" value={language} onChange={e=>setLanguage(e.target.value==='zh'?'zh':'en')}><option value="en">English</option><option value="zh">中文</option></select></label>;
}
