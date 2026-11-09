> Historical snapshot, superseded by the root README and current docs. Do not use these commands for the refactored branch.

# AI Agent 开发笔记

**项目名称**：Goodbye Startup  
**开发者**：AI Agent (MainAgent)  
**日期**：2026-08-05

---

## 1. 项目背景

### 1.1 需求来源

用户想要做一个"创业模拟器"网站，使用 Cloudflare 全家桶部署。经过 grilling 流程，确认了所有产品细节。

### 1.2 用户画像

- 身份：一人公司创业者，海外方向
- 技术背景：Android 开发 / 产品经理出身
- 偏好：系统化、文档齐全、可落地、低成本
- 目标：快速 MVP，验证需求

---

## 2. 需求确认过程（Grilling 记录）

### 第 1 问：产品核心定义
- **结论**：对话式导师 + 游戏化元素
- **理由**：纯对话太像 ChatGPT 套壳，纯游戏开发量大，混合模式最优

### 第 2 问：目标用户画像
- **结论**：美国 25-35 岁想创业的白领/程序员/学生
- **理由**：付费习惯好、英语好、AI 产品接受度高

### 第 3 问：核心玩法 & 用户旅程
- **结论**：创建角色 → 对话互动 → 状态面板 → 游戏化反馈
- **MVP 砍掉**：多周目存档、复杂财务模型、多人联机、成就系统

### 第 4 问：商业模式 & 付费墙
- **结论**：Freemium，免费 1 次，Pro $9.99/月或 $49.99 买断
- **调整**：从"免费 5 天"改为"免费 1 次完整模拟"
- **理由**：模拟时间是虚拟的，用户 10-30 分钟就能玩完一次

### 第 5 问：技术架构
- **结论**：Next.js + Cloudflare Pages + Workers + D1
- **理由**：全在 Cloudflare，成本低、运维少、全球速度快

### 第 6 问：MVP 范围边界
- **结论**：只做核心循环，其他全砍
- **新增**：多语言（中英双语）、假支付页面（用于申请 PayPal）

### 第 7 问：域名 & 品牌名
- **结论**：Goodbye Startup，域名 goodbye.help
- **理由**：和域名匹配，有记忆点，有情绪价值

### 第 8 问：AI 导师角色设定
- **结论**：用户提供了详细的中文提示词（创业压力测试员）
- **风格**：数据驱动、高度现实主义、直言不讳、悲观数据基准

### 第 9 问：语言策略
- **结论**：英文为主，中文可选，Gemini 开启 Google Search
- **理由**：主要市场是美国，中文作为 bonus

### 第 10 问：免费版限制 & 数据存储
- **结论**：免费 1 次，第 2 次触发付费墙；数据存 localStorage
- **理由**：MVP 阶段最快，先验证产品价值

### 第 11 问：成功标准 & 时间预期
- **结论**：技术跑通 + 流程完整 + 有真实用户验证；2-3 天完成

---

## 3. 技术决策记录

### 3.1 为什么选 Next.js 而不是纯静态 HTML

- 全栈能力：API Routes 可以做后端代理
- 组件化：开发效率高
- 生态成熟：Tailwind、i18n 等都有现成方案
- Cloudflare Pages 原生支持

### 3.2 为什么不用第三方 i18n 库

- MVP 阶段翻译内容不多
- 自己实现更轻量，不增加依赖
- 逻辑简单，就是 key-value 映射

### 3.3 为什么 MVP 用 localStorage 而不是 D1

- 开发速度快，不用设计数据库
- 免费用户不需要跨设备同步
- 真要做账号系统时再加 D1 也不迟
- 减少复杂度，先验证核心价值

### 3.4 为什么选 Gemini 3.5 Flash

- 速度快：适合对话场景
- 便宜：Flash 模型价格很低
- 支持 Google Search：可以查真实数据
- 用户有付费版：不用担心额度

---

## 4. 开发中的注意事项

### 4.1 AI 提示词处理

- 用户提供的是中文提示词，需要翻译成英文
- 翻译时要保留"毒舌现实主义"的语气
- 提示词里的"事实校验"功能需要开启 Gemini 的 Google Search
- 注意 token 用量，提示词不要太长

### 4.2 数值系统设计

- AI 回复中需要包含数值更新
- 需要从 AI 的回复中解析出数值变化
- 方案：让 AI 用特定格式输出数值，前端解析
- 或者：让 AI 返回 JSON，前端渲染

### 4.3 付费墙时机

- 用户完成第 1 次完整模拟后
- 点击"再来一次"时触发
- 不是强制阻断，而是引导式的
- 文案要强调"无限玩"的价值

### 4.4 假支付页面

- 要做得足够逼真，用于申请 PayPal 收款账号
- 包含多种支付方式图标
- 点击支付按钮显示 "Coming Soon"
- 价格、套餐描述要像真的 SaaS

---

## 5. 已知问题与风险

### 5.1 Gemini API 稳定性

- 风险：API 可能有波动
- 应对：做好错误处理，友好的错误提示

### 5.2 国内访问速度

- 风险：Cloudflare 国内访问可能较慢
- 应对：MVP 阶段主要做美国市场，国内后续优化

### 5.3 AI 回复质量

- 风险：AI 可能不按设定的格式回复
- 应对：prompt 里明确要求格式，前端做容错

### 5.4 时间紧张

- 风险：2-3 天可能做不完所有功能
- 应对：优先保证核心流程，非核心可以砍

---

## 6. 后续优化方向

### 6.1 短期优化
- 更好的打字机效果
- 更多动画和交互
- SEO 优化
- 性能优化

### 6.2 功能迭代
- 用户账号系统
- 云端存档
- 成就系统
- 真实支付
- 更多赛道模板

### 6.3 运营相关
- Product Hunt 发布
- Reddit 推广
- Twitter 推广
- 用户反馈收集

---

## 7. 命令速查

### 本地开发
```bash
npm run dev
```

### 构建
```bash
npm run build
```

### 部署到 Cloudflare Pages
```bash
npx wrangler pages deploy .next
```

### 查看部署列表
```bash
npx wrangler pages deployment list
```

### 查看环境变量
```bash
npx wrangler pages secret list
```

### 设置环境变量
```bash
npx wrangler pages secret put GEMINI_API_KEY
```

---

## 8. 参考资料

- [Next.js 文档](https://nextjs.org/docs)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Gemini API 文档](https://ai.google.dev/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
