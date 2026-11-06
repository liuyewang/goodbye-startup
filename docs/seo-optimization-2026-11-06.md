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
