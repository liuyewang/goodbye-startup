const en = {
  missingPrice: "Unknown saved unit price",
  metric: "Metric",
  months: "months",
  solid: "solid",
  dashed: "dashed",
  invalid:
    "Enter an amount within the shown range, with up to two decimal places.",
  title: "Your one-page review",
  settled: "Settled result · authoritative",
  before: "Before this decision",
  context: "AI draft · written before settlement",
  contextNote:
    "This draft used the previous stage as context. Any totals mentioned in it are not the settled result. Use the calculated panel and review for final numbers.",
  target: "Customers needed to break even",
  gap: "Additional customers needed",
  unknown: "Unavailable at this price",
  priceUnknown:
    "The saved numerical record does not establish a usable unit price. Set a teaching price below; it is not a recovered model assumption.",
  action: "Your next real-world test",
  actionBody:
    "Next week, speak with five people matching your target customer. Show a concrete paid offer and ask for a small paid pilot. Record objections, willingness to pay and actual use; compare evidence with your price and conversion assumptions.",
  sensitivity: "Compare one assumption locally",
  scope:
    "Hypothetical sensitivity, not a new simulation: hold paying customers fixed, change only price or monthly cost. No new acquisition, churn, price elasticity, taxes or funding. Future cash is arithmetic, not a forecast. No AI call or eligibility change.",
  variable: "Variable to change",
  price: "Unit price (USD)",
  cost: "Monthly cost (USD)",
  value: "Comparison value (USD)",
  baseline: "Baseline",
  alternative: "Comparison",
  net: "Monthly net cash flow",
  runway: "Runway (months)",
  noBurn: "No net burn",
  cash: "Cash",
  customers: "Paying customers",
  revenue: "Monthly revenue",
  horizon: "Cash after 3 hypothetical months",
  chart: "Hypothetical cash paths over months 0 to 3",
  reset: "Reset comparison",
  export: "Download one-page review",
  note: "AI assumptions require real evidence. This is not a prediction or investment advice.",
  exampleTitle: "What you can learn in one run",
  example:
    "Hypothetical example: a $10/month tutor tool reaches 22 paying customers. With $1,500 monthly costs, $220 revenue leaves a $1,280 monthly gap. Break-even needs 150 customers — 128 more. Your next step: test a paid offer with real tutors.",
  exampleNote:
    "Fictional teaching example, not market data. All days are simulated; real use takes about 15 minutes.",
};
type Copy = Record<keyof typeof en, string>;
const zh: Copy = {
  missingPrice: "存档单价未知",
  metric: "指标",
  months: "个月",
  solid: "实线",
  dashed: "虚线",
  invalid: "请输入所示范围内的金额，最多保留两位小数。",
  title: "你的一页复盘",
  settled: "结算后结果 · 以此为准",
  before: "本次决策前",
  context: "AI 草稿 · 生成于结算前",
  contextNote:
    "这份草稿使用上一阶段作为上下文，其中提到的总数不代表结算后结果。最终数字请以程序面板和复盘为准。",
  target: "盈亏平衡所需付费客户",
  gap: "还需增加的付费客户",
  unknown: "该价格下无法计算",
  priceUnknown:
    "数值存档无法确定可用单价。请在下方设置教学假设价格；它不是恢复出的模型假设。",
  action: "下一步现实验证",
  actionBody:
    "下周找五位符合目标画像的人，展示一份具体的付费方案，邀请小规模付费试用。记录拒绝原因、付费意愿和实际使用情况，再对照定价与转化假设。",
  sensitivity: "在本地比较一个假设",
  scope:
    "这是敏感性测算，不是重跑模拟：固定付费客户数，只改价格或每月成本；不模拟新增、流失、价格弹性、税费或融资。未来现金只是算术，不是预测。不调用 AI，也不改变免费资格。",
  variable: "要调整的变量",
  price: "单价（美元）",
  cost: "每月成本（美元）",
  value: "比较值（美元）",
  baseline: "基准",
  alternative: "比较方案",
  net: "每月净现金流",
  runway: "资金可支撑（月）",
  noBurn: "无净消耗",
  cash: "现金",
  customers: "付费客户",
  revenue: "月收入",
  horizon: "假设三个月后的现金",
  chart: "假设第 0 到 3 个月的现金路径",
  reset: "重置比较",
  export: "下载一页复盘",
  note: "AI 假设需要现实证据验证。这不是预测或投资建议。",
  exampleTitle: "一次模拟后，你能看清什么",
  example:
    "虚构示例：给导师用的工具每月收费 10 美元，获得 22 位付费客户。每月成本 1,500 美元、收入 220 美元，每月还缺 1,280 美元。盈亏平衡需要 150 位客户，还差 128 位。下一步：向真实导师验证付费方案。",
  exampleNote:
    "虚构教学示例，不是用户成绩或行业数据。天数是模拟内的，真实只需约 15 分钟。",
};
export const reviewCopy = { en, zh };
