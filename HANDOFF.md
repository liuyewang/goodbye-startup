# HANDOFF — 项目交接说明（给接手 AI）

> 本文档帮助新 AI 快速、无坑接管 Goodbye Startup。请先读本文，再读 `AGENTS.md`。
> 交接时间：2026-11

---

## 1. 项目是什么

**Goodbye Startup**（线上域名 https://goodbye.help）是一个 AI 创业模拟器 / 想法验证工具。
用户用自然语言描述创业想法，AI 在一次模拟中推进 180 天的市场数据（现金、用户、CAC、流失、士气等），最终给出"可行 / 勉强 / 放弃"的判决。

- 核心用户：美国 25–35 岁、有全职工作、尚未辞职的潜在创业者（约 70% 首次访问来自**手机端**，耐心只有约 30 秒）
- 商业模式：免费 1 次模拟，之后按次付费（$0.99）或 Pro 订阅
- 无需注册，数据存在浏览器 localStorage

---

## 2. 实际技术栈（以代码为准，AGENTS.md 部分描述已过时）

| 项 | 实际情况 |
|---|---|
| 框架 | **Next.js 15.5**（App Router），不是 AGENTS.md 写的 14 |
| 语言 | TypeScript（strict） |
| UI | React 19 + Tailwind CSS 3.4 + 自定义 CSS |
| 运行时 | Cloudflare Pages Functions（Workers，edge runtime） |
| AI | **DeepSeek**（`deepseek-flash`，OpenAI 兼容接口 `https://api.deepseek.com/v1/chat/completions`），不是 Gemini |
| 部署 | Cloudflare Pages，构建用 `@cloudflare/next-on-pages` |
| 状态 | React Context + localStorage |

### 硬约束（AGENTS.md 禁止，务必遵守）
**禁止**添加任何 UI 组件库、动画库（Framer Motion/GSAP 等）、状态管理库、i18n 库、表单库、CSS 框架。
所有效果只能用 **Tailwind + 自定义 CSS** 实现。目的是控制包体积、完全掌控 UI。

---

## 3. 快速开始

```bash
npm install              # 恢复依赖（交接副本不含 node_modules）
# 然后在 .env.local 填入真实 DEEPSEEK_API_KEY（见下一节）
npm run dev              # 本地开发 http://localhost:3000
```

---

## 4. 环境变量（重点，容易踩坑）

- API 路由 `app/api/chat/route.ts` 读取的是 **`process.env.DEEPSEEK_API_KEY`**。
- 交接副本里的 `.env.local` 已修正为正确变量名，但值是占位符，**本地运行前必须填入真实 DeepSeek key**：
  ```
  DEEPSEEK_API_KEY=sk-xxxx
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  ```
- `.env.local` 已被 `.gitignore` 忽略，不会进仓库，不要把真实密钥写进任何会被提交的文件。
- **线上**的真实 key 配置在 Cloudflare Pages 项目的环境变量里（变量名同样是 `DEEPSEEK_API_KEY`），不在代码库中。

---

## 5. 构建与部署

### 本地构建（Cloudflare Pages 产物）
```bash
npm run pages:build      # = npx @cloudflare/next-on-pages，输出到 .vercel/output/static
```

### 部署
```bash
# 方式 A：Git 推送到 main 自动部署（注意 wrangler.toml 的坑，见第 7 节）
# 方式 B：手动部署（更可靠，构建失败时的兜底）
CLOUDFLARE_API_TOKEN=xxx CLOUDFLARE_ACCOUNT_ID=xxx \
  npx wrangler pages deploy .vercel/output/static --project-name=goodbye-startup
```

### Cloudflare 配置（`wrangler.toml`）
- `compatibility_date = "2025-09-01"`，`compatibility_flags = ["nodejs_compat"]`
- 不要把日期改回 2024 年：旧日期不支持 Next.js 15 的 AsyncLocalStorage，会报 async_hooks 500 错误。

---

## 6. 目录与关键文件

