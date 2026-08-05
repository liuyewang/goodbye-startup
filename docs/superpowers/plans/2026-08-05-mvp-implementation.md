# MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working MVP of Goodbye Startup - an AI-powered startup simulator with chat interface, game mechanics, and marketing pages.

**Architecture:** Next.js 14 App Router + Tailwind CSS + Cloudflare Pages Functions. Client-side state with React Context + localStorage. Gemini API proxied through serverless function.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Cloudflare Pages/Workers, Google Gemini 3.5 Flash

## Global Constraints

- Next.js 14 with App Router only (no Pages Router)
- TypeScript strict mode
- Tailwind CSS only (no other CSS libraries)
- No state management libraries (use Context + localStorage)
- No UI component libraries (build from scratch with Tailwind)
- No i18n libraries (custom lightweight implementation)
- Mobile-first responsive design
- English default, Chinese secondary
- All API keys server-side only
- Git commit after each task

---

## File Structure Map

### Files to Create

**Config & Setup:**
- `package.json` - Dependencies (exists, needs update)
- `next.config.js` - Next.js config (exists)
- `tailwind.config.js` - Tailwind config (exists, needs theme update)
- `tsconfig.json` - TypeScript config (exists)
- `postcss.config.js` - PostCSS config (exists)
- `wrangler.toml` - Cloudflare config (new)
- `.env.local` - Local env vars (new, gitignored)

**App Router:**
- `app/layout.tsx` - Root layout with Navbar + Footer
- `app/page.tsx` - Landing page
- `app/sim/page.tsx` - Simulator page
- `app/how-it-works/page.tsx` - How it works page
- `app/pricing/page.tsx` - Pricing page
- `app/about/page.tsx` - About page
- `app/privacy/page.tsx` - Privacy policy
- `app/api/chat/route.ts` - Gemini API proxy
- `app/globals.css` - Global styles + Tailwind

**Components:**
- `components/layout/Navbar.tsx` - Navigation bar
- `components/layout/Footer.tsx` - Footer
- `components/ui/Button.tsx` - Reusable button
- `components/ui/Card.tsx` - Reusable card
- `components/chat/ChatInterface.tsx` - Main chat container
- `components/chat/MessageList.tsx` - Message list
- `components/chat/MessageBubble.tsx` - Single message
- `components/chat/ChatInput.tsx` - Input area
- `components/chat/TypingIndicator.tsx` - AI typing indicator
- `components/sim/StatusPanel.tsx` - Game stats panel
- `components/sim/PaywallModal.tsx` - Paywall modal
- `components/i18n/LanguageSwitcher.tsx` - Language toggle

**Libraries:**
- `lib/i18n/index.ts` - i18n core
- `lib/i18n/en.ts` - English translations
- `lib/i18n/zh.ts` - Chinese translations
- `lib/game/types.ts` - Game state types
- `lib/game/context.tsx` - Game context provider
- `lib/game/storage.ts` - localStorage helpers
- `lib/prompts/system-prompt-en.ts` - English system prompt
- `lib/prompts/system-prompt-zh.ts` - Chinese system prompt
- `lib/gemini.ts` - Gemini API helper

---

## Task 1: Project Setup & Dependencies

**Files:**
- Modify: `package.json`
- Create: `wrangler.toml`
- Create: `.env.local`

**Interfaces:**
- Produces: Working dev environment with all dependencies installed

- [ ] **Step 1: Update package.json with all dependencies**

Update `package.json` dependencies:
```json
{
  "name": "goodbye-startup",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "pages:build": "npx @cloudflare/next-on-pages",
    "pages:deploy": "npx wrangler pages deploy .vercel/output/static"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@cloudflare/next-on-pages": "^1.13.5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5",
    "wrangler": "^3.60.0"
  }
}
```

- [ ] **Step 2: Create wrangler.toml**

Create `wrangler.toml`:
```toml
name = "goodbye-startup"
compatibility_date = "2024-01-01"
pages_build_output_dir = ".vercel/output/static"
```

- [ ] **Step 3: Create .env.local**

Create `.env.local`:
```
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 4: Install dependencies**

Run: `npm install`
Expected: All packages installed successfully, node_modules created

- [ ] **Step 5: Verify dev server starts**

Run: `npm run dev` (background, then check)
Expected: Server starts on port 3000 without errors

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json wrangler.toml
git commit -m "chore: update dependencies and cloudflare config"
```

---

## Task 2: Global Styles & Tailwind Theme

**Files:**
- Modify: `tailwind.config.js`
- Create: `app/globals.css`

**Interfaces:**
- Produces: Custom color theme, typography, base styles

