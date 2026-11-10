# ChatGPT 可发现性与可引用内容执行计划

日期：2026-11-10；项目 goodbye / goodbye.help。用户已要求将上一轮方案成文并按顺序执行。

目标：让公开页面准确解释产品适用场景，并提供可复算、可核验的原创方法内容。被抓取、被引用、被推荐、真人访问和实际模拟是不同结果；不承诺排名或引用增长。

技术范围：现有 TypeScript、React、vinext、Tailwind、内容注册表及双语字典；保持全部15个公开URL。无新库、付费服务、账号、追踪标识或真实模型调用；不改结算、配额、数据库及隐私边界。

## 第一性原理与对抗审查

1. OAI-SearchBot访问权限只是进入搜索候选的条件。GPTBot训练抓取与搜索引用不同。
2. 内容必须独立回答具体问题，公开公式、输入、结果、假设及局限，才能供人和检索系统核验。
3. 先用模拟引擎验证数字，不能将AI叙述或假设案例包装为市场数据。
4. 现有llms.txt、Markdown、JSON-LD足够承载本轮内容，无需新增Agent Visibility服务。
5. 网站默认英文SSR，浏览器hydration切换中文保持现有合同；不顺便改多语言路由。

结论：**存活**，采用既有页面的小范围内容完善。批量泛化AI文章、虚构背书、保证推荐、重复抓取及新增昂贵基础设施 **应放弃**。风险：测试通过不能证明真实引用；外部评价依赖真实用户；公开链接不等于获得背书。

## 顺序、文件与验收

- [x] 1. 完善方法说明：`src/i18n/en.ts` / `zh.ts` 的 howItWorks，现有页面渲染；公开阶段时间、保留/新增客户、收入、现金、runway、初始化和提前结束规则，标注舍入、单位和局限。为计算来源加入真实仓库链接。验收：源码、可见正文及生成Markdown一致。
- [x] 2. 完善验证指南：`src/content/articles.ts`；三个Day0→Day5假设案例：需求不足、获客支出过高、现金提前耗尽。每例完整输入、结果、启示与真实验证行动。新增内容测试，先观察失败，再以真实`settleTurn`复算叙述数字。验收：中英案例与引擎一致，不新增URL，不宣称市场证明。
- [x] 3. 明确定位：既有首页/关于文案，面向准备创业者、练习假设和现金决策、一次免费模拟/约15分钟/无账户及明确限制。补充可核验的项目维护/纠错入口，不编造作者资质或联系地址。验收：EN/ZH一致、SSR/Markdown可读、无失实承诺。
- [x] 4. 准备真实站外展示：完善README产品入口、方法和验证指南；本文件附可审阅中英展示稿及反馈问题。仅准备材料；不自动发送消息、提交目录、买评价或代用户声称社区认可。外部独立评价仍需真实反馈。
- [x] 5. 建立测量基线：本文件固定中英8个无品牌问题，分别记录抓取、引用/推荐、真人来源访问与模拟使用。复用已有GSC/Cloudflare证据，明确范围/时区/UA限制。不装新追踪服务，不收集输入或IP，不触发付费模型，不自动排期。实际跨会话推荐观察保留“未测”，不以本次聊天替代独立测量。
- [x] 6. 验证与复审：完整check、适用浏览器回归、构建Worker15页审计、390px中英页面/导出内容核对、独立整体验证；修复已发现的重要问题后停止。代码/测试/集成/上线/外部效果分别记录。共享main外发或正式发布仅在既有明确授权或具体最终审阅后推进；不得覆盖开始时已有的search-evidence文档修改。

## 测量协议与基线

固定问题（保留原文，记录日期、模型、是否搜索、地区/语言、新聊天和完整来源；不在问题中提品牌）：

| 问题 | ChatGPT引用/推荐基线 |
| --- | --- |
| 有哪些免费的创业模拟工具？ | 未测 |
| 离职创业前，怎样练习现金流决策？ | 未测 |
| 如何区分创业模拟结果与真实需求验证？ | 未测 |
| 创业想法验证应该先测试什么？ | 未测 |
| What free tools let me practice startup decisions? | 未测 |
| How can I stress-test startup cash flow before quitting my job? | 未测 |
| Can a startup simulator validate real customer demand? | 未测 |
| How should I test an early startup idea? | 未测 |

已有证据：GSC注册goodbye→sc-domain:goodbye.help，28天Pacific2026-10-11–11-07，0点击/4展示；不是全站访客数。Cloudflare2026-11-09 UTC主机UA聚合含自报GPTBot42及OAI-SearchBot1，UA可伪造，不证明正文收录/引用。无可核验的推荐率、ChatGPT引流人数或模拟转化率基线，均记未知，不补零。原始数据在仓库外。

复查：技术访问检查仅在更改后做；Google/GSC数据推进后再取适用窗口。观察引用需新聊天中的非引导问题，记录实际来源链接；带品牌名测试另记为品牌可发现性。真人访问关注ChatGPT来源/referrer或可用UTM，依赖现有工具权限；缺少归因数据时不推断。系统使用统计仅采用已有匿名聚合；不新增隐私敏感日志。首次观察不作因果结论，无自动定时任务。

## 站外展示稿（待真实对外使用）

中文：Goodbye Startup 是免费的创业决策练习工具。一次模拟约15分钟，覆盖180个模拟日；AI提出假设，公开的确定性规则计算现金、收入和客户变化。它不能验证真实需求或预测创业成功。目前提供一次匿名免费模拟，无需账户。欢迎反馈哪个假设最难验证、计算说明是否清楚，以及实际使用中遇到的问题。

