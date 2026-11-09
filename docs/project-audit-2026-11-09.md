# Goodbye Startup 项目全貌与交接核查

日期：2026-11-09（Asia/Singapore）

## 目标与范围

回答项目本地/远程/线上地址、方案与进度文档位置、产品及技术实现、完成程度与遗漏。以当前代码、Git 状态和可取得的线上证据为依据，区分历史记录、当前核实和未验证项。不变更产品行为，不提交、推送或部署，不调用付费 AI API，不记录密钥。

## 核查计划

第一性原理：完整交接必须同时说明“想做什么、现在实现什么、在哪里运行、还有什么未完成”。因此从文档意图、代码实现、版本状态、线上响应四个方面交叉核对，不能把历史完成标记直接当作当前结果。

对抗审查：文档可能过时；本地未提交内容可能不在线上；HTTP 200 不能证明模拟器、支付和限流有效；生产密钥不能从本地配置推断。结论：**存活**，采用只读核查并明确证据边界即可满足本次任务，无需安装依赖、发起 AI 调用或改动部署。

- [x] 核实当前目录、Git remote、分支和初始工作区状态。
- [x] 阅读 README、HANDOFF、AGENTS、产品/技术方案和全部进度文档；历史实施计划核对任务清单及剩余任务范围。
- [x] 对照核心用户流程、AI API、状态存储、支付及免费限制实现。
- [x] 核实远程分支与公开线上页面状态。
- [x] 汇总文档地图、项目状态、遗漏和建议顺序。

## 已确认

- 本地目录：`/Users/guan/Documents/ChatGPT/创业模拟器(Goodbye)`。
- remote：`git@github.com:liuyewang/goodbye-startup.git`。
- 初始分支：`main`；9 个已跟踪文件被修改，`HANDOFF.md` 未跟踪。
- 本次新增核查文档独立记录，不改变已有文件。

## 结论

当前项目是已经发布官网、内容页和 AI 对话接口的 MVP，但核心模拟状态联动、结束/重开/免费次数循环、用户初始条件设置尚未闭合。真实支付原本即被排除在 MVP 外；当前连定价页按钮动作也未接入。不能把网页上线、密钥可用或历史完成标记等同于完整模拟器交付。

## 地址与版本

| 项目 | 位置或结果 |
| --- | --- |
| 当前工作目录 | `/Users/guan/Documents/ChatGPT/创业模拟器(Goodbye)` |
| 旧工作目录 | `/Users/guan/Doubao/chats/2026-10-23/new-chat-2/goodbye-startup`，本次确认仍存在 |
| GitHub | https://github.com/liuyewang/goodbye-startup |
| Git remote | `git@github.com:liuyewang/goodbye-startup.git` |
| 生产主站 | https://goodbye.help |
| 模拟器 | https://goodbye.help/simulator |
| Pages 项目域名 | https://goodbye-startup.pages.dev，本次 GET 200 |
| www | `https://www.goodbye.help/pricing?ref=audit` → 301 → `https://goodbye.help/pricing?ref=audit` |
| startup | https://startup.goodbye.help → 301 → https://goodbye.help/simulator |
| 历史 www.startup | 本次请求报 `Could not resolve host: www.startup.goodbye.help`；不能沿用旧配置文档中的存在状态 |

`git ls-remote origin refs/heads/main` 本次返回 `a47c0073b1e0cb715de869278d96cae42b9f6875`，与本地 HEAD、origin/main 一致；该提交日期为 2026-11-07。

两份目录均处于这个提交，均显示相同的 9 个已跟踪文件被修改。当前目录另有尚未跟踪的 HANDOFF.md。9 个修改文件主要涉及首页布局、移动端 safe-area、输入区域、消息动画、导航和状态面板。

线上 HTML 已有本地未提交改动中的 `viewport-fit=cover`。因此不能推断“未提交就未上线”；也不能仅凭远程 main 断言可以重建当前生产版本。需另查 Pages 部署记录才能精确确认生产构建来源，本次未进入控制台读取。

## 文档地图