- [ ] **Step 1: Update tailwind.config.js with custom theme**

Replace `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Create app/globals.css with base styles**

Create `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-white text-dark-900 antialiased;
  }
}

@layer components {
  .container-page {
    @apply max-w-6xl mx-auto px-4 sm:px-6 lg:px-8;
  }
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  }
  .btn-secondary {
    @apply bg-white border border-dark-200 hover:bg-dark-50 text-dark-700 font-medium py-2.5 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  }
  .card {
    @apply bg-white border border-dark-200 rounded-xl shadow-sm;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.js app/globals.css
git commit -m "feat: setup tailwind theme and global styles"
```

---

## Task 3: i18n System

**Files:**
- Create: `lib/i18n/index.ts`
- Create: `lib/i18n/en.ts`
- Create: `lib/i18n/zh.ts`
- Create: `components/i18n/LanguageSwitcher.tsx`

**Interfaces:**
- Produces: `useTranslation()` hook, `t()` function, `LanguageSwitcher` component
- Consumes: localStorage, navigator.language

- [ ] **Step 1: Create English translations**

Create `lib/i18n/en.ts`:
```typescript
export const en = {
  nav: {
    home: 'Home',
    howItWorks: 'How It Works',
    pricing: 'Pricing',
    about: 'About',
    startFree: 'Start Free',
  },
  hero: {
    badge: 'AI-Powered Startup Simulator',
    title: 'Test Your Startup Idea',
    subtitle: 'Before You Quit Your Job',
    description: 'A data-driven AI simulator that shows you the brutal reality of building a business. No risk, all the lessons.',
    cta: 'Start Your Free Simulation',
    subCta: 'No credit card required · 1 free simulation',
  },
  features: {
    title: 'Why Goodbye Startup?',
    subtitle: 'Learn entrepreneurship the hard way — without the real-world consequences.',
    items: [
      {
        title: 'Data-Driven',
        description: 'Based on real market data and industry benchmarks. No feel-good fluff.',
      },
      {
        title: '180-Day Simulation',
        description: 'Fast-forward through 6 months of startup chaos in 30 minutes.',
      },
      {
        title: 'AI Mentor',
        description: 'A brutally honest startup coach who tells you what you need to hear.',
      },
      {
        title: 'Real Consequences',
        description: 'Your decisions matter. Run out of cash? Game over.',
      },
    ],
  },
  howItWorks: {
    title: 'How It Works',
    subtitle: 'Three steps to entrepreneurial enlightenment',
    steps: [
      {
        number: '01',
        title: 'Share Your Idea',
        description: 'Tell the AI your startup concept. Be as detailed or vague as you want.',
      },
      {
        number: '02',
        title: 'Run the Simulation',
        description: '180 days of startup life. Make decisions, face consequences, learn fast.',
      },
      {
        number: '03',
        title: 'Get Your Report',
        description: 'See where you went wrong, what you got right, and how to improve.',
      },
    ],
  },
  pricing: {
    title: 'Simple, Honest Pricing',
    subtitle: 'Start free. Upgrade when you want more.',
    popular: 'Most Popular',
    perMonth: '/month',
    oneTime: 'one-time',
    comingSoon: 'Coming Soon',
    getStarted: 'Get Started',
    upgrade: 'Upgrade Now',
    plans: {
      free: {
        name: 'Free',
        price: '$0',
        description: 'Try before you buy',
        features: [
          '1 full simulation',
          'Basic report',
          'All industries',
          'English & Chinese',
        ],
      },
      pro: {
        name: 'Pro',
        price: '$9.99',
        description: 'For serious founders',
        features: [
          'Unlimited simulations',
          'Detailed analytics report',
          'Export your results',
          'All founder backgrounds',
          'Priority AI response',
          'New features first',
        ],
      },
      team: {
        name: 'Team',
        price: '$29',
        description: 'For teams and classrooms',
        features: [
          'Everything in Pro',
          'Team simulations',
          'Compare results',
          'Custom scenarios',
          'API access',
        ],
      },
    },
  },
  sim: {
    title: 'Startup Simulator',
    day: 'Day',
    of180: 'of 180',
    stats: {
      cash: 'Cash',
      users: 'Users',
      team: 'Team',
      morale: 'Morale',
      mrr: 'MRR',
      runway: 'Runway',
    },
    inputPlaceholder: 'Type your message...',
    send: 'Send',
    typing: 'Coach is thinking...',
    paywall: {
      title: 'Want to Try Again?',
      description: 'You\'ve used your free simulation. Upgrade to Pro for unlimited attempts.',
      upgrade: 'Upgrade to Pro',
      learnMore: 'Learn More',
    },
  },
  footer: {
    tagline: 'Test your startup idea before you quit your job.',
    product: 'Product',
    company: 'Company',
    legal: 'Legal',
    rights: 'All rights reserved.',
  },
}

export type Translation = typeof en;
```

- [ ] **Step 2: Create Chinese translations**

Create `lib/i18n/zh.ts`:
```typescript
import type { Translation } from './en';

export const zh: Translation = {
  nav: {
    home: '首页',
    howItWorks: '使用说明',
    pricing: '价格',
    about: '关于我们',
    startFree: '免费开始',
  },
  hero: {
    badge: 'AI 驱动的创业模拟器',
    title: '压力测试你的创业想法',
    subtitle: '在辞职之前',
    description: '一个数据驱动的 AI 模拟器，向你展示创业的残酷现实。零风险，全是教训。',
    cta: '开始免费模拟',
    subCta: '无需信用卡 · 1 次免费模拟',
  },
  features: {
    title: '为什么选择 Goodbye Startup？',
    subtitle: '用最硬核的方式学习创业，无需承担真实后果。',
    items: [
      {
        title: '数据驱动',
        description: '基于真实市场数据和行业基准。没有鸡汤，只有现实。',
      },
      {
        title: '180 天模拟',
        description: '30 分钟快进 6 个月的创业混乱。',
      },
      {
        title: 'AI 导师',
        description: '一位直言不讳的创业教练，告诉你真相。',
      },
      {
        title: '真实后果',
        description: '你的每一个决策都很重要。钱花光了？游戏结束。',
      },
    ],
  },
  howItWorks: {
    title: '使用说明',
    subtitle: '三步开启创业启蒙',
    steps: [
      {
        number: '01',
        title: '分享你的想法',
        description: '告诉 AI 你的创业概念。想多详细都行。',
      },
      {
        number: '02',
        title: '运行模拟',
        description: '180 天创业生活。做决策，面对后果，快速学习。',
      },
      {
        number: '03',
        title: '获得报告',
        description: '看看哪里做错了，哪里做对了，以及如何改进。',
      },
    ],
  },
  pricing: {
    title: '简单诚实的定价',
    subtitle: '免费开始。需要更多再升级。',
    popular: '最受欢迎',
    perMonth: '/月',
    oneTime: '一次性',
    comingSoon: '即将推出',
    getStarted: '立即开始',
    upgrade: '立即升级',
    plans: {
      free: {
        name: '免费版',
        price: '¥0',
        description: '先试后买',
        features: [
          '1 次完整模拟',
          '基础报告',
          '所有行业',
          '中英文双语',
        ],
      },
      pro: {
        name: '专业版',
        price: '¥69',
        description: '适合认真的创业者',
        features: [
          '无限模拟次数',
          '详细分析报告',
          '导出结果',
          '所有创始人背景',
          '优先 AI 响应',
          '新功能优先体验',
        ],
      },
      team: {
        name: '团队版',
        price: '¥199',
        description: '适合团队和教学',
        features: [
          '专业版所有功能',
          '团队模拟',
          '结果对比',
          '自定义场景',
          'API 访问',
        ],
      },
    },
  },
  sim: {
    title: '创业模拟器',
    day: '第',
    of180: '天 / 180',
    stats: {
      cash: '资金',
      users: '用户',
      team: '团队',
      morale: '士气',
      mrr: '月收入',
      runway: '剩余跑道',
    },
    inputPlaceholder: '输入你的消息...',
    send: '发送',
    typing: '教练正在思考...',
    paywall: {
      title: '想再试一次？',
      description: '你已经用完了免费模拟次数。升级专业版获得无限次数。',
      upgrade: '升级专业版',
      learnMore: '了解更多',
    },
  },
  footer: {
    tagline: '在辞职之前，先测试你的创业想法。',
    product: '产品',
    company: '公司',
    legal: '法律',
    rights: '保留所有权利。',
  },
};
```

- [ ] **Step 3: Create i18n core library**

Create `lib/i18n/index.ts`:
```typescript
'use client';

import { en, type Translation } from './en';
import { zh } from './zh';

export type Language = 'en' | 'zh';

const STORAGE_KEY = 'goodbye-startup-lang';

export function getLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  // Check localStorage first
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'zh') return stored;
  
  // Check browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) return 'zh';
  
  // Default to English
  return 'en';
}

