# SEO 优化与 Loop 复核记录（2026-11-06）

> 本轮范围：把 `/simulator` 从 noindex 改为可索引，并在此基础上重跑一轮全站 SEO 优化，最后用 Loop 模式做五视角复核。
> 任何会话接手 SEO 相关工作前，先读本文件 + `AGENTS.md` 第 9.5 节。

## 1. 变更清单

| # | 文件 | 变更前 | 变更后 |
|---|---|---|---|
| 1 | `app/simulator/layout.tsx` | `robots: { index: false, follow: false }`，无 canonical | `robots: { index: true, follow: true }` + `alternates.canonical: "/simulator"` |
| 2 | `app/simulator/layout.tsx` | title `Start Your Simulation` | `Startup Simulator — Free 180-Day Test`（含目标关键词） |
| 3 | `app/sitemap.ts` | 5 条 URL，注释写明排除 `/simulator` | 6 条 URL，`/simulator` priority 0.9 |
| 4 | `app/sitemap.ts` | `lastModified: new Date()`（每次部署都变） | 固定 `LAST_MODIFIED = 2026-11-06`，内容变更时手动 bump |
| 5 | `components/sim/SimulatorGuide.tsx`（新增） | 无 | 服务端渲染的可索引说明区：H1 + 输入/输出/数字来源三节 |
| 6 | `lib/i18n/en.ts` / `zh.ts` | 无 `sim.guide` | 新增 `sim.guide` 九个键（中英各一套） |
| 7 | `app/simulator/page.tsx` | 仅 `<GameProvider><SimulatorContent/></GameProvider>` | 追加 `<SimulatorGuide />` |
| 8 | `app/layout.tsx` | 默认 title 67 字符，description 191 字符 | title 55、description 148（避免 SERP 截断） |
| 9 | `app/layout.tsx` | `og:image` / `twitter:image` = `/og.svg` | 改为 `/og.png`（1200×630 PNG，sharp 从 svg 转换），含 `og:image:alt` |
| 10 | `app/how-it-works/layout.tsx` | title 67 字符、desc 171 | title 50、desc 137 |
| 11 | `app/pricing/layout.tsx` | title 65 | title 51 |
| 12 | `AGENTS.md` 9.5 | 「`/simulator` 是 noindex」 | 改为「自 2026-11-06 起可索引」+ 文案同步义务 + OG 图必须位图 + 标题预算 |

### 为什么必须补文案才敢放索引
`/simulator` 原本是纯 `"use client"` 渲染，HTML 里没有正文，直接放出去会变成「已抓取未编入索引」。新增的说明区通过 client component 的 SSR 输出进 HTML（实测无 JS 可读 257 words），既满足可索引条件，又不破坏静态预渲染。

## 2. Loop 复核结果（五轮，逐轮验线上）

| 轮次 | 视角 | 检查项 | 结果 |
|---|---|---|---|
| Loop 1 | 爬虫 / 索引资格 | 6 页 HTTP、robots、canonical 自指、sitemap 收录、robots.txt 放行 AI 爬虫 | **全通过**：6/6 页 `index, follow` + canonical 自指 + 均在 sitemap；sitemap 200 `application/xml`、6 条 loc、lastmod 固定 `2026-11-06` |
| Loop 2 | SERP 呈现 | title ≤60、desc ≤160、每页单 H1、OG 标签 | **全通过**：titles 32–59，descs 91–153，6 页均 1 个 H1，`og:image=/og.png`、`og:type=website` |
| Loop 3 | 内容厚度 / 内链 | 每页可读字数、内链、图片 alt | 768 / 184 / 167 / 271 / 243 / 257 words；首页 4 处指向 `/simulator`；alt 缺失 0 |
| Loop 4 | GEO / 结构化数据 | JSON-LD 合法性、类型、无 JS 可读性 | 首页 Organization+WebApplication+FAQPage，其余页 Organization+WebApplication，全部 JSON 合法可解析；`/simulator` 正文无需执行 JS 即可读 |
| Loop 5 | 对抗 / 边界 | http→https、www→裸域、尾斜杠、大写路径、404、安全头 | 301 / 301（保留 query，单跳）/ 308 / 404 / 404；HSTS `max-age=15552000; includeSubDomains`、nosniff、SAMEORIGIN、strict-origin-when-cross-origin 均在 |

> Loop 5 第一次跑出现「期望 301 实得 200」的假阳性，原因是 Python urllib 默认跟随跳转；改用 `curl` 不跟随重测后结论正确。后续复核一律用 curl 判跳转。

## 3. 遗留项（需你拍板，没有擅自改）

| # | 事项 | 现状 | 建议 |
|---|---|---|---|
| 1 | `/how-it-works` 184 words、`/pricing` 167 words 偏薄 | 内容量与搜索意图（"how does X work"、"pricing"）不匹配 | 各补一段 300–500 词的实质内容（阶段细节 / 定价对比 / 退款政策说明）；涉及品牌语气，需你定调后再写 |
| 2 | 中文内容不可被 Google 读到 | i18n 是客户端切换，同一 URL 只输出英文 | 若要做中文 SEO，需拆 `/zh/` 子路径 + `hreflang`；否则中文只服务已进站用户 |
| 3 | `/api/*` 未被 robots.txt 屏蔽 | 目前无 GET 可索引内容，风险低 | 出现可抓 API 页面时再补 `Disallow: /api/` |
| 4 | `.rsc` 路由（如 `/simulator.rsc`）返回 200 | 未被 HTML 链接暴露，Google 一般不发现 | 若担心，可在 Cloudflare 侧加 `X-Robots-Tag: noindex`（需改 `_headers`） |
| 5 | 各页 `og:url` 仍指向首页 | 继承根 layout | 分享场景影响小，后续可逐页设置 |

