# Goodbye Startup 技术诊断 · 2026-11-22

**优先处理 Worker 回退兼容性。** 每日免费规则发布记录已说明旧版会恢复旧规则。本次用同一个迁移后的本地 D1 复现了两个额外问题：旧 Worker 拒绝新版浏览器的建档请求，且旧 Worker 写入的首次成功可在切回新版后被判成当天未使用。先把 `c479fd9b-be10-4dea-ba16-d258096b9d66` 设为带写流量的最低兼容版本，再按顺序处理请求恢复、模型评测和运行观测。

审查基线为 `main@8879751`。该提交和发布源码 `56e479c` 之间仅有规则及文档差异。范围为证据和技术方案。应用、Git 集成和生产变更交接给后续实施。使用 `git archive` 隔离本地运行和测试，无需切换 Git 工作树。最近一次发布的详细证据见 [项目检查点](refactor-progress-2026-11-09.md#2026-11-22每日免费模拟已上线)。

## 用户流程与权威边界

用户填写想法、起始现金、月成本、团队规模和投入程度。浏览器以签名 HttpOnly Cookie 对应匿名额度，建档后提交首个决定。Worker 在 D1 原子预留尝试，再请求 DeepSeek。结构校验通过后，领域代码按 Day 0、5、90、120、150、180 结算，现金归零时提前结束。Day 0 只初始化。状态凭原租约和预期版本提交，重放只确认数值结果和已有本地决定，模型原文依赖浏览器保存。用户可继续、导出或删除存档。首个成功占用服务端计算的设备当地日资格，已开始的每次模拟最多尝试 10 次，全站每 UTC 日最多预留 300 次，预览额度为 0。[产品契约](PRD.md) · [模拟服务](../src/server/simulation/service.ts#L5) · [D1 预留和提交](../src/server/storage/repository.ts#L340)

想法、决定、有限历史和数值状态会随推理发送至 DeepSeek。D1 的受控字段为匿名标识、数值、时区、操作及额度元数据。输入上限为 32 KiB，想法和决定各 2000 字符，历史最多 12 条及 12000 字符，供应商响应上限 128 KiB。服务端精确校验写请求来源，使用 HMAC 衍生键做短时边缘限流，严格全局预算由 D1 负责。常规数值存档 30 天到期，额度元数据按约定最多 180 天，定时与机会性清理共同执行。外部游戏在用户主动加载后使用隔离 iframe，第三方政策单独适用。[输入校验](../src/server/http/validation.ts) · [HTTP 与日志边界](../src/server/http/api.ts#L45) · [隐私文案](../src/i18n/en.ts#L458) · [Cloudflare 限流精度](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/#accuracy)

## 实施顺序

### 1. P1 · 设置可写回退的兼容下限

- **证据。** 以 `6a52a6d`（回退版本 `c8a56472` 的源码）和 `8879751` 的真实处理器共用已应用 `0002_daily_free.sql` 的本地 D1。正常新版建档体携带 `timeZone: Asia/Singapore`，旧处理器返回 `400/INVALID_INPUT`，新版返回 `200`。另用新版创建带时区的 Day 0 草稿，由旧仓库预留并以 mock 结算。旧版显示 `used=true`，D1 得到 `used_at` 有值、`used_until=0`。当日切回新版，存档仍是版本 1、全站预留计数仍为 1，`session.used` 却变成 `false`。这是发布事故期间可能触发的兼容风险，未观察生产回退。[新版建档参数](../src/features/simulator/Simulator.tsx#L395) · [旧处理器](https://github.com/liuyewang/goodbye-startup/blob/6a52a6d/src/server/http/api.ts#L123) · [新版资格读取](../src/server/storage/repository.ts#L155) · [迁移](../migrations/0002_daily_free.sql)
- **最小改动。** 发布负责人先在恢复手册指定 `c479fd9b` 为后续带写流量的兼容下限，登记候选源码、资产、API 字段、schema 和计额语义。需要在 `c479fd9b` 自身故障时降级，就先在隔离环境证明兼容候选可以检查存档和关闭写入，再把它纳入演练。当前历史 `c8a56472` 应标记为紧急参考版本，并把停写、版本恢复和核账条件写入手册。未来先部署兼容读写，再启用新字段或语义。D1 Time Travel 单列为数据灾难恢复。项目 Free 档官方窗口为 7 天，原地恢复会取消在途查询，可能恢复已删除的数值或丢失后续状态，须由发布负责人和数据恢复负责人核对删除、在途操作、额度及恢复窗口。[发布手册](deployment.md#rollback-and-recovery) · [Worker 回滚](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/) · [D1 Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/)
- **验收。** 在同一隔离 D1 跑新版建档 → 兼容候选继续及首次成功 → 回到新版，分别断言旧/新页面的建档或清晰只读降级、同日资格、跨日继续、替换幂等、预留次数和删除语义。加、撤 Worker 版本均使用同一数据库状态核对。验收记录区分代码切换与数据库恢复，并记录候选静态资产可达性。

### 2. P1 · 给浏览器请求加截止时间，复用原提交身份

- **证据。** 上游请求有 45 秒 deadline，D1 租约为 60 秒。浏览器 `api()` 等待 `fetch` 和 `response.json()` 时均缺少超时信号。假时钟分别推进 90 秒，延迟响应头和挂起的响应体都维持未结算状态。`Simulator` 只在 Promise 结束后解除 `busy` 或 `loading`，因此网络黑洞会延迟重试、导出和继续操作。[浏览器 API](../src/features/simulator/api.ts#L46) · [待确认操作](../src/features/simulator/Simulator.tsx#L287) · [上游时限](../src/server/ai/provider.ts#L86)
- **最小改动。** 由客户端 API 持有可清理的 abort deadline，覆盖响应头与响应体。读取会话可采用较短截止时间，turn 的截止时间应给 45 秒上游及服务端预留、结算留余量，并用模拟测试校准。前端超时走既有“结果未知”恢复，保留原决定及 `requestId`。后续由用户显式重放，先允许等待租约或确认已完成。首建替换沿用创建 ID，删除后可重查归属状态。已有数值和可导出的本地文本应可用。客户端超时本身不代表供应商停止处理或不计费。[DOM AbortSignal](https://dom.spec.whatwg.org/#dom-abortsignal-timeout)
- **验收。** 工程负责人用 fake timer 和现有浏览器拦截分别测试无响应头、截断响应体、服务端先提交而浏览器超时、期限内 `REQUEST_PENDING` 与租约过期。界面在限定时间回到可操作态，原 ID 重放只结算一次，不额外占用同一操作的尝试，双语状态可通过键盘和读屏感知。重复用例覆盖初次加载、正常慢响应、跨标签恢复、创建替换和删除确认。

### 3. P2 · 给模型建立可重评的语义基线

- **证据。** 本地合成供应商响应将英文“Live research guarantees your success next week.” 串入合格 JSON，中文请求仍通过 `ProposalSchema`。该反例定位结构校验的覆盖范围，线上坏答复频率未验证。历史 11 月 9 日预览 20 次尝试已用尽，包含一次 v1 超限拒绝、15 条受控 v2 合规答复，以及 4 条远端成功操作，部分远端答复只有操作证据。15 条受控合规答复延时 3.37–8.77 秒，中位 5.13 秒。独立的生产验收使用 6 次，完成一次中英混合的六阶段模拟。官方当前将 `deepseek-flash` 路由到 V4.1-Flash-1017，默认开启 high thinking，项目没有显式覆写。历史报告可证明当时的样本，当前账号可用性和现时输出质量需另行测量。[模型提示](../src/server/ai/prompt.ts) · [预览评测](preview-validation-2026-11-09.md#real-model-accounting-and-findings) · [生产评测](production-release-2026-11-09.md) · [官方模型及版本](https://api-docs.deepseek.com/quick_start/pricing/) · [思考模式](https://api-docs.deepseek.com/guides/thinking_mode/)
- **最小改动。** 复用 `docs/ai-evaluation.md`，固定少量合成场景和人工评审表。覆盖中英、Day 0 与后续阶段、低/高成本、长上下文、矛盾要求、宣称研究、空白 JSON、截断和历史重放。接口验收验证边界、失败、状态和原 ID，语义评审验证语言、业务连贯性、假设合理、措辞不确定、行动可测试及无虚假研究。用已有受控合成样本或手写无用户数据的好坏例校准评审。保存配置别名、prompt/rule 版本、思考配置及可用的供应商 fingerprint；缺失记未知。先保留现有 prompt 和模型参数，后续只有在明确批准新预算后再比较候选。
- **验收。** 评测负责人用同一评分模板让另一审阅者复评，中英误答、虚假研究和数值承诺命中预设失败项，结构拒绝样例不得推进状态。真实推理如获授权，预先登记固定样本、总尝试数、停止条件和账本，再以同批配对证据决定是否调整模型或提示。两笔现有评测余额均为零。[评测入口](ai-evaluation.md) · [DeepSeek 响应契约](https://api-docs.deepseek.com/api/create-chat-completion/)

### 4. P2 · 补足推理失败与成本的观测证据

- **证据。** 注入 401、429、503 均得到 `AI_UNAVAILABLE`，缺失 `usage` 记成零。D1 成功结算才记录当前配置别名和输入/输出 token，失败记录没有可能已计费的 usage。应用日志目前主要记录通用 `SERVICE_UNAVAILABLE`。原子 300 次预留是数量上限，估算支出还受输入、输出、缓存和峰谷单价影响。按当前峰价和 4096 输出 cap 计算，300 次都用满时输出分量约 USD 1.47/日，输入及实际账单未计入。`health.ready=true` 只检查绑定和配置存在。[供应商处理](../src/server/ai/provider.ts#L130) · [成功及失败记录](../src/server/storage/repository.ts#L529) · [应用日志](../src/server/http/api.ts#L156) · [DeepSeek 计价](https://api-docs.deepseek.com/quick_start/pricing/)
- **最小改动。** 先沿用现有 Workers Logs 和 D1 总量，增加一次预留的有限结果事件。记录固定类别、耗时、配置别名、prompt 版本和已知 token。区分超时、供应商返回的限流或认证、非合法 JSON、结算冲突和成功。未知用量省略，保持公共错误与预算契约。事件用允许列表构造，排除文本、原始上游报文、Cookie、IP 和持久标识。把模型别名校验纳入生产构建守卫。先确认现有日志权限、保留期和 Free 档容量，再用真实分布或供应商汇总账单判断是否需要进一步调整。
- **验收。** 注入响应使各类事件可用查询区分，同一重放不另计供应商调用，失败和未知用量显示准确，自动扫描确认诊断日志没有夹带 fixture 私有文本。工程和发布负责人用已有权限核对每日预留总数、成功、失败、超时以及延时分布，账单由已有权限持有人按供应商汇总核对。账户权限和生产日志字段实际覆盖待验证。[Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/) · [构建守卫](../scripts/check-deploy-config.mjs)

## 其他审查结论

- **架构与依赖。** 浏览器、薄 REST、纯领域结算、供应商适配和 D1 的分层与问题规模相符。Node 26.5.0、锁定的 vinext 1.4.4、Cloudflare Vite 插件 1.67.0 和 Wrangler 4.158.0 在本地通过构建及运行。当前 npm audit 报 0 已知漏洞。Cloudflare 仍把 vinext 标为 beta，Vite 插件 v2 beta 改用 `cf` 部署并改变产物路径。保留固定兼容日期 `2025-09-01`、`nodejs_compat` 和已验收部署链。继续观察编译器现有 sourcemap 和路由分类告警。GitHub 仅存储代码，本地 Wrangler 流程继续以构建、运行、配置守卫、发布读回为检查点。[项目依赖](../package.json) · [Cloudflare Next.js 指南](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/) · [Vite 插件 v2 beta](https://developers.cloudflare.com/workers/vite-plugin/v2-beta/) · [兼容标志](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag)
- **性能与可访问性。** 复用 11 月 22 日发布验收的中英 320px、四浏览器和外部游戏按需加载证据。该轮开发态 151/152，首轮 WebKit iframe 用例在构建预览复跑所在测试文件 4/4 通过。移动布局已有状态区、键盘和恢复场景。当前最直接的性能改进是为坏网和长等待提供可恢复入口。真实用户 LCP、CLS、延迟分位数和退出率仍待观察。D1 清理继续用已有低量测量作参考，待峰值读写及清理开销出现后再考虑查询改写。[最近发布证据](refactor-progress-2026-11-09.md#2026-11-22每日免费模拟已上线) · [D1 限制](https://developers.cloudflare.com/d1/platform/limits/)
- **公开内容的 AI 可读性。** 现有 registry 统一维护 15 个公开 URL 及 Markdown，已提供 `llms.txt`、sitemap、robots、RSS 和页面结构化数据。Cloudflare AI Agent Visibility 模板会增加 Workers AI 富化、KV 和内容刷新路径。现有静态发布适合内容量和维护规模。只有出现具体机器人抓取或引用缺口时，才从同一 registry 补所需公开字段，先验证人和工具都能看到相同事实。正式站当前 AI 引用、抓取和引流效果未验证。[内容 registry](../src/content/registry.ts) · [线上 llms.txt](https://goodbye.help/llms.txt) · [Cloudflare 官方模板](https://raw.githubusercontent.com/cloudflare/templates/main/agent-visibility-template/README.md)

## 复审与证据状态

核心不变量是同一模拟操作最多结算一次、有限预算持续生效、旧页面和已写入数据在恢复时继续满足契约。**存活。** 三个促使方案调整的条件如下。

1. 如果兼容候选跨版本写入后仍出现资格漂移，降为只读恢复，在隔离 D1 验证修复前停写并核账。
2. 如果浏览器期限内仍有正常慢请求被频繁截断，按真实时延与本地长请求证据调期限，继续使用同一个请求 ID 恢复。
3. 如果成功 token、预留量和供应商汇总无法对齐，维护未知项并使用已获授权的供应商汇总作计费来源。语义改动保持在有限评测门槛后。

**本轮本地验证。** 隔离快照执行 `npm ci --offline`，按 README 初始化 mock。快照缺少 `.git`，首次校验到密钥扫描时报错，随后让扫描使用原项目跟踪清单，完整重跑 `npm run check` 退出 0，覆盖类型、lint、格式、74/74 核心测试、普通构建及密钥扫描。显式 production 构建和配置守卫通过，`npm audit` 报 0。Wrangler 构建预览运行于本机独占的 `127.0.0.1:4317`，验证了真实本地 D1 两次迁移、六阶段、重放、删除、额度、计划清理、15 页面和 5 个资源及资产排除，随后停止预览。四个额外反例用本地 workerd/D1、API fetch stub 和假时钟记录，断言现状以定位问题。全套浏览器证据沿用同一应用代码的发布记录。

**本轮正式环境读回。** Wrangler 部署列表按时间排序后，确认 `c479fd9b-be10-4dea-ba16-d258096b9d66` 自 2026-11-22 13:01:38 Singapore 承载 100% 流量。从正式域名读取 `/`、`/simulator`、`/api/health`、`/privacy`、`/robots.txt`、`/llms.txt`、`/content/simulator.md`，均为 HTTP 200，模拟页引用发布记录中的 `C7bw56yV.js`，健康端点返回 `ready=true`。迁移检查初用 Wrangler `migrations list`，后确认固定版本内部先对已有迁移表运行 `CREATE TABLE IF NOT EXISTS`。原表已由本次之前的发布创建，这次无待应用迁移，另外用 `SELECT` 读回迁移记录。正式端避开会触发 D1 清理和更新时区的 `/api/session`。本轮真实模型尝试 0 次，生产发布或回滚 0 次。

**待观察。** 正式用户的实际完成率、掉线恢复率、峰值延迟、应用失败分布、缓存命中、供应商账单和当期语义质量。午夜跨日证据来自此前的本地受控时钟验收，跨版本问题在本轮本地复现。生产 Time Travel 沿用已登记的发布证据，实际恢复效果未验证。
