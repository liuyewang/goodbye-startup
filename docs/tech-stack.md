# 技术方案

**项目名称**：Goodbye Startup  
**版本**：v1.0 (MVP)  
**日期**：2026-08-05

---

## 1. 技术选型

### 1.1 整体架构

```
┌─────────────────────────────────────────────────┐
│                   Cloudflare                     │
│  ┌─────────────┐    ┌───────────────────────┐   │
│  │             │    │                       │   │
│  │  Pages      │    │  Pages Functions      │   │
│  │  (Next.js)  │───▶│  (Workers)            │   │
│  │             │    │  /api/chat            │   │
│  └─────────────┘    └──────────┬────────────┘   │
│                                │                │
│                                ▼                │
│  ┌─────────────┐    ┌───────────────────────┐   │
│  │   R2        │    │  Gemini API           │   │
│  │  (Storage)  │    │  (Google AI Studio)   │   │
│  └─────────────┘    └───────────────────────┘   │
│                                                  │
│  ┌─────────────┐                                 │
│  │   D1        │  (MVP 阶段用 localStorage)      │
│  │  (Database)│                                 │
│  └─────────────┘                                 │
└─────────────────────────────────────────────────┘
```

### 1.2 技术栈选择

| 层级 | 技术 | 选型理由 |
|------|------|---------|
| **前端框架** | Next.js 14 (App Router) | 全栈能力强、SSR/SSG、Cloudflare Pages 原生支持 |
| **语言** | TypeScript | 类型安全、开发体验好 |
| **样式** | Tailwind CSS | 快速开发、响应式、体积小 |
| **后端** | Cloudflare Pages Functions | 和 Pages 一体、边缘计算、免费额度高 |
| **数据库** | Cloudflare D1 (MVP 用 localStorage) | 边缘 SQLite、免费、后续扩展方便 |
| **存储** | Cloudflare R2 | 无出口流量费、S3 兼容 |
| **AI** | Google Gemini 3.5 Flash | 速度快、便宜、支持 Google Search |
| **部署** | Cloudflare Pages | 全球 CDN、免费额度大、一键部署 |
| **域名** | Cloudflare Registrar | 便宜、DNS 一体 |
| **Git** | GitHub + GitHub CLI | 代码托管、版本管理 |

### 1.3 为什么选 Cloudflare 全家桶

1. **成本最低**：免费额度足够 MVP 使用
2. **运维最少**：不用管服务器，全托管
3. **速度最快**：全球边缘节点，美国用户访问飞快
4. **一体化**：一个平台管所有，不用拼凑
5. **国内能访问**：比 Vercel / AWS 好

---

## 2. 项目结构

```
goodbye-startup/
├── app/                              # Next.js App Router
│   ├── layout.tsx                   # 全局布局（导航栏 + 页脚 + 多语言）
│   ├── page.tsx                     # 首页（Landing）
│   ├── sim/
│   │   └── page.tsx                 # 模拟器页面
│   ├── how-it-works/
│   │   └── page.tsx                 # 产品说明
│   ├── pricing/
│   │   └── page.tsx                 # 定价页
│   ├── about/
│   │   └── page.tsx                 # 关于我们
│   ├── privacy/
│   │   └── page.tsx                 # 隐私政策
│   ├── api/
│   │   └── chat/
│   │       └── route.ts             # Gemini API 代理
│   └── globals.css                  # 全局样式
├── components/                       # 组件
│   ├── Navbar.tsx                   # 导航栏
│   ├── Footer.tsx                   # 页脚
│   ├── ChatInterface.tsx            # 对话界面
│   ├── StatusPanel.tsx              # 状态面板
│   ├── MessageBubble.tsx            # 消息气泡
│   ├── LanguageSwitcher.tsx         # 语言切换
│   └── PricingCard.tsx              # 定价卡片
├── lib/                              # 工具库
│   ├── i18n/
│   │   ├── index.ts                 # i18n 核心
│   │   ├── en.ts                    # 英文翻译
│   │   └── zh.ts                    # 中文翻译
│   ├── prompts/
│   │   ├── system-prompt-en.ts      # 英文系统提示词
│   │   └── system-prompt-zh.ts      # 中文系统提示词
│   ├── game-state.ts                # 游戏状态管理
│   └── gemini.ts                    # Gemini API 封装
├── docs/                             # 项目文档
│   ├── BRD.md
│   ├── PRD.md
│   ├── tech-stack.md
│   ├── execution-plan.md
│   └── agent-notes.md
├── public/                           # 静态资源
│   ├── favicon.ico
│   └── og-image.png
├── next.config.js                    # Next.js 配置
├── tailwind.config.js                # Tailwind 配置
├── tsconfig.json                     # TypeScript 配置
├── package.json                      # 依赖
├── wrangler.toml                     # Wrangler 配置
├── .gitignore
└── README.md
```

---

## 3. 核心模块设计

### 3.1 多语言系统