```
app/
  page.tsx                # 首页（含 FAQ JSON-LD）
  layout.tsx              # 根布局：metadata、viewport(viewport-fit=cover)、Organization+WebApplication JSON-LD
  globals.css             # 全局样式 + 所有自定义工具类/动画
  api/chat/route.ts       # DeepSeek 代理（edge runtime，读 DEEPSEEK_API_KEY）
  simulator/              # 模拟器页面
  how-it-works/ pricing/ about/ privacy/
  blog/ guides/           # 内容页（SEO）
components/
  layout/                 # Navbar、Footer
  chat/                   # ChatInterface、ChatInput、MessageList、MessageBubble、TypingIndicator
  sim/                    # SimulatorContent、StatusPanel、SimulatorGuide
lib/
  i18n/en.ts zh.ts        # 中英文案（自定义轻量 i18n，键名必须保持一致）
  game/                   # Context、types、localStorage 存储
  prompts/system-en.ts system-zh.ts  # DeepSeek 系统提示词
public/blog/feed.xml      # RSS（静态文件，见第 7 节的坑）
```

---

## 7. 已验证的死路 / 已知坑（最重要，避免重蹈覆辙）

1. **next-on-pages 对 Next.js route handler 支持有限**：原本用 `app/blog/feed.xml/route.ts` 动态生成 RSS，线上 404。
   已改成 `public/blog/feed.xml` **纯静态文件**解决。新增类似简单动态输出时，优先考虑静态文件。

2. **compatibility_date 不能用旧日期**：2024-01-01 不支持 Next.js 15 的 AsyncLocalStorage，API 路由 500。固定用 `2025-09-01` + `nodejs_compat`。

3. **wrangler.toml 会让 Git 自动部署跳过构建**：项目里有 wrangler.toml 时，Cloudflare Git 集成可能不执行 next-on-pages 构建。需在 Pages 配置里显式指定 build command 为 `npx @cloudflare/next-on-pages`；自动部署连续失败时，用本地构建 + wrangler 手动部署兜底。

4. **i18n 重复属性会导致构建失败**：修改 `lib/i18n/en.ts`、`zh.ts` 时，保证两个文件键名完全一致、无重复 key。历史上曾因重复属性和 route handler 问题导致 Git 构建失败。

5. **文案规范（用户明确要求，已统一）**：
   - 一律用 **"一次模拟 / simulation"**，不要用"一次对话 / conversation"。
   - 所有"工作原理 / How It Works"相关区块，凡是出现"180 天 / 多少天"的地方，都要明确说明：**这些天数是模拟内的时间，真实只需约 15 分钟**。首页及各相关页面已加琥珀色提示条（`timeNote`），改动时不要删掉。

6. **移动端已做的优化（改动时保持）**：
   - `viewport-fit=cover` + safe-area 工具类（`pb-safe`/`pt-safe`/`mb-safe`）适配 iPhone 刘海和底部横条。
   - 触摸目标 ≥44px；ChatInput 输入框 48px 高、16px 字号（防止 iOS 聚焦自动缩放）。
   - StatusPanel 手机端横向滑动（`scrollbar-hide`），桌面端 6 列 grid。
   - 动效原则：**少而精**，只在关键节点（按压、消息入场、状态变化）加有意义的反馈，不要为动而动。

---

## 8. 当前完成状态

- 页面：共 15 个 URL（首页、simulator、how-it-works、pricing、about、privacy、blog 首页 + 4 篇博客、guides 首页 + 3 篇指南、RSS），sitemap 已全部收录。
- SEO：每页 metadata + canonical、FAQ/Organization/WebApplication JSON-LD、RSS、安全头（X-Frame-Options、X-Content-Type-Options、Referrer-Policy、Permissions-Policy）。
- 设计：已完成移动端优先 + 游戏感微交互 + Bento 视觉升级。
- 最近一次线上验证：15 页全部 200，JSON-LD 与安全头完整。

### 可继续的方向（非必须）
- 继续扩充博客/指南内容并保持内链与 FAQ schema 同步。
- 模拟器流程或数据模型若改动，需同步更新 `components/sim/SimulatorGuide.tsx` 的文案（防止 simulator 页面变回薄内容）。
- 任何线上配置改动遵循官方文档与最佳实践，改完用 curl 做非视觉验证。