English: Goodbye Startup is a free educational tool for practicing startup decisions. One simulation takes about 15 minutes and covers 180 simulated days. AI proposes assumptions; documented deterministic rules calculate cash, revenue and customer changes. It does not validate real demand or predict success. One anonymous free simulation is available without an account. Feedback on unclear assumptions, calculation explanations and usability is welcome.

展示链接：主页 https://goodbye.help/ ，方法 https://goodbye.help/how-it-works ，验证指南 https://goodbye.help/guides/startup-idea-validation ，代码 https://github.com/liuyewang/goodbye-startup 。这些链接不是站外评价或背书。

## 执行台账

开始：main@b7afa4c；现有未提交修改仅`docs/search-evidence-2026-11-09.md`，为本聊天前序证据，保留。doctor重新确认本项目绑定，不重复取数。用户要求顺序执行，直接实现已接受方向，不重开设计批准；暂不发消息或虚构外部观察。

执行记录：方法、三组双语假设案例、定位与维护入口已写入既有内容源；README及本文件中英文站外稿已准备，未对外发送、未获得外部评价。测量协议与未知项已建立；跨会话推荐率和真人引流基线仍是未知，不伪造观察。新增复算测试RED因Case1缺失失败，GREEN在补内容后通过。完整检查和运行时核验待下方补充。

验证记录：完整`npm run check`通过（7个文件、42项测试；类型/lint/格式/构建/密钥检查通过）；完整`npm run test:e2e`为32/32通过（58.0秒）。构建Worker运行时全部15页及5种公开资源审计通过。390px EN/ZH四目标页无横向溢出；方法版本来源、三个案例余额、关于页纠错链接及SSR/Markdown正文核验通过。已查看中文长页截图，公式自然折行，未遮挡内容。独立审阅进行中。

官方规则参考（本聊天2026-11-10核对）：https://developers.openai.com/api/docs/bots 。本站方法来源为公开引擎固定版本；SBA引用用于一般验证思路，不作为本产品的背书。

交付边界：站外材料已准备但未向任何人发送，真实反馈仍待发生；8个问题的跨会话推荐观察尚未执行，表中如实保持未测。当前工作为本地内容与文档实现，尚未提交/推送/发布；此前发布授权针对上一轮PageSpeed三文件修复，本轮新的共享分支外发和正式内容发布应作具体最终审阅，依据CONTRIBUTING的独立发布授权要求执行。

最终复审：独立审阅Critical0/Important0/Minor2，公开公式、单位、初始化、提前结束和案例数字均正确，固定源码版本与当前引擎一致。已处理两项Minor测试覆盖建议：新增指南月收入、假设$300获客成本、方法页现金$9,766.67及6.98月runway的真实引擎复算断言；补充后7文件42测试全绿。应用源码未因此改变，无需重跑已通过的构建/32浏览器场景。

本轮本地交付已完成：步骤1–3为实际内容实现与公开导出，步骤4为可审阅README/展示材料，步骤5为协议与诚实的已有/未知基线，步骤6完成本地验收及独立复审。外部发送/独立评价/真实推荐观察没有发生，不冒充完成。正式发布尚未执行；待用户对这轮具体内容批准后再提交、推送、production构建和正式站读回。无已知Critical/Important问题；接受的外部限制为引用结果无法保证和归因数据未具备。最终结论：**存活**。

## 内容正式发布与部署授权更新（2026-11-10，已完成）

用户明确要求发布，并将本项目常规网站部署改为持续授权、无需逐次确认。本节取代上文“等待这轮发布批准”的当前状态（保留其为历史记录）。依agent-workflow-maintenance流程备份并同步AGENTS/CONTRIBUTING/deployment；仅影响本项目，不更改宿主安全权限或付费边界。检查已通过的相同应用代码无需机械重复完整测试；补充production构建、配置/密钥/dry-run、精确候选版本和正式站读回。站外发送与真实引用观察仍未发生，不冒充结果。

发布结果：规则更新提交`eebd3ad`，内容提交`35d8443a2b1e44ad2f5e4ff00beba36548f08d14`均正常推送main；上传时工作区干净、HEAD与origin/main一致。production构建、配置守卫、密钥扫描、dry-run通过。候选`256c4468-a1c5-4cd6-b35d-509ec0095e8d`先以0%定向验收，再于2026-11-10T13:39:27.893Z（新加坡21:39）切至100%。

候选及无覆盖头普通正式流量分别通过全部15页/5公开资源/API健康与Cookie/Origin/输入检查；390pxEN/ZH四目标页、三个案例余额、公式源码与纠错链接、SSR及Markdown均实际读回通过。GitHub Actions仍关闭。未调用真实模型，未改域名、数据库、额度或付费服务。恢复基线为上一验证版本8a93b08a。代码/提交/推送/上线均已完成；新内容是否带来实际推荐、引用及真人访问仍待观察，不宣称提升。

规则维护验收：备份原有3份规则文件到仓库外，静态核对AGENTS/CONTRIBUTING/deployment不再要求常规发布逐次批准；本会话按用户新授权完成发布。没有修改宿主工具权限或全局规则文件，不声称其他已运行聊天自动刷新。接续任务应读取当前AGENTS；本项目常规部署无需再次征得批准。此前本文件中的“等待发布批准”只描述旧状态，不再生效。最终结论 **存活**，达到本轮公开交付验收后停止。
