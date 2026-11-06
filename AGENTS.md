# AGENTS.md

> AI Agent Development Specification for Goodbye Startup
> Last Updated: 2026-08-05

---

## 1. Project Overview

**Project Name**: Goodbye Startup
**Description**: A data-driven AI startup simulator built with Next.js + Cloudflare
**Primary Audience**: US-based aspiring entrepreneurs (25-35)
**Secondary Audience**: Chinese users (i18n supported)
**Status**: MVP Development

---

## 2. Tech Stack Constraints (HARD RULES)

### 2.1 Frontend
- **Framework**: Next.js 14 with App Router (no Pages Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS (no CSS-in-JS libraries)
- **State**: React Context + localStorage (no Redux/Zustand for MVP)
- **i18n**: Custom lightweight implementation (no next-intl / i18next)

### 2.2 Backend
- **Runtime**: Cloudflare Pages Functions (Workers)
- **API**: REST only (no GraphQL for MVP)
- **Database**: localStorage (MVP) → Cloudflare D1 (v1.1)
- **AI**: Google Gemini 3.5 Flash with Google Search enabled

### 2.3 Deployment
- **Platform**: Cloudflare Pages
- **Domain**: goodbye.help
- **CI/CD**: Git push → auto deploy

### 2.4 Forbidden Dependencies
Do NOT add these without explicit approval:
- Any state management library (Redux, Zustand, MobX, etc.)
- Any UI component library (MUI, Ant Design, Chakra, etc.)
- Any i18n library
- Any form library (React Hook Form, Formik, etc.)
- Any animation library (Framer Motion, GSAP, etc.)
- Any CSS framework other than Tailwind

**Reason**: Keep bundle size small, reduce complexity, maintain full control over UI.

---

## 3. Directory Structure Convention

```
goodbye-startup/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (Navbar + Footer + providers)
│   ├── page.tsx                 # Landing page
│   ├── sim/page.tsx             # Simulator page
│   ├── how-it-works/page.tsx    # Product explanation
│   ├── pricing/page.tsx         # Pricing page
│   ├── about/page.tsx           # About page
│   ├── privacy/page.tsx         # Privacy policy
│   ├── api/chat/route.ts        # Gemini API proxy
│   └── globals.css              # Global styles + Tailwind directives
├── components/                   # React components
│   ├── layout/                  # Layout components (Navbar, Footer)
│   ├── ui/                      # Reusable UI components (Button, Card, etc.)
│   ├── chat/                    # Chat interface components
│   └── sim/                     # Simulator-specific components
├── lib/                          # Utility libraries
│   ├── i18n/                    # Internationalization
│   │   ├── index.ts
│   │   ├── en.ts
│   │   └── zh.ts
│   ├── prompts/                 # AI system prompts
│   │   ├── system-prompt-en.ts
│   │   └── system-prompt-zh.ts
│   ├── game/                    # Game state logic
│   │   ├── types.ts
│   │   ├── context.tsx
│   │   └── storage.ts
│   └── gemini.ts                # Gemini API wrapper
├── hooks/                        # Custom React hooks
├── docs/                         # Project documentation
│   ├── BRD.md
│   ├── PRD.md
│   ├── tech-stack.md
│   ├── execution-plan.md
│   └── superpowers/             # Superpowers workflow docs
│       └── plans/
├── public/                       # Static assets
├── tests/                        # Tests (when added)
├── AGENTS.md                     # This file
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── postcss.config.js
├── wrangler.toml                 # Cloudflare config
└── .gitignore
```

**Rule**: Create directories only when needed. Don't create empty directories speculatively.

---

## 4. Naming Conventions

### 4.1 Files
- **Components**: PascalCase (`Navbar.tsx`, `ChatInterface.tsx`)
- **Utilities / Hooks**: camelCase (`useGameState.ts`, `gemini.ts`)
- **Types**: PascalCase (`GameState`, `Message`)
- **Pages**: `page.tsx` (Next.js convention)
- **Config files**: kebab-case (`tailwind.config.js`)

### 4.2 Variables & Functions
- **Variables**: camelCase
- **Functions**: camelCase (verb + noun: `getUser`, `sendMessage`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FREE_SIMULATIONS`, `GEMINI_MODEL`)
- **Booleans**: prefix with `is` / `has` / `should` (`isLoading`, `hasCompleted`)

### 4.3 Components
- **Default export**: Always use default export for page and component files
- **Props interface**: `ComponentNameProps` (e.g., `ButtonProps`)

### 4.4 Git Commits
Follow Conventional Commits:
```
feat: add new feature
fix: fix a bug
docs: update documentation
style: formatting, no code change
refactor: refactor code
test: add tests
chore: build process, tooling, dependencies
```

**Examples**:
- `feat: add chat interface component`
- `fix: fix language switcher state persistence`
- `docs: update PRD with pricing details`

---

## 5. Code Style Rules

### 5.1 TypeScript
- Always use `type` for object shapes, `interface` only for extends/implements
- No `any` — use `unknown` if type is truly uncertain
- Prefer type inference over explicit annotations
- All function parameters and return types must be explicitly typed for exported functions

### 5.2 React
- Use function components only (no class components)
- Prefer Server Components for static content
- Use Client Components (`'use client'`) only when needed (state, effects, browser APIs)
- Hooks at the top of the component
- No inline styles — use Tailwind classes

### 5.3 Tailwind CSS
- Use utility classes, don't write custom CSS unless absolutely necessary
- Responsive: mobile-first (`sm:`, `md:`, `lg:`)
- Colors: use the custom `primary` color palette defined in tailwind.config.js
- Spacing: use Tailwind's spacing scale, don't use arbitrary values unless needed

### 5.4 API Routes
- Always validate input
- Always return proper HTTP status codes
- Error responses: `{ error: string }`
- Success responses: `{ data: ... }`
- Never expose API keys or sensitive data to client

---

## 6. Security Rules (HARD RULES)

### 6.1 API Key Security
- NEVER put API keys in client-side code
- ALL API keys must be in environment variables
- API proxy must be server-side only
- Never commit `.env` files to Git

### 6.2 User Data
- MVP: no user accounts, all data in localStorage
- Don't collect personal information
- Don't store chat history server-side (MVP)
- If storing data later, encrypt sensitive data

### 6.3 Input Validation
- Validate all user input on both client and server
- Sanitize user-generated content before rendering
- No `dangerouslySetInnerHTML` without sanitization

### 6.4 Rate Limiting
- Implement basic rate limiting on API endpoints
- Prevent abuse of Gemini API (cost control)

---

## 7. i18n Rules

### 7.1 Language Strategy
- Default: English (`en`)
- Secondary: Chinese (`zh`)
- Detection: localStorage → browser language → default (en)
- Switching: manual switcher in Navbar, persists to localStorage

### 7.2 Translation Rules
- All UI text must go through the i18n system
- No hardcoded English strings in components
- Translation keys: `namespace.keyName` (e.g., `nav.home`, `hero.title`)
- AI-generated content: handled by Gemini itself (prompt language determines output)

---

## 8. Game / Simulator Rules

### 8.1 Game State
- State managed via React Context
- Persisted to localStorage
- Key: `goodbye-startup-state`
- Structure: defined in `lib/game/types.ts`

### 8.2 Free Tier Limit
- 1 free simulation per user
- Counter stored in localStorage
- Paywall triggers when user starts 2nd simulation
- Paywall: redirect to /pricing or show modal

### 8.3 AI Interaction
- System prompt determines AI behavior
- Language follows UI language setting
- Google Search enabled for fact-checking
- Parse stats from AI response (JSON or structured format)

---

## 9. Deployment Rules

### 9.1 Environment Variables
Set in Cloudflare Pages dashboard:
- `GEMINI_API_KEY` - Gemini API key (required)
- `NEXT_PUBLIC_SITE_URL` - Site URL (for metadata)

### 9.2 Build Command
```bash
npx @cloudflare/next-on-pages
```

### 9.3 Deploy Command
```bash
npx wrangler pages deploy .vercel/output/static
```

### 9.4 Domain
- Primary (canonical): `goodbye.help` — CNAME → `goodbye-startup.pages.dev`, proxied
- `www.goodbye.help` — 301 → apex via Zone Redirect Rule (`http_request_dynamic_redirect`); DNS CNAME stays proxied, do NOT bind www to Pages
- `startup.goodbye.help` — 301 → `https://goodbye.help/simulator` via the same Redirect Rule (simulator entry, not a mirrored site). It is intentionally NOT bound as a Pages custom domain — Pages would shadow the redirect rule.
- `wise.goodbye.help` — separate Lemon Squeezy payment callback (Aliyun ECS), do not touch
- SSL mode: Full (strict). DNS managed by Cloudflare; auto-cert.
- Git integration: Pages project is connected to `liuyewang/goodbye-startup`, production branch `main`, build dest `.vercel/output/static`, env `GEMINI_API_KEY`. Direct `wrangler pages deploy` still works and overrides.

### 9.5 SEO & GEO Conventions
- Metadata: root `app/layout.tsx` sets metadataBase + default title template + OG/Twitter; each route segment adds its own `layout.tsx` with `title`/`description`/`alternates.canonical`.
- `/simulator` is indexable since 2026-11-06: `robots: index, follow` + self canonical `/simulator`, listed in `app/sitemap.ts`. Its indexable copy lives in `components/sim/SimulatorGuide.tsx` (strings under i18n `sim.guide`) — if you change the flow, phases, or stat model, update that copy in the same commit, otherwise the page becomes thin content again.
- `app/sitemap.ts` and `app/robots.ts` are Next-native (prerendered). robots.txt **explicitly allows** GPTBot/OAI-SearchBot/ChatGPT-User/ClaudeBot/PerplexityBot/Google-Extended — GEO strategy is to be cited by AI engines, do not block them.
- JSON-LD: Organization + WebApplication in root layout; FAQPage on landing. When adding content sections with Q&A structure, keep the visible HTML answer text in sync with the JSON-LD `acceptedAnswer` (AI crawlers read the HTML, JSON-LD only enriches).
- Favicon is a static SVG in `public/`; the OG image is `public/og.png` (1200×630 PNG, generated from `public/og.svg` with `sharp`) — social and AI platforms do not render SVG in previews, so always ship a raster OG image. No `ImageResponse` (avoids next-on-pages edge compatibility issues).
- Title budget: segment titles must stay short enough that `title + " | Goodbye Startup"` (17 chars) ≤ 60 chars; descriptions ≤ 155 chars. Check with a curl + length audit after deploy.
- Verification after deploy: `curl` the deployed URL for `<title>`, canonical, `application/ld+json` count, `/robots.txt`, `/sitemap.xml`, and security headers.

---

## 10. Testing Rules (MVP)

**MVP Testing Priority**: Manual testing > automated tests

For MVP, focus on:
1. Manual end-to-end testing of core flow
2. Cross-browser testing (Chrome, Safari, Firefox)
3. Mobile responsive testing
4. i18n testing (both languages)

Automated tests can be added post-MVP.

---

## 11. Documentation Rules

### 11.1 Required Docs
- `README.md` - Project overview, quick start
- `AGENTS.md` - This file (AI agent spec)
- `docs/BRD.md` - Business requirements
- `docs/PRD.md` - Product requirements
- `docs/tech-stack.md` - Technical architecture
- `docs/execution-plan.md` - High-level timeline

### 11.2 Code Documentation
- Comment "why", not "what"
- JSDoc for exported functions
- Complex logic needs inline comments
- No commented-out code (delete it, Git remembers)

---

## 12. Workflow Rules

Follow the Superpowers workflow:

1. **Brainstorming**: Clarify requirements before coding
2. **Writing Plans**: Break work into bite-sized tasks
3. **Executing Plans**: Task by task, commit after each
4. **Verification**: Test before declaring done
5. **Code Review**: Self-review before finalizing

---

## 13. Known Constraints & Tradeoffs

Document decisions that might seem odd but are intentional:

1. **No UI library**: Full control over design, smaller bundle
2. **Custom i18n**: Lightweight, no dependency bloat
3. **localStorage instead of DB**: MVP speed, no auth needed
4. **No state management library**: Context is enough for MVP
5. **Fake payment page**: For PayPal application, real payment later

---

## 14. Emergency Contact

If something is unclear or you need a decision:
- Check PRD first
- Check tech-stack.md second
- If still unclear, stop and ask the human

**Never make up requirements. When in doubt, ask.**