export function setLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, lang);
}

export function getTranslations(lang: Language): Translation {
  return lang === 'zh' ? zh : en;
}
```

- [ ] **Step 4: Create LanguageSwitcher component**

Create `components/i18n/LanguageSwitcher.tsx`:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { getLanguage, setLanguage, type Language } from '@/lib/i18n';

export function LanguageSwitcher() {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    setLang(getLanguage());
  }, []);

  const toggleLanguage = () => {
    const newLang: Language = lang === 'en' ? 'zh' : 'en';
    setLanguage(newLang);
    setLang(newLang);
    window.location.reload();
  };

  return (
    <button
      onClick={toggleLanguage}
      className="text-sm text-dark-600 hover:text-primary-600 transition-colors font-medium"
    >
      {lang === 'en' ? '中文' : 'EN'}
    </button>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add lib/i18n/ components/i18n/
git commit -m "feat: add i18n system with english and chinese"
```

---

## Task 4: Layout Components (Navbar & Footer)

**Files:**
- Create: `components/layout/Navbar.tsx`
- Create: `components/layout/Footer.tsx`
- Create: `app/layout.tsx`

**Interfaces:**
- Produces: Site-wide layout with navigation and footer
- Consumes: i18n translations, LanguageSwitcher

- [ ] **Step 1: Create Navbar component**

