# Goodbye Startup

> Say goodbye to your 9-5. Start your startup journey.

一个数据驱动的创业模拟器，用 AI 帮你压力测试你的创业想法。

## 产品简介

Goodbye Startup 是一个基于 AI 的创业模拟器。用户输入创业想法，AI 导师（创业压力测试员）会用 180 天的模拟时间，基于真实、悲观的市场数据，带你走完从想法到上线到失败（或成功）的全过程。

**核心特色：**
- 🎯 **数据驱动**：基于真实行业数据，不灌鸡汤
- 🎮 **游戏化体验**：像玩游戏一样体验创业全过程
- 🧠 **AI 导师**：专业、冷静、直言不讳的创业压力测试员
- 🌍 **中英双语**：支持中英文切换

## 技术栈

- **前端**：Next.js 14 + TypeScript + Tailwind CSS
- **后端**：Cloudflare Pages Functions（Workers）
- **数据库**：Cloudflare D1（MVP 阶段用 localStorage）
- **AI**：Google Gemini 3.5 Flash + Google Search
- **部署**：Cloudflare Pages
- **域名**：goodbye.help

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 构建
npm run build

# 部署到 Cloudflare Pages
npm run deploy
```

## 环境变量

创建 `.env.local` 文件：

```
GEMINI_API_KEY=your_gemini_api_key
```

## 文档

- [BRD（商业需求文档）](./docs/BRD.md)
- [PRD（产品需求文档）](./docs/PRD.md)
- [技术方案](./docs/tech-stack.md)
- [执行计划](./docs/execution-plan.md)
- [Agent 开发笔记](./docs/agent-notes.md)

## 项目结构

```
goodbye-startup/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页（Landing）
│   ├── sim/page.tsx       # 模拟器页面
│   ├── how-it-works/      # 产品说明
│   ├── pricing/           # 定价页
│   ├── about/             # 关于我们
│   ├── privacy/           # 隐私政策
│   └── api/chat/          # Gemini API 代理
├── components/             # 组件
├── lib/                    # 工具库
│   ├── i18n/              # 多语言
│   └── prompts/           # AI 提示词
├── docs/                   # 项目文档
└── public/                 # 静态资源
```

## License

MIT
