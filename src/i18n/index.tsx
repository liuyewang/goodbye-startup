'use client';
import { createContext,useContext,useEffect,useState,StrictMode,type ReactNode } from 'react';
import { en,type Translations } from './en';
import { zh } from './zh';
export type Language='en'|'zh';
type I18n={language:Language;setLanguage:(language:Language)=>void;t:Translations};
const Context=createContext<I18n|null>(null);
/** Server and first client render agree; preferences are read only after hydration. */
export default function LanguageProvider({children}:{children:ReactNode}):React.JSX.Element {
 const [language,setCurrent]=useState<Language>('en');
 useEffect(()=>{let stored:string|null=null;try{stored=localStorage.getItem('gs_language');}catch{/* Storage may be disabled. */}setCurrent(stored==='zh'||stored==='en'?stored:navigator.language.toLowerCase().startsWith('zh')?'zh':'en');},[]);
 useEffect(()=>{document.documentElement.lang=language;},[language]);
 function setLanguage(value:Language):void {setCurrent(value);try{localStorage.setItem('gs_language',value);}catch{/* Keep switching functional without persistence. */}}
 return <StrictMode><Context.Provider value={{language,setLanguage,t:language==='zh'?zh:en}}>{children}</Context.Provider></StrictMode>;
}
/** Shared subscription updates all copy without reloading the page or losing input. */
export function useI18n():I18n {const value=useContext(Context);if(!value)throw new Error('LanguageProvider missing');return value;}