## 4. 回滚方式

```bash
# 单个文件回滚
git checkout -- app/simulator/layout.tsx app/sitemap.ts app/layout.tsx \
  app/how-it-works/layout.tsx app/pricing/layout.tsx
rm components/sim/SimulatorGuide.tsx

# 回到「/simulator 不索引」
# 1) layout.tsx 改回 robots: { index: false, follow: false }
# 2) sitemap.ts 去掉 "/simulator"
# 3) 重新构建部署（见下）
```

## 5. 构建与部署

```bash
npx @cloudflare/next-on-pages
CLOUDFLARE_API_TOKEN=$(cat ~/.config/cloudflare/goodbye.help.token) \
  npx wrangler pages deploy .vercel/output/static --project-name goodbye-startup --branch main
```

本轮共 3 次生产部署，最终线上版本已全部通过上述五个 Loop。

## 6. 第二轮：内容补强（同日）

第一轮 Loop 3 发现 `/how-it-works`（184 词）与 `/pricing`（167 词）内容偏薄，与其搜索意图不匹配。本轮补齐：

| 页面 | 新增内容 | 补前 → 补后 | 文件 |
|---|---|---|---|
| `/how-it-works` | 「What is actually being computed」：单位经济模型 / 现金账本 / 决策节奏 / 基准为何偏悲观 / 它给不了什么 | 184 → **400 词** | `app/how-it-works/page.tsx` + i18n `howItWorks.detail` |
| `/pricing` | 「Before you pay」六问：什么算一次、是否要账号、数据存哪、能否取消、没用怎么办、免费为何只有一次 | 167 → **349 词** | `app/pricing/page.tsx` + i18n `pricing.faq` |

`/pricing` 原来的 "FAQ placeholder" 区块是硬编码英文（`Questions?` / `We're here to help...`），既违反 i18n 规则又没有实质信息，本轮一并替换为走 i18n 的六问答。新增文案全部中英双份，`tsc --noEmit` 通过（`Translations = typeof en`，结构不一致会直接报错）。

## 7. 中文 SEO 决策：应放弃（现阶段）

第一轮遗留项 #2「中文内容 Google 读不到」按第一性原理 + 对抗审查评估，结论是**现在不做**。

**第一性原理**
1. Google 索引的是 URL，不是语言。当前 6 个 URL 的 HTML 只有英文，中文是客户端切换产生，爬虫永远看不到。
2. 要让中文可被索引，必须存在「独立 URL + 独立中文 HTML」。
3. 独立 URL 带来重复主题风险，只有正确的 `hreflang` 互指 + `x-default` 才能让 Google 视其为语言版本而非重复内容。
4. 因此这不是加个开关，而是一次路由层重构。

**对抗审查**
- 攻击「有流量就有收入」：AGENTS.md 明确支付页是假的（为申请 PayPal 预留），中文流量进来无法付费，等于零收入。
- 攻击「中文市场有机会」：产品定位是美国 25–35 岁创业者，价格 $9.99/月；中文搜索词被知乎/豆瓣等本地内容占住，一个美元定价的小站胜率低。
- 攻击执行路径：现有 i18n 靠 `localStorage` + `useI18n()` 全局读，改路由级 locale 要动所有页面与组件、导航切换器、SSR 默认语言，blast radius 覆盖整个可用站点。
- 隐藏成本：文案永远写两份；每次改产品都要同步两套；sitemap、canonical、hreflang 三处都要双份维护。
- 最坏情况：重构半途出现语言切换回归，真实用户直接受害，而收益仍是推测。

**结论：应放弃。** 触发条件（满足任一再重开）：支付真实可用、出现中文付费用户、或明确要做中文内容站。届时按「路由级 i18n + hreflang + x-default」一次性重构，不零散加页面。

## 8. 交叉会话复核：/guides 的自相矛盾（已修）

复检线上 sitemap 时发现条目变成 7 条、多出 `/guides`（另一个会话在 `3917661 feat: SEO content depth optimization` 中新增并推到 GitHub，由 Git 集成自动部署）。该页在 `app/guides/page.tsx` 里没有任何 metadata，于是继承了根 layout 的默认 title 与 `alternates.canonical: "/"`：

- sitemap 声明「请索引 `/guides`」
- 页面自己声明「我是首页的重复版本」（canonical 指 `/`）

这与前面 `/simulator` 的坑是同一个模式，属于新增路由的常见遗漏。Google 收到这种信号会把它判为重复页剔除。

修复（提交 `211614a`）：新增 `app/guides/layout.tsx`，写入独立 title `Startup Guides — Read Before You Build`（56 字符）、独立 description、`alternates: { canonical: "/guides" }`；同时补一段 i18n 导语（`guides.intro`，中英双份），该页字数 184 → 220。

**给其他会话的规则**：新增任何路由必须在同目录加 `layout.tsx` 并写 `title` / `description` / `alternates.canonical`，否则会静默继承根 canonical，和 sitemap 打架。

修复后七页终检（Googlebot UA）：全部 200 / `index, follow` / canonical 自指 / 均在 sitemap；title 32–59；字数 993 / 220 / 737 / 443 / 495 / 271 / 243。