Create `components/layout/Navbar.tsx`:
```typescript
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getTranslations, getLanguage, type Language } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';

export function Navbar() {
  const [lang, setLang] = useState<Language>('en');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setLang(getLanguage());
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = getTranslations(lang);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      scrolled ? 'bg-white/90 backdrop-blur-md border-b border-dark-100' : 'bg-transparent'
    }`}>
      <div className="container-page">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GS</span>
            </div>
            <span className="font-bold text-lg text-dark-900">Goodbye Startup</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/how-it-works" className="text-dark-600 hover:text-primary-600 text-sm font-medium transition-colors">
              {t.nav.howItWorks}
            </Link>
            <Link href="/pricing" className="text-dark-600 hover:text-primary-600 text-sm font-medium transition-colors">
              {t.nav.pricing}
            </Link>
            <Link href="/about" className="text-dark-600 hover:text-primary-600 text-sm font-medium transition-colors">
              {t.nav.about}
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/sim" className="btn-primary text-sm py-2 px-4">
              {t.nav.startFree}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create Footer component**

Create `components/layout/Footer.tsx`:
```typescript
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getTranslations, getLanguage, type Language } from '@/lib/i18n';

export function Footer() {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    setLang(getLanguage());
  }, []);

  const t = getTranslations(lang);

  return (
    <footer className="bg-dark-900 text-white py-16">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GS</span>
              </div>
              <span className="font-bold text-lg">Goodbye Startup</span>
            </div>
            <p className="text-dark-400 text-sm max-w-sm">
              {t.footer.tagline}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm mb-4">{t.footer.product}</h4>
            <ul className="space-y-3">
              <li><Link href="/how-it-works" className="text-dark-400 hover:text-white text-sm transition-colors">{t.nav.howItWorks}</Link></li>
              <li><Link href="/pricing" className="text-dark-400 hover:text-white text-sm transition-colors">{t.nav.pricing}</Link></li>
              <li><Link href="/sim" className="text-dark-400 hover:text-white text-sm transition-colors">{t.nav.startFree}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm mb-4">{t.footer.legal}</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-dark-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/about" className="text-dark-400 hover:text-white text-sm transition-colors">{t.nav.about}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-dark-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-dark-500 text-sm">
            © {new Date().getFullYear()} Goodbye Startup. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Create root layout**

Create `app/layout.tsx`:
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Goodbye Startup - Test Your Startup Idea Before You Quit Your Job',
  description: 'A data-driven AI startup simulator that shows you the brutal reality of building a business. No risk, all the lessons.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/layout/ app/layout.tsx
git commit -m "feat: add navbar, footer, and root layout"
```

---

## Remaining Tasks (Outline)

These will be detailed in the full plan. This is the outline for reference:

### Task 5: Landing Page
- Hero section
- Features section
- How it works section
- Pricing preview
- CTA section

### Task 6: Static Pages
- How It Works page
- Pricing page (with fake checkout)
- About page
- Privacy page

### Task 7: Game State Management
- Types
- Context provider
- localStorage helpers
- Paywall logic

### Task 8: Chat Components
- ChatInterface
- MessageList
- MessageBubble
- ChatInput
- TypingIndicator

### Task 9: Status Panel
- Stats display
- Progress bar
- Day counter

### Task 10: Gemini API Integration
- System prompts (EN/ZH)
- API proxy route
- Gemini helper
- Response parsing

### Task 11: Simulator Page Integration
- Combine chat + status panel
- Game flow logic
- Paywall trigger

### Task 12: Cloudflare Deployment
- Build with next-on-pages
- Deploy to Pages
- Environment variables
- Domain binding