| 文档 | 用途 | 当前判断 |
| --- | --- | --- |
| `HANDOFF.md` | 新 AI 接手入口、技术迁移、部署坑、文案约束 | 重要但非完整验收记录；key 占位描述已过时，遗漏核心状态/计费缺口 |
| `README.md` | 简介、启动与文档导航 | 仍写 Next 14 / Gemini / `npm run deploy`，与当前配置不符 |
| `AGENTS.md` | 依赖、安全、文案、部署和工作流约束 | 约束继续有效；技术栈、环境变量、存储 key 等部分信息过时，以用户最新指示和代码事实区分 |
| `docs/BRD.md` | 商业定位、用户、定价、成功指标 | 2026-08-05 原始商业方案，目标数据不代表已达成 |
| `docs/PRD.md` | 用户流程、功能范围、验收标准 | 原始产品方案；验收项未逐项签收 |
| `docs/tech-stack.md` | 架构、数据模型、API、部署、扩展 | Gemini、Google Search、SSE、R2 等不能当成当前实现 |
| `docs/execution-plan.md` | 原始三天排期、任务拆分 | 大量未勾选项与已存在代码并存，里程碑又使用完成符号，不能当真实当前进度 |
| `docs/superpowers/plans/2026-08-05-mvp-implementation.md` | 细化实施步骤 | 前四项较细，后八项主要是提纲；不是已经执行完毕的证明 |
| `docs/agent-notes.md` | 需求确认、技术取舍与历史操作笔记 | 保留决策背景；Gemini、部署 `.next` 等命令过时 |
| `docs/progress-2026-10-23.md` | 用户自定义初始模型、无人机天气 app 模拟测试 | 仍写“设计完成，开始实现”；相关表单/类型/接口在两份目录中未找到 |
| `docs/progress-seo-geo.md` | 第一轮 SEO/GEO 优化完成记录 | 历史记录；当时 simulator noindex 已被后续工作替代 |
| `docs/seo-optimization-2026-11-06.md` | simulator 索引、内容补强、中文 SEO 取舍、guides 修复 | 解释后续决策；早期 6/7 页检查不覆盖目前所有 15 页 |
| `docs/cloudflare-config-review.md` | DNS、TLS、安全、重定向、回滚与待办 | 有用的历史操作记录，但 startup 等状态与后来的 AGENTS.md/线上结果有出入 |
| 本文 | 2026-11-09 的交接核查及当前缺口 | 本次新增，未改动上述历史材料 |

Cloudflare 配置文档还记录一个飞书副本：https://my.feishu.cn/docx/BdeNdZy7ooLanMxR1YVcSrm7nXb 。本轮未读取该在线副本，不能确认它与本地同步。

## 产品目标与实际组成

- 定位：面向美国 25–35 岁、考虑创业的上班族/开发者/学生，帮助其在投入现实资金和时间前压力测试创业想法；中文作为辅助语言。
- 体验目标：用户描述想法及初始条件，AI 在约 15 分钟真实时间内推进 180 个模拟日，经市场审视、上线、增长/流失、财务压力、最终复盘给出选择与结果。180 天是虚拟时间，约 15 分钟是既定产品文案，尚无本次实测时长数据。
- 角色：专业、冷静、直言不讳的“创业压力测试员”，用偏保守的转化率、流失和现金流假设制造决策压力。
- 原始商业计划：免费一次完整模拟；Pro $9.99/月、Lifetime $49.99；Team 为后续方向。后来 HANDOFF 和部分定价文案又出现 $0.99/次，尚未统一产品方案。
- 原始成功指标：100 个真实用户、至少 5 次付费按钮点击、20% 完成率。仓库没有这些目标已经达到的证据，也未找到相应产品漏斗埋点实现。

页面合计：**15 个 HTML 页面 + 1 个 RSS**。HANDOFF 把 RSS 算入“15 个 URL”不准确。

- 基础六页：`/`、`/simulator`、`/how-it-works`、`/pricing`、`/about`、`/privacy`。
- Guides：`/guides` + 创业想法验证、180 天模拟解释、创业成本基准三篇。
- Blog：`/blog` + 失败率、启动资金、CAC、流失率四篇。
- RSS：`/blog/feed.xml`，静态文件，包含四篇博客；不在 HTML sitemap 的 15 个条目中。

## 实际技术与运行方式

| 层 | 当前实现 |
| --- | --- |
| 前端 | Next.js App Router，lockfile 为 15.5.2；React/React DOM 19.2.8 |
| 类型/样式 | TypeScript strict、Tailwind 3.4、自定义 CSS，无新增 UI/动画/状态/i18n 库 |
| 状态 | React Context + localStorage：`gs_game_state`、`gs_simulation_count`；语言为 `gs_language` |
| AI 路由 | `POST /api/chat`，edge runtime，读取 `DEEPSEEK_API_KEY`，请求 DeepSeek `deepseek-flash` |
| AI 返回 | 非流式，`max_tokens=4096`、`temperature=0.7`，成功返回 `{ text }`；未实现文档里的 `{ data: ... }` 统一包装 |
| 语言 | 自定义 en/zh 字典；localStorage → 浏览器语言 → 英文；切换后刷新页面 |
| 部署 | Cloudflare Pages + `@cloudflare/next-on-pages`，产物 `.vercel/output/static` |
| 兼容配置 | `compatibility_date=2025-09-01` + `nodejs_compat` |
| 存储/账号 | 无用户账号、数据库、云端存档；D1/R2 是历史方案或后续方向 |
| 数据来源 | 提示词写死的基准范围 + 模型知识；没有接入 Google Search、实时检索、基准数据库 |

