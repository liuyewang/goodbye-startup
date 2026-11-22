# 每日免费模拟实施计划

目标：用户已确认每匿名浏览器每天一次，设备当地零点刷新；在既有范围内连续执行并发布。
设计：../specs/2026-11-22-daily-free-simulation-design.md。
执行：本会话实施，完成后独立代码审阅。初期沿用主检出；最终在受管 daily-free-release 工作树验证，保护已存在的交接/搜索文档改动。

## Task 1：D1 计额与替换

- [x] 先用真实本地 D1 添加红测：时区日界线、首个成功跨午夜、继续旧模拟不占今天、同日失败删除不重置、次日失败草稿恢复、并发替换、旧数据兼容。
- [x] 新增 additive migration，为 sessions 增加 attempt_day、time_zone、timezone_locked_until、used_until 并回填。used_at 表示最近一次新模拟首个成功时间，used_until 固定当次资格到期，attempts 保留当前分配的尝试计数。
- [x] 新增 createRun 可选 replaceRunId，原子检查资格、指定旧 ID、已完成状态、无 pending 后替换。所有资格/计数变更都在 SQL 条件内。
- [x] reserveTurn 只允许未成功草稿在新 当地日且无 live pending 时更新失败尝试周期；已开始的模拟总尝试不重置。commitTurn 只在 expectedVersion=0 时写 used_at。
- [x] getSession.used 表示今天已用；eligibleAt 在今天资格或未成功尝试已耗尽时返回下一当地零点，否则 null。attempts 仍表示当前模拟周期。
- [x] 运行 npm test；迁移测试保留旧存档、今日/昨日资格和匿名身份。

## Task 2：入口与双语内容

- [x] 完成后点击再次开始先读服务端；可用则展示新设置并保存 replaceRunId，提交时原子替换；取消回原模拟。失败保留原存档。
- [x] 用浏览器回归验证同日阻止、新一天入口、失败恢复、跨标签页替换冲突。合成日期只用于界面 fixture；真实跨日资格由本地 D1 测试证明。
- [x] 同步 EN/ZH 首页、定价、FAQ、模拟器、隐私、公共 Markdown 与 README/PRD/架构/运行规则；不改 URL 或模型日预算。

## Task 3：验证与发布

- [x] npm run check、完整四浏览器回归、built mock REST + scheduled cleanup、15 页/5 资源/资产排除、本地移动 EN/ZH。
- [x] 独立审阅；发现问题先复现再修复，完成必要复验。
- [ ] 精确提交本次文件，保留他人改动；推送/常规集成；干净版本 production build、配置守卫、迁移、dry-run、部署、正式站读回并记录版本。

## Review Focus

午夜间的预留与成功；跨日继续的 used_at；并发删除/替换时零行 SQL；旧已用/失败配额迁移；旧浏览器已打开页面兼容；替换失败时旧记录仍可恢复。

官方依据（2026-11-22）：https://developers.cloudflare.com/d1/worker-api/d1-database/ 与 https://developers.cloudflare.com/d1/reference/migrations/。批量 SQL 保证事务，但零行结果仍需显式处理。

2026-11-22 决定：按用户最新要求采用设备本地时区；不另加夏令时功能/专项测试。时区切换延后到当前周期结束，新客户端提供 timeZone，旧客户端 UTC 兼容。69 项核心测试和首批 4 个 Chromium 新入口场景通过，补迁移及删除竞争回归。

验收更新：74 项核心与完整 check 通过，built mock/定时清理/15 页/5 资源通过，独立复审无剩余重要问题。补齐 creationRequestId / runs.creation_key 的稳定创建幂等，前端本地午夜定时和可见性刷新。完整浏览器151/152通过，既有WebKit iframe点击项在构建预览随其4场景全通过；新增24项全部通过。原始异常与复验边界见进度，发布未执行。
