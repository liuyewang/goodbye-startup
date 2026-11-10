export type Localized = { en: string; zh: string };
export type Article = {
  path: string;
  kind: "blog" | "guide";
  title: Localized;
  intro: Localized;
  sections: { title: Localized; body: Localized }[];
  sources: { title: string; url: string }[];
  published: string;
  updated: string;
};
const t = (en: string, zh: string): Localized => ({ en, zh });
const sba = {
  title: "SBA: Plan your business",
  url: "https://www.sba.gov/counseling/plan-your-business/",
};
const churn = {
  title: "Stripe: How to calculate churn rates",
  url: "https://stripe.com/resources/more/how-to-calculate-churn-rates",
};
const cac = {
  title: "Stripe: CAC in SaaS",
  url: "https://stripe.com/resources/more/cac-in-saas",
};
const dates = { published: "2026-11-06", updated: "2026-11-09" };
export const articles: Article[] = [
  {
    path: "/blog/why-90-percent-of-startups-fail",
    kind: "blog",
    ...dates,
    title: t(
      "Why startups fail: test the assumptions",
      "创业为何失败：先检验假设",
    ),
    intro: t(
      "The often-repeated “90%” headline is not a universal three-year failure rate. Definitions of startups, closure and failure differ. This article focuses on questions you can investigate instead of treating a headline as your personal odds.",
      "常见的“90%”不是通用的三年失败率。创业企业、停业与失败的定义并不相同。本文关注可以调查的问题，不把一个标题数字当成你的成功概率。",
    ),
    sections: [
      {
        title: t("Demand before features", "先找需求，再谈功能"),
        body: t(
          "Name a specific customer and a problem they already spend time or money solving. Interview them about recent behavior. Compliments and survey intentions do not establish willingness to pay.",
          "明确具体客户，以及他们已经花时间或金钱解决的问题。访谈近期行为；赞美与问卷意愿不等于付费证据。",
        ),
      },
      {
        title: t("Cash and distribution", "现金与分发"),
        body: t(
          "List fixed costs and one-time costs separately. Estimate how you will reach paying customers and what that process consumes. A working prototype does not resolve either distribution or runway.",
          "分别列出固定支出和一次性成本。估算如何接触付费客户、过程消耗什么。原型能运行，并不代表分发与资金期限已解决。",
        ),
      },
      {
        title: t("Team and competition", "团队与竞争"),
        body: t(
          "Identify missing skills and alternatives customers use today. Test a narrow advantage rather than assuming more features will win. The model can suggest experiments; it cannot observe your actual team or competitors.",
          "识别缺少的能力与客户今天使用的替代方案。验证一个具体优势，不假定功能更多就会赢。模型可以建议实验，无法观察真实团队和竞争对手。",
        ),
      },
      {
        title: t("Read statistics with their scope", "按统计口径理解数字"),
        body: t(
          "BLS publishes establishment survival data by cohort and age. Those establishments are not identical to venture-backed startups. Check the population, observation period and definition before quoting a failure percentage.",
          "BLS 按群组和年限发布经营机构的存活数据。这类机构不等同于获得风投的初创企业。引用失败率前，应检查样本、观察期间和定义。",
        ),
      },
    ],
    sources: [
      {
        title: "BLS: Entrepreneurship and the U.S. economy",
        url: "https://www.bls.gov/bdm/entrepreneurship/entrepreneurship.htm",
      },
      sba,
    ],
  },
  {
    path: "/blog/how-much-money-do-you-need-to-start-a-startup",
    kind: "blog",
    ...dates,
    title: t("How much money does a startup need?", "创业需要多少资金？"),
    intro: t(
      "There is no universal startup budget. This is a planning exercise: replace every example with quotations, expenses and demand evidence for your situation.",
      "不存在适用于所有项目的启动预算。这是一项规划练习，请用自身报价、支出与需求证据替换示例。",
    ),
    sections: [
      {
        title: t("Separate setup and recurring costs", "区分启动与持续成本"),
        body: t(
          "List equipment, setup, design and launch work separately from hosting, tools, staff, marketing and living expenses. Do not count the same cost twice. Decide explicitly whether founder pay is included.",
          "把设备、设置、设计和上线工作，与托管、工具、人员、营销和生活费用分开。避免重复计费，并明确是否包含创始人工资。",
        ),
      },
      {
        title: t("Calculate net burn", "计算净消耗"),
        body: t(
          "Illustrative arithmetic: with $30,000 cash, $3,000 monthly costs and $1,000 monthly revenue, net burn is $2,000 and simple runway is 15 months. With no net burn, that formula does not produce a finite runway.",
          "算术示例：现金 30,000 美元、月成本 3,000 美元、月收入 1,000 美元，净消耗为 2,000 美元，简单资金期限为 15 个月。没有净消耗时，该公式不会得出有限期限。",
        ),
      },
      {
        title: t("Test the uncertain inputs", "检验不确定输入"),
        body: t(
          "Vary revenue, costs and launch timing. A buffer is a choice tied to your obligations, not a universal 18-month or 50% rule. The simulator omits taxes, receivables and financing, so it is not a complete budget.",
          "改变收入、成本和启动时间，观察结果。缓冲取决于实际义务，不存在通用的 18 个月或 50% 规则。模拟省略税费、应收款与融资，因此不是完整预算。",
        ),
      },
      {
        title: t("Turn estimates into evidence", "用证据替换估计"),
        body: t(
          "Request supplier quotes and test demand before increasing commitments. The SBA planning guide distinguishes one-time and monthly expenses; use that checklist to find missing categories.",
          "增加投入前先获取供应商报价并测试需求。SBA 规划指南区分一次性与每月支出，可用其清单检查遗漏类别。",
        ),
      },
    ],
    sources: [sba],
  },
  {
    path: "/blog/customer-acquisition-cost-benchmarks",
    kind: "blog",
    ...dates,
    title: t(
      "Customer acquisition cost: formulas and examples",
      "获客成本：公式与示例",
    ),
    intro: t(
      "Channel costs vary with audience, market, offer and measurement window. The examples here are hypothetical arithmetic, not verified 2026 market benchmarks.",
      "渠道成本会随受众、市场、报价和统计期间变化。本文是虚构算术示例，不是经过验证的 2026 年市场基准。",
    ),
    sections: [
      {
        title: t(
          "Use paying customers as the denominator",
          "明确分母是付费客户",
        ),
        body: t(
          "CAC = acquisition sales and marketing cost / new paying customers in the same period. If you spend $1,000 and acquire 20 paying customers, CAC is $50. Include relevant labor and tools, and distinguish paid-channel CAC from blended CAC.",
          "CAC = 同期获客销售及营销成本 / 新增付费客户。支出 1,000 美元、获得 20 位付费客户时，CAC 为 50 美元。应包含相关人工与工具，并区分付费渠道 CAC 和综合 CAC。",
        ),
      },
      {
        title: t("A conversion funnel compounds", "转化漏斗逐层相乘"),
        body: t(
          "At $5 per click, 1% visitor-to-signup conversion and 2% signup-to-paid conversion, paid conversion is 0.02%. Expected media CAC is $5 / 0.0002 = $25,000, before other costs. Dividing ad spend by a percentage alone is not CAC.",
          "每次点击 5 美元，访问到注册转化 1%，注册到付费转化 2%，总付费转化为 0.02%。预期媒体 CAC 为 5 / 0.0002 = 25,000 美元，尚未包含其他成本。广告总支出直接除以百分比不是 CAC。",
        ),
      },
      {
        title: t(
          "Compare with contribution, not only revenue",
          "与贡献利润比较，不只看收入",
        ),
        body: t(
          "A $10 monthly price over six months is $60 of revenue, not necessarily $60 of profit. Service costs, churn, refunds and collection timing matter. A 3:1 LTV:CAC heuristic is not a universal profitability guarantee.",
          "月价 10 美元持续六个月得到 60 美元收入，不一定有 60 美元利润。服务成本、流失、退款和回款时间都影响结果。3:1 的 LTV:CAC 经验值不保证盈利。",
        ),
      },
      {
        title: t("Measure a small test first", "先测量小规模实验"),
        body: t(
          "Track impressions, visits, signups, paying customers and spend separately. Change one assumption at a time. This simulator exposes visits and conversions; it does not claim to measure live channel CAC.",
          "分别记录曝光、访问、注册、付费客户与支出。一次改变一个假设。本模拟器展示访问与转化参数，不声称测量实时渠道 CAC。",
        ),
      },
    ],
    sources: [cac],
  },
  {
    path: "/blog/churn-rate-how-to-reduce",
    kind: "blog",
    ...dates,
    title: t(
      "Churn: measure retention and test improvements",
      "流失率：衡量留存并检验改进",
    ),
    intro: t(
      "Define your cohort and time window before comparing retention. Customer churn and revenue churn answer different questions. No single monthly percentage is good for every business.",
      "比较留存前先定义群组和期间。客户流失与收入流失回答不同问题，不存在对所有业务都适用的优秀月流失率。",
    ),
    sections: [
      {
        title: t("Start with a clear denominator", "明确分母"),
        body: t(
          "A simple customer churn rate is customers lost during a period divided by customers at its start. With 100 starting customers and five losses, it is 5%. Keep new customers and reactivations consistent with your chosen definition.",
          "简单客户流失率是期间流失客户除以期初客户。期初 100 位、流失 5 位时为 5%。新客户与重新激活用户的处理应与所用定义一致。",
        ),
      },
      {
        title: t("Retention compounds", "留存是复利过程"),
        body: t(
          "With 10% monthly churn and no acquisition, 100 customers become about 35 after ten months: 100 × 0.9^10. The entire cohort does not necessarily disappear after ten months. The simulator uses this compounding model with integer rounding.",
          "月流失率 10%、没有新增客户时，100 位客户十个月后约剩 35 位：100 × 0.9^10。并不是十个月后全部消失。模拟使用此复利模型并取整。",
        ),
      },
      {
        title: t("Test the reason for leaving", "检验离开的原因"),
        body: t(
          "Interview departed users, inspect the first-use experience, address product reliability and observe whether the core task is completed. Test reminders or onboarding changes against a comparable cohort. Do not promise a fixed churn reduction.",
          "访谈离开的用户，检查首次体验、产品可靠性与核心任务完成情况。用可比较的群组测试提醒或引导变化，不承诺固定流失降幅。",
        ),
      },
      {
        title: t(
          "Avoid substituting lock-in for value",
          "不要把锁定期限当成价值",
        ),
        body: t(
          "Annual contracts change billing and cancellation timing; they do not prove users receive value. Observe renewal, support issues and usage alongside revenue. Use simulation assumptions to plan experiments, then collect real evidence.",
          "年付合约改变账单与取消时点，但不能证明用户获得价值。应结合续费、支持问题与使用情况观察。用模拟假设规划实验，再收集真实证据。",
        ),
      },
    ],
    sources: [churn],
  },
  {
    path: "/guides/startup-idea-validation",
    kind: "guide",
    ...dates,
    updated: "2026-11-10",
    title: t(
      "Validate a startup idea before building",
      "开发前如何验证创业想法",
    ),
    intro: t(
      "A useful validation plan asks what evidence would change your decision. Simulation helps organize assumptions; it cannot prove that people will buy.",
      "有用的验证计划会问：哪些证据能改变决定？模拟帮助整理假设，不能证明有人购买。",
    ),
    sections: [
      {
        title: t(
          "What simulation can and cannot validate",
          "模拟能验证什么，不能验证什么",
        ),
        body: t(
          "A startup simulator can expose how assumptions interact; it cannot establish that customers want a product. Use it before an interview, prototype or clearly described offer to decide what evidence to collect. The following invented cases use the public engine, not customer observations. All cover simulated Day 0 to Day 5 (1/6 month); real use of the six-stage simulator takes about 15 minutes. Day 0 preserves setup cash and zero customers. Every case uses one part-time founder, 10% signup, 10% paid conversion, 10% monthly churn, $10 monthly price, $1,500 monthly cost and zero morale change. There are initially no customers to retain. Visits are totals for the five-day interval. Money is calculated in cents with JavaScript Math.round; the displayed balances are rounded to two dollar decimals.",
          "创业模拟能揭示假设之间的关系，不能证明客户需要产品。用它为访谈、原型或透明报价选择要收集的证据。以下是假设案例，使用公开引擎，不是用户观察。全部从模拟内第 0 天到第 5 天（1/6 个月）；六阶段一次模拟真实只需约 15 分钟。第 0 天保留初始现金，客户为零。每例均为一名兼职创业者，注册率 10%、付费转化率 10%、月流失率 10%、月价格 $10、月成本 $1,500、士气变化为零。没有原客户需要留存；访问数是五天间隔总量。金额以美分计算并使用 JavaScript Math.round 舍入，美元余额显示两位小数。",
        ),
      },
      {
        title: t("Case 1: Weak demand", "案例 1：需求不足"),
        body: t(
          "Starting cash: $10,000. Interval visits: 100. One-time cost: $0. Paying customers: 1. Monthly revenue: $10. Cash after Day 5: $9,751.67. Calculation: floor(100 × 0.10 × 0.10) = 1 customer; 1,000,000 + round((1,000 − 150,000) / 6) = 975,167 cents. This is low acquisition under chosen assumptions, not proof of weak real demand. Next experiment: ask a narrowly defined customer group about a recent problem and its current workaround, then offer a transparent prototype or commitment request. Before starting, define the group, observation window, budget and decision threshold; record behavior and refusals. Replace conversion guesses with observed denominators.",
          "初始现金 $10,000，间隔访问数 100，一次性支出 $0。付费客户：1。月收入 $10。第 5 天现金：$9,751.67。计算：向下取整（100 × 0.10 × 0.10）= 1 个客户；1,000,000 + Math.round((1,000 − 150,000) / 6) = 975,167 美分。低获客量来自所选假设，不证明真实需求不足。下一步：询问具体客户群近期问题及现有替代方式，再提出透明原型或承诺请求。事先明确人群、观察期、预算和决策阈值，记录实际行为和拒绝理由，用有分母的观察替换转化率猜测。",
        ),
      },
      {
        title: t("Case 2: Expensive acquisition", "案例 2：获客支出过高"),
        body: t(
          "Starting cash: $10,000. Interval visits: 1,000. One-time cost: $3,000, assumed entirely to be acquisition spending. Paying customers: 10. Monthly revenue: $100. Cash after Day 5: $6,766.67. Calculation: floor(1,000 × 0.10 × 0.10) = 10 customers; 1,000,000 + round((10,000 − 150,000) / 6) − 300,000 = 676,667 cents. Hypothetical acquisition cost is $3,000 / 10 = $300 per new paying customer. Price alone cannot establish payback or lifetime value: margin and retention still matter. Next experiment: measure one channel with a predefined spending ceiling and attribution window; distinguish visits, signups and new paying customers. Include labor and other acquisition costs in the real calculation rather than treating every signup as a sale.",
          "初始现金 $10,000，间隔访问数 1,000，一次性支出 $3,000，假设全部属于获客投入。付费客户：10。月收入 $100。第 5 天现金：$6,766.67。计算：向下取整（1,000 × 0.10 × 0.10）= 10 个客户；1,000,000 + Math.round((10,000 − 150,000) / 6) − 300,000 = 676,667 美分。假设获客成本为 $3,000 / 10 = 每位新付费客户 $300。只看售价不能判断回本或终身价值，还需要毛利与留存。下一步：对单一渠道设定支出上限和归因窗口，分别记录访问、注册和新付费客户；现实计算应包括人工等获客成本，不把每个注册当成成交。",
        ),
      },
      {
        title: t("Case 3: Cash exhausted early", "案例 3：现金提前耗尽"),
        body: t(
          "Starting cash: $100. Interval visits: 0. One-time cost: $0. Paying customers: 0. Monthly revenue: $0. Cash after Day 5: $0.00. Calculation: max(0, 10,000 + round((0 − 150,000) / 6)) = 0 cents. The engine completes the scenario at the Day 5 checkpoint and does not simulate a precise insolvency date within that interval. No later stage is reached. This is not a real financial forecast. Next experiment: list dated cash obligations and verified available cash, test a lower-cost prototype, and define a stop condition before committing funds. Add taxes, payment delays, personal obligations and other omitted items to a real budget; do not assume simulated funding exists.",
          "初始现金 $100，间隔访问数 0，一次性支出 $0。付费客户：0。月收入 $0。第 5 天现金：$0.00。计算：max(0, 10,000 + Math.round((0 − 150,000) / 6)) = 0 美分。引擎在第 5 天检查点结束场景，不模拟间隔内精确的资不抵债日期，也不会进入后续阶段。这不是现实财务预测。下一步：列出有日期的现金义务及已核实可用现金，尝试成本更低的原型，承诺资金前明确停止条件。真实预算应补充税费、回款延迟、个人义务等遗漏项，不假定模拟中的融资真实存在。",
        ),
      },

      {
        title: t(
          "Define customer, problem and alternative",
          "明确客户、问题与替代方案",
        ),
        body: t(
          "Describe a narrow customer group, a recent problem and how it is solved today. Ask about actual behavior rather than whether someone likes your idea.",
          "描述具体客户群、近期问题及现有解决方式。询问真实行为，不只问是否喜欢你的想法。",
        ),
      },
      {
        title: t("Choose one falsifiable assumption", "选择一个可证伪的假设"),
        body: t(
          "It might be willingness to pay, access to a channel or repeat use. Define your test, observation window and stopping condition before running it. Thresholds should fit your context, not a generic signup target.",
          "它可能是付费意愿、渠道可达性或重复使用。实验前定义方法、观察期间和停止条件。阈值应符合自身情境，不套用通用注册人数。",
        ),
      },
      {
        title: t(
          "Run the smallest informative test",
          "运行最小且有信息量的实验",
        ),
        body: t(
          "An interview, transparent landing page or prototype can test different questions. Explain what exists today. Measure commitments and behavior rather than treating every email signup as a future customer.",
          "访谈、透明说明的落地页或原型可以测试不同问题。说明当下已有的产品状态；衡量承诺与行为，不把每个邮箱注册都当成未来客户。",
        ),
      },
      {
        title: t("Use the simulation as preparation", "把模拟用作准备"),
        body: t(
          "One run covers 180 simulated days in about 15 real minutes. Record the assumptions that drive its outcome, then test those outside the simulator.",
          "一次模拟覆盖模拟内的 180 天，真实只需约 15 分钟。记录影响结果的关键假设，再到模拟器外验证。",
        ),
      },
    ],
    sources: [
      sba,
      {
        title:
          "Goodbye Startup: versioned calculation rules (hypothetical examples)",
        url: "https://github.com/liuyewang/goodbye-startup/blob/d07cd6e19a38dd54728af6a5b3a69269b89e2a07/src/domain/simulation/engine.ts",
      },
    ],
  },
  {
    path: "/guides/startup-cost-benchmarks",
    kind: "guide",
    ...dates,
    title: t(
      "Startup cost assumptions to stress-test",
      "需要压力测试的创业成本假设",
    ),
    intro: t(
      "These are model inputs and arithmetic examples, not universal industry benchmarks. Replace them with evidence for your market.",
      "这里是模型输入和算术示例，不是通用行业基准。请用自身市场证据替换。",
    ),
    sections: [
      {
        title: t("Traffic and conversion", "流量与转化"),
        body: t(
          "Example: 1,000 visits × 10% signup × 10% paid conversion = 10 new paying customers. Doubling either conversion rate doubles this simplified result, but real effects may interact.",
          "示例：1,000 次访问 × 10% 注册 × 10% 付费转化 = 10 位新增付费客户。简化模型中任一转化率翻倍，结果翻倍；现实影响可能相互关联。",
        ),
      },
      {
        title: t("Price and monthly costs", "价格与月成本"),
        body: t(
          "Example: 10 customers at $20 per month produce $200 monthly revenue. With $1,500 monthly costs, net burn is $1,300. The simulator treats its interval revenue rate as constant; it is an educational simplification.",
          "示例：10 位客户每月各付 20 美元，月收入为 200 美元。月成本 1,500 美元时，净消耗为 1,300 美元。模拟假定区间收入速率恒定，这是教学简化。",
        ),
      },
      {
        title: t("Churn and cash sensitivity", "流失与现金敏感度"),
        body: t(
          "Compare several plausible churn and cost assumptions rather than choosing a favorable one. The displayed result is conditional on those inputs. No research or live retrieval occurs during a run.",
          "比较多组合理的流失和成本假设，不只选择有利数值。显示结果以输入为条件；模拟中不进行研究或实时检索。",
        ),
      },
      {
        title: t("Keep a record of the evidence", "记录证据来源"),
        body: t(
          "For each real-world estimate, note its source, date, population and uncertainty. Keep quoted prices separate from assumptions and simulated output.",
          "对现实估计记录来源、日期、适用人群和不确定性。把实际报价、假设与模拟输出区分开。",
        ),
      },
    ],
    sources: [sba, cac, churn],
  },
  {
    path: "/guides/180-day-simulation-explained",
    kind: "guide",
    ...dates,
    title: t("The 180-day simulation explained", "180 天模拟如何进行"),
    intro: t(
      "All days are simulated; real use takes about 15 minutes. The model has six fixed stages and may end early if cash reaches zero.",
      "天数是模拟内的，真实只需约 15 分钟。模型有六个固定阶段，现金归零时可能提前结束。",
    ),
    sections: [
      {
        title: t("Simulated Day 0: baseline", "模拟内第 0 天：初始状态"),
        body: t(
          "Set cash, monthly cost, team and commitment. The first response introduces the scenario without changing cash. All days are simulated; real use takes about 15 minutes.",
          "设置现金、月成本、团队和投入方式。首次回复介绍情景，不改变现金。天数是模拟内的，真实只需约 15 分钟。",
        ),
      },
      {
        title: t(
          "Simulated Days 5 and 90: demand and launch",
          "模拟内第 5 与 90 天：需求与启动",
        ),
        body: t(
          "Choose a proposed action or write your own. AI supplies bounded assumptions and code settles the interval. All days are simulated; real use takes about 15 minutes.",
          "选择建议行动或输入自己的决策。AI 提供受限参数，程序结算区间。天数是模拟内的，真实只需约 15 分钟。",
        ),
      },
      {
        title: t(
          "Simulated Days 120, 150 and 180: retention and outcome",
          "模拟内第 120、150 与 180 天：留存与结果",
        ),
        body: t(
          "Observe customer retention, revenue, cost and cash. Positive cash with revenue covering cost is promising within this model; positive cash below break-even needs revision; zero cash ends the scenario. All days are simulated; real use takes about 15 minutes.",
          "观察客户留存、收入、成本与现金。现金为正且收入覆盖成本时，模型认为有潜力；现金为正但未盈亏平衡时需修改；现金归零则结束。天数是模拟内的，真实只需约 15 分钟。",
        ),
      },
      {
        title: t("Save, retry and export", "保存、重试与导出"),
        body: t(
          "Text stays in the browser. Numerical state remains recoverable for 30 days after a successful turn. A repeated request ID does not spend another attempt. Lost text cannot be recovered from the server. Export before clearing site data.",
          "文本留在浏览器。每次成功推进后，数值状态可恢复 30 天。相同请求编号不会再消耗一次尝试。服务端无法恢复丢失文本，清理站点数据前请先导出。",
        ),
      },
    ],
    sources: [],
  },
];