**方案**：轻量级 i18n，不用第三方库，自己实现

```typescript
// lib/i18n/index.ts
export type Language = 'en' | 'zh';

export function getLanguage(): Language {
  // 1. 检查 localStorage
  // 2. 检查浏览器语言
  // 3. 默认英文
}

export function t(key: string): string {
  // 根据当前语言返回翻译
}
```

**语言切换**：
- 右上角按钮切换
- 存在 localStorage 里
- 刷新后保持

### 3.2 游戏状态管理

**方案**：React Context + localStorage 持久化

```typescript
interface GameState {
  sessionId: string;
  currentDay: number;
  messages: Message[];
  stats: {
    cash: number;
    users: number;
    team: number;
    morale: number;
    mrr: number;
    runway: number;
  };
  simulationCount: number; // 已模拟次数
  hasCompletedFirst: boolean;
}
```

**付费墙逻辑**：
- `simulationCount >= 1` 且用户开始新模拟时触发
- 显示付费提示，引导去 Pricing 页

### 3.3 Gemini API 代理

**为什么需要代理**：
- API Key 不能暴露在前端
- 可以做速率限制
- 可以统一处理错误

**API 设计**：

```
POST /api/chat
Body: {
  messages: Array<{ role: 'user' | 'model', content: string }>,
  language: 'en' | 'zh'
}
Response: {
  content: string,
  stats?: { cash, users, ... } // AI 返回的数值更新
}
```

**Gemini 配置**：
- 模型：gemini-3.5-flash
- 开启 Google Search
- 温度：0.7（平衡创意和稳定）
- 最大 token：4096

### 3.4 对话界面

**组件结构**：
```
ChatInterface
├── MessageList
│   └── MessageBubble (AI / User)
├── TypingIndicator
└── InputArea
    ├── TextInput
    └── SendButton
```

**特性**：
- 打字机效果（AI 消息逐字显示）
- 自动滚动到底部
- 消息气泡样式区分
- 支持 Markdown 渲染
- 移动端适配

### 3.5 状态面板

**展示内容**：
- 当前天数 + 进度条
- 6 个核心数值（资金、用户、团队、士气、MRR、跑道）
- 当前阶段标签

**数值变化**：
- AI 回复中包含数值更新时，面板动画更新
- 用颜色区分增长（绿色）和下降（红色）

---

## 4. 部署方案

### 4.1 部署流程

```
本地开发
  ↓
Git push to GitHub
  ↓
Cloudflare Pages 自动构建
  ↓
自动部署到生产环境
  ↓
绑定自定义域名
```

### 4.2 环境变量

| 变量名 | 说明 | 位置 |
|--------|------|------|
| `GEMINI_API_KEY` | Gemini API Key | Cloudflare Pages 环境变量 |
| `NEXT_PUBLIC_SITE_URL` | 网站 URL | 构建时变量 |

### 4.3 域名配置

- 主域名：`goodbye.help`（canonical host）
- www 重定向到根域名：由 Cloudflare Single Redirects 在边缘做 301，**不是** Pages 侧行为
- HTTPS：Cloudflare 自动证书；SSL 模式 Full (strict)，最低 TLS 1.2，已开 HSTS
- DNS：Cloudflare 托管；CAA 已配置，DNSSEC 已在 Cloudflare 侧开启待提交 DS
- 防踩坑：`www.goodbye.help` **不得**重新绑定为 Pages 自定义域，否则 301 会静默失效

> 全部配置项、变更前后值、官方依据与回滚命令见 [`docs/cloudflare-config-review.md`](./cloudflare-config-review.md)（唯一事实来源，改配置必须同步更新该文件）。

---

## 5. 性能优化

### 5.1 前端优化

- Tailwind 按需加载（JIT 模式）
- Next.js 代码分割
- 图片优化（WebP、懒加载）
- 字体子集化

### 5.2 缓存策略

- 静态资源：CDN 缓存 1 年
- HTML：不缓存（或短缓存）
- API 响应：不缓存

### 5.3 API 优化

- Gemini API 流式响应（SSE）
- 减少 token 用量（优化 prompt）
- 简单的速率限制

---

## 6. 安全考虑

### 6.1 API Key 安全

- 只在服务端使用，不暴露给前端
- 存在 Cloudflare 环境变量里
- 不提交到 Git

### 6.2 防滥用

- 简单的 IP 速率限制
- 每次对话有 token 上限
- 免费用户次数限制

### 6.3 数据安全

- 用户对话数据不存储（MVP 阶段）
- 游戏进度存在用户本地
- 不收集个人敏感信息

---

## 7. 后续扩展

### 7.1 短期（v1.1）

- 用户账号系统
- 云端存档
- 成就系统
- 真实支付（Stripe）

### 7.2 中期（v1.5）

- 更多赛道模板
- 多人模式
- 排行榜
- 数据分析

### 7.3 长期（v2.0）

- 企业版
- API 开放
- 社区功能
- 移动端 App
