> Historical snapshot, superseded by the root README and current docs. Do not use these commands for the refactored branch.

# 任务进度：SEO + GEO 优化、部署、文档同步

**日期**：2026-11-06
**项目目录**：`/Users/guan/Doubao/chats/2026-10-23/new-chat-2/goodbye-startup`

## 背景
- 站点 goodbye.help 已上线，但 SEO/GEO 基础缺失
- 用户要求：Loop 模式多轮优化 SEO（搜索引擎）+ GEO（生成式引擎优化，让 AI 引用本站），全面检查后部署，同步文档
- 目标市场：美国英文搜索（用户既定偏好）

## Loop 1 审计发现
| 问题 | 现状 |
|---|---|
| metadata | 有基础 title/description，但无 metadataBase、无 canonical、无 robots 字段 |
| 文件 | public 目录为空：无 favicon、无 robots.txt、无 sitemap.xml、无 OG 图 |
| 结构化数据 | 无 JSON-LD |
| 内容 | 无 FAQ 问答区块（GEO 核心素材） |
| 技术 | next.config.js 无安全头 |
| SSR 事实 | client 组件 SSR 时 getLanguage() 返回 en → 初始 HTML 含完整英文文案 ✅（AI 爬虫不执行 JS 也能读） |

## 方案（第一性原理）
- A. 根 layout：metadataBase、canonical、robots、themeColor、siteName + Organization/WebApplication JSON-LD
- B. app/sitemap.ts + app/robots.ts：**显式放行 GPTBot/ClaudeBot/PerplexityBot/Google-Extended**（GEO 核心策略：主动被 AI 引用）
- C. public/favicon.svg + 静态 og.svg
- D. landing 新增 FAQ 区块（6-8 个真实意图问题，直给答案、带数字）+ FAQPage JSON-LD
- E. 各路由 layout.tsx 独立 metadata
- F. next.config.js 安全响应头
- G. build 验证 → 部署 → 线上 curl 验证（非视觉，节省 token）→ 文档同步

## 对抗式审查结论：方案存活
- 风险降级：动态 OG Image（ImageResponse）在 next-on-pages 可能不兼容 → 改用静态 SVG
- sitemap/robots 若 next-on-pages 不兼容 → 降级为 public 静态文件
- 放行 AI 爬虫 = 被引用 = 免费品牌流量，符合 GEO 策略

## 进度
- [x] Loop 1 审计
- [x] Loop A-F 实施（metadata/robots/sitemap/favicon/OG/FAQ/JSON-LD/子页面 layout/安全头）
- [x] Loop G build（next build + next-on-pages + fix-node-imports 全通过）
- [x] Loop H 部署（https://3e39bb8e.goodbye-startup.pages.dev → 已上 goodbye.help）
- [x] Loop I 线上 curl 验证全部通过：title/description/canonical/OG/5 个 JSON-LD/FAQ 文案在 SSR HTML/安全头/子页面独立 title/simulator noindex/og.svg 与 favicon 200
- [x] Loop J 文档（AGENTS.md 新增 9.5 SEO & GEO Conventions）

## 部署结果
- 预览：https://3e39bb8e.goodbye-startup.pages.dev
- 生产：https://goodbye.help（自定义域名已指向新部署）