请求链路：浏览器输入 → `SimulatorContent` 组装完整消息历史 → `/api/chat` 添加中/英文系统提示词 → DeepSeek → `{ text }` → 追加消息 → localStorage 保存。当前这条链路中没有结构化状态解析环节。

本地 `.env.local` 已有非占位的 key 且未被 Git 跟踪。`node_modules` 尚不存在。当前脚本为 `npm run dev`、`npm run build`、`npm run pages:build`、`npm run pages:deploy`；README 写的 `npm run deploy` 不存在。根 layout 目前硬编码主站地址，没有读取文档所称 `NEXT_PUBLIC_SITE_URL`。

## 已确认的遗漏与影响

以下涉及核心行为的结论来自源代码及全项目调用点核对，未运行真实 AI 完整模拟；不将静态分析伪称为端到端测试。

| 优先级 | 缺口 | 证据/影响 |
| --- | --- | --- |
| 高 | AI 回复没有驱动状态面板 | `components/sim/SimulatorContent.tsx:97` 只读取 `data.text` 并追加消息；`updateStats/setDay/setPhase/setGameOver` 只有 Context 定义与导出，没有业务调用。AI 可在文字里叙述进展，页面的天数/阶段/数值却不随之更新 |
| 高 | 结束、重开与免费限制未连通 | `resetGame` 未被调用；次数仅在该方法内递增；没有完成结算/重开按钮链路。无法认定“第二次触发付费墙”已实现 |
| 高 | 已用免费次数状态会卡初始化 | `SimulatorContent.tsx:59` 仅在免费未用且无消息、或已有消息时设 initialized；已用次数+空消息刷新时 initialized 一直 false，既不显示付费墙又停留在 loading |
| 高 | 已提出的自定义初始模型仍缺失 | 10 月 23 日要求资金/团队/就业状态/月燃烧率由用户设定；当前无 SetupForm/GameSetup/startGame(setup)，仍硬编码现金 10000、跑道 6、用户 0、收入 0、士气 80、月燃烧 1500 |
| 高 | API 防滥用在应用代码中未实现 | 仅验证 messages 是数组，未验证每条 role/content、长度、数量和 language；无应用级速率限制、身份/次数校验、超时或历史裁剪。Cloudflare 是否另配限流未验证 |
| 中 | 支付与定价承诺不一致 | `app/pricing/page.tsx:80` 的三个按钮均无 onClick/链接，包括 Start Free；没有 checkout/webhook/权益校验。真实支付原本属 MVP 不做项，但当前也没有 Coming Soon 交互；文案却声称可退款、可账单门户取消、可导出和比较模拟 |
| 中 | 价格方案不统一 | 套餐卡为免费 / $9.99/月 / $49.99终身，另写 $0.99/次。不能自行选定其中一个作为最终商业决策 |
| 中 | 隐私说明与 AI 供应商不符 | 中英文隐私页仍写 Google Gemini，且有账号/邮件收集等模板表述；当前请求发送到 DeepSeek。线上 `/privacy` 也已确认包含旧供应商名 |
| 中 | 数据能力描述超出实现 | 文案声称每次决策更新财务模型、取真实市场基准；当前无独立计算引擎/检索或结构化状态。基准数值及案例缺少可维护的来源清单，不应把模型生成的数字描述成实时测量 |
| 中 | 文案铁律与部分 i18n 未落实 | 英文仍有 `one conversation`；多处为 15–30 分钟而非本次用户明确的约 15 分钟。Most Popular、Metric/Typical Range、错误提示及 `mo` 等存在硬编码英文 |
| 中 | 文档进度漂移 | README/AGENTS/tech-stack 仍有 Next14/Gemini；旧任务完成符号与未勾选项冲突；HANDOFF 的 key/页数/完成度叙述不完整 |
| 中 | 本地改动尚未纳入远程版本 | 9 个修改文件未提交，HANDOFF 未跟踪；线上已见其中 viewport 改动。生产、Git、两份本地目录没有一份明确的版本对照记录 |
| 低 | 代码规范与构建资料仍有欠账 | 多处 interface/命名导出/内联 style 与规则不同；React19 配 @types/react18；历史 fix-node-imports 脚本未串入 pages:build 且使用 macOS sed 写法。未做构建，不能断言这些会导致当前构建失败 |

