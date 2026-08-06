import type { Translations } from "./en";

export const zh: Translations = {
  common: {
    startFree: "免费开始",
    getStarted: "立即开始",
    learnMore: "了解更多",
    tryNow: "立即体验",
    back: "返回",
    next: "下一步",
    submit: "提交",
    cancel: "取消",
    loading: "加载中...",
    error: "出错了",
    retry: "重试",
  },
  nav: {
    logo: "再见创业",
    home: "首页",
    howItWorks: "工作原理",
    pricing: "价格",
    about: "关于我们",
    startSimulator: "开始模拟",
  },
  hero: {
    badge: "AI 驱动的创业模拟器",
    title: "告别朝九晚五，",
    titleHighlight: "开启你的创业之旅。",
    subtitle: "用数据驱动的 AI 导师，在 180 天内测试你的创业想法。没有风险，不烧积蓄——只有真实的市场现实。",
    ctaPrimary: "开始你的模拟 — 完全免费",
    ctaSecondary: "了解工作原理",
    stats: {
      days: "180 天",
      daysDesc: "完整模拟周期",
      accuracy: "真实数据",
      accuracyDesc: "基于行业基准数据",
      free: "1 次免费",
      freeDesc: "先体验后付费",
    },
  },
  features: {
    title: "为什么选择再见创业？",
    subtitle: "因为 90% 的创业都会失败——而其中大多数本可以提前预见。",
    items: [
      {
        icon: "📊",
        title: "数据驱动的现实",
        description: "没有炒作，没有心灵鸡汤。只有基于真实创业失败率的冰冷行业数据。",
      },
      {
        icon: "⚡",
        title: "180 天模拟",
        description: "一次性体验完整的创业生命周期——从想法到上线到增长或死亡。",
      },
      {
        icon: "🎯",
        title: "你的决定很重要",
        description: "你做的每一个选择都会影响你的现金流、用户增长和生存机会。明智选择。",
      },
      {
        icon: "💡",
        title: "烧钱前先学习",
        description: "在你辞职和花光积蓄之前，发现你想法中的致命缺陷。",
      },
      {
        icon: "🤖",
        title: "诚实的 AI 导师",
        description: "我们的 AI 导师不画饼。它告诉你需要听的，而不是你想听的。",
      },
      {
        icon: "🔄",
        title: "快速迭代",
        description: "在模拟中快速失败，在现实中成功。运行多次模拟来优化你的方法。",
      },
    ],
  },
  howItWorks: {
    title: "工作原理",
    subtitle: "五个阶段。180 天。关于你创业想法的一个残酷真相。",
    steps: [
      {
        number: "01",
        title: "描述你的想法",
        description: "告诉 AI 导师你的创业概念、目标市场和初始资源。",
      },
      {
        number: "02",
        title: "市场现实检验",
        description: "第 1-5 天：对你想法的市场适配度和竞争格局进行残酷诚实的评估。",
      },
      {
        number: "03",
        title: "上线与初始数据",
        description: "第 60-90 天：用真实的转化率和获客成本模拟你的产品上线。",
      },
      {
        number: "04",
        title: "用户行为模拟",
        description: "第 91-180 天：观察真实用户会如何行为——流失、参与度、口碑传播等等。",
      },
      {
        number: "05",
        title: "审判日",
        description: "第 180 天：面对最终裁决。你成功了吗？还是资金耗尽了？",
      },
    ],
  },
  pricing: {
    title: "简单诚实的定价",
    subtitle: "免费试用。只有想继续测试想法时才需要付费。",
    plans: [
      {
        name: "免费版",
        price: "¥0",
        period: "永久",
        description: "适合试水体验",
        features: [
          "1 次完整模拟（180 天）",
          "基于真实数据的 AI 导师",
          "5 个决策点",
          "基础最终报告",
        ],
        cta: "免费开始",
        popular: false,
      },
      {
        name: "专业版",
        price: "¥69",
        period: "每月",
        description: "适合认真验证想法的人",
        features: [
          "无限次模拟",
          "高级 AI 导师模式",
          "无限决策点",
          "详细分析报告",
          "保存和对比模拟结果",
          "导出结果",
        ],
        cta: "获取专业版",
        popular: true,
      },
      {
        name: "终身版",
        price: "¥349",
        period: "一次性",
        description: "一次付费，永久测试",
        features: [
          "专业版所有功能",
          "终身访问权",
          "所有未来更新",
          "优先支持",
        ],
        cta: "获取终身版",
        popular: false,
      },
    ],
    guarantee: "30 天无理由退款。",
  },
  sim: {
    title: "创业模拟器",
    day: "第",
    of: "天 / 共 180 天",
    phase: {
      prologue: "序章",
      market: "市场分析",
      launch: "上线阶段",
      growth: "增长阶段",
      verdict: "审判日",
    },
    stats: {
      cash: "现金",
      runway: "现金流跑道",
      users: "用户数",
      revenue: "收入",
      morale: "团队士气",
      burn: "月烧钱率",
    },
    input: {
      placeholder: "描述你的决定或提问...",
      send: "发送",
    },
    thinking: "AI 正在思考中...",
    welcome: "欢迎来到创业压力测试。在接下来的 180 天里，我们将用真实的市场数据来检验你的想法。忘掉那些成功故事——准备好面对残酷的现实吧。现在，告诉我你的创业想法。",
    paywall: {
      title: "想试试另一个想法吗？",
      description: "你已经用完了免费模拟次数。升级到专业版，无限测试创业想法，成为更好的创始人。",
      cta: "升级到专业版 — ¥69/月",
      or: "或者",
      lifetime: "获取终身访问 — ¥349",
    },
  },
  footer: {
    tagline: "在你辞职之前，先测试你的创业想法。",
    product: "产品",
    company: "公司",
    legal: "法律",
    links: {
      home: "首页",
      howItWorks: "工作原理",
      pricing: "价格",
      about: "关于我们",
      privacy: "隐私政策",
      terms: "服务条款",
    },
    copyright: "© 2026 再见创业。保留所有权利。",
    madeWith: "用 ☕ 和现实主义悲观主义打造",
  },
  about: {
    title: "关于再见创业",
    subtitle: "我们的使命是让你免于创业的第一杀手：糟糕的想法。",
    mission: {
      title: "我们的使命",
      description: "每年，数百万人辞职、花光积蓄、把数年的生命投入到从一开始就注定失败的创业想法中。我们相信，在你纵身一跃之前，你应该知道自己真正跳进的是什么。再见创业使用 AI 和真实市场数据来模拟创业旅程——这样你可以学到惨痛的教训，却不用付出惨痛的代价。",
    },
    why: {
      title: "我们为什么做这个",
      description: "我们见过太多朋友和同事为追逐从不现实的创业梦想而耗尽心力。问题不在于努力不够——而在于缺乏诚实的反馈。大多数创业建议要么是炒作，要么是无用的陈词滥调。我们想创造一个能告诉你真相的东西，哪怕真相很伤人。",
    },
    values: {
      title: "我们的价值观",
      items: [
        {
          icon: "🎯",
          title: "极度诚实",
          description: "我们不画饼。如果你的想法很烂，我们会告诉你——以及为什么。",
        },
        {
          icon: "📊",
          title: "数据胜于炒作",
          description: "每次模拟都基于真实行业数据，而不是励志名言。",
        },
        {
          icon: "🌱",
          title: "学习胜于失败",
          description: "模拟中的失败只是学习。目标是让你变得更好。",
        },
      ],
    },
  },
  privacy: {
    title: "隐私政策",
    lastUpdated: "最后更新：2026 年 8 月 5 日",
    sections: [
      {
        title: "我们收集的信息",
        content: "我们收集您直接提供给我们的信息，例如当您使用我们的模拟器、创建账户或联系我们寻求支持时。这可能包括您的电子邮件地址、模拟数据以及您选择提供的任何其他信息。",
      },
      {
        title: "我们如何使用您的信息",
        content: "我们使用收集的信息来提供、维护和改进我们的服务，与您沟通，并个性化您的体验。我们不会向第三方出售您的个人信息。",
      },
      {
        title: "AI 与数据处理",
        content: "您的模拟对话由我们的 AI 合作伙伴（Google Gemini）处理以生成回复。未经您的明确同意，我们不会使用您的对话来训练 AI 模型。",
      },
      {
        title: "数据安全",
        content: "我们采取合理措施帮助保护您的个人信息免遭丢失、盗窃、滥用、未经授权的访问、披露、更改和破坏。",
      },
      {
        title: "您的选择",
        content: "您可以随时通过联系我们来访问、更新或删除您的个人信息。您也可以按照促销信息中的说明选择不再接收我们的促销通信。",
      },
      {
        title: "联系我们",
        content: "如果您对本隐私政策有任何疑问，请通过 privacy@goodbye.help 联系我们。",
      },
    ],
  },
};