历史明确不做的账号、云端存档、排行榜、多人模式、真实支付等属于范围取舍；应与“本来要求做、实际尚未闭合”的模拟状态、免费次数、自定义初始参数区别对待。

## 本次线上与静态验证

最初网页读取工具不可访问，默认 curl 连接超时；改用 IPv4 curl 后成功。不能据此判断网站宕机。

- 15/15 HTML 页面 HTTP 200，均有一个 H1、可解析 JSON-LD、自指 canonical、`index, follow`。
- 各页四项应用安全头齐全：nosniff、SAMEORIGIN、strict-origin-when-cross-origin、Permissions-Policy；主页亦有 HSTS。
- robots.txt 明确放行指定 AI 爬虫；sitemap XML 有 15 项；RSS XML 有四篇博客；og.png HTTP 200。
- 首页 title 55 字符、description 148 字符；全部页面 description 91–153 字符。
- **6 页 title 超过项目上限 60 字符**：想法验证指南 74、成本基准指南 65、失败率博客 72、启动资金博客 64、CAC 博客 65、流失率博客 66。
- 博客首页 title 为 `Blog | Goodbye Startup | Goodbye Startup`，重复品牌后缀。
- 子页面 og:url 全部继承首页；sitemap 所有 lastmod 仍为 2026-11-06，晚于该日的新增/修改没有同步。
- 中英文翻译对象各 498 个叶子路径，路径一致；此检查不替代 TypeScript 编译，也不证明源文件无重复定义。
- `git diff --check` 通过。未安装依赖、未启动本地、未构建、未提交、未推送、未部署、未发起付费 AI 请求、未做浏览器完整流程或支付测试。

公开请求的临时证据保存在 `/tmp/goodbye-project-audit-20261109/results.json` 及同目录响应文件；关键结论已在本文内持久记录。临时目录不作为长期唯一依据。

## 历史里程碑与仍待确认事项

- 2026-08-05：初始化仓库、商业/产品/技术方案及实施计划。
- 2026-08-06：MVP 页面、聊天、状态结构、多语言和布局修复进入 Git。
- 2026-10-23：记录初始模型由用户设定及模拟测试任务，但当前及旧目录均未发现对应实现。
- 2026-11-06：SEO/GEO、canonical、结构化数据、安全头、域名配置等工作；部分历史文档日期与 Git 提交日期存在差别。
- 2026-11-07：DeepSeek 切换、兼容日期修复、博客/指南/RSS、文案改进；远程 main 最新提交为 a47c007。
- 当前未提交：移动端与首页视觉调整；交接文档。

未验证：完整 180 天用户流程、中文 hydration/跨浏览器/手机真机体验、错误恢复、真实支付、生产构建来源、Cloudflare Git 构建配置、生产限流规则、DS/DNSSEC、DMARC 后续变化、真实获客/完成率/转化数据、飞书副本同步状态。旧报告写 DNSSEC 待提交 DS、DMARC p=none，这些不能当成本次实时结论。

`wise.goodbye.help` 是独立业务，当前 AGENTS.md 与旧配置文档对其源站描述有出入；本次没有操作该域，也未把它当作本模拟器已接入支付的证据。

## 建议推进顺序

1. 先完成现有改动的版本归档与文档纠偏，让本地/远程/线上对应关系可追溯。
2. 优先闭合核心模拟：用户初始参数 → 受校验的结构化 AI 输出 → 天数/阶段/数值更新 → 结束与复盘 → 再次开始/免费次数；同时补应用级输入验证和成本控制。
3. 用一个固定创业场景完成英文与中文的端到端验收，覆盖刷新续玩、网络/模型错误、首次完成与第二次开始，而非仅看页面 200。
4. 统一免费/单次/订阅/终身版方案和支付尚未开放的表达，再安排真实支付及权益设计；先让承诺与当前能力一致。
5. 修正文案、隐私供应商、六个超长标题、博客重复标题、lastmod 和分享 URL；继续内容扩充前补基准来源与产品数据。

公开内容已有 SSR、JSON-LD 和爬虫放行基础，适合继续做 AI 可读内容优化；当前未发现 llms.txt。本阶段无需为此扩展新云服务架构，核心流程优先。
