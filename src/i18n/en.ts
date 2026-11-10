export const en = {
  common: {
    startFree: "Start Free",
    getStarted: "Get Started",
    learnMore: "Learn More",
    tryNow: "Try Now",
    back: "Back",
    next: "Next",
    submit: "Submit",
    cancel: "Cancel",
    loading: "Loading...",
    error: "Something went wrong",
    retry: "Try Again",
    menu: "Toggle navigation menu",
    skip: "Skip to content",
    backArticles: "← Back to articles",
    updated: "Updated: ",
    sources: "Sources and scope",
    sourceNote:
      "Sources explain definitions and measurement. Numerical examples are teaching arithmetic, not industry benchmarks.",
    timeNote: "All days are simulated; real use takes about 15 minutes.",
    blogTitle: "Startup Learning Blog",
    guideTitle: "Startup Guides",
    indexIntro:
      "Distinguish assumptions, arithmetic and real evidence. Understand what a simulation can and cannot do.",
    moreReading: "More reading",
    ctaTitle: "Explore your idea in about 15 minutes",
    ctaBody:
      "One free simulation. All days are simulated; real use takes about 15 minutes. No payment is collected.",
    myth: "Myth:",
    notFound: "Page not found",
    returnHome: "Return home",
  },
  nav: {
    logo: "Goodbye Startup",
    home: "Home",
    howItWorks: "How It Works",
    pricing: "Pricing",
    about: "About",
    startSimulator: "Start Simulator",
  },
  hero: {
    badge: "AI-Powered Startup Simulator",
    title: "Say goodbye to your 9-5.",
    titleHighlight: "Start your startup journey.",
    subtitle:
      "For aspiring founders: practice cash, pricing and retention decisions across 180 simulated days in about 15 minutes. One free run, no account. Scenarios are not market research.",
    ctaPrimary: "Simulate 180 Days in 15 Min — Free",
    ctaSecondary: "How It Works",
    stats: {
      days: "180 Days",
      daysDesc: "compressed into 15 min",
      accuracy: "Testable assumptions",
      accuracyDesc: "Not live market predictions",
      free: "1 Free Run",
      freeDesc: "No account required",
    },
  },
  problem: {
    title: "Ask the difficult questions before you start",
    subtitle: "A simulation surfaces assumptions. Real experiments test them.",
    stats: [
      {
        value: "01",
        label: "Who will pay?",
      },
      {
        value: "02",
        label: "How will you reach customers?",
      },
      {
        value: "03",
        label: "How long will cash last?",
      },
      {
        value: "04",
        label: "What evidence changes your decision?",
      },
    ],
    description:
      "Practice decisions in a deliberately limited model. Its output is a scenario, not market evidence. Follow it with interviews, prototypes or small real-world tests.",
  },
  features: {
    title: "Why Goodbye Startup?",
    subtitle:
      "Because 90% of startups fail — and most of them could have seen it coming.",
    items: [
      {
        icon: "📊",
        title: "180 simulated days",
        description: "Six stages in about 15 minutes of real time.",
      },
      {
        icon: "⚡",
        title: "Transparent metrics",
        description:
          "Code calculates cash, customers, revenue and runway from assumptions.",
      },
      {
        icon: "🎯",
        title: "Your starting conditions",
        description: "Set cash, monthly costs, team size and commitment.",
      },
      {
        icon: "💡",
        title: "Learn through practice",
        description: "Identify assumptions that need real-world evidence.",
      },
      {
        icon: "🤖",
        title: "AI scenario suggestions",
        description: "DeepSeek proposes scenarios without live research.",
      },
      {
        icon: "🔄",
        title: "Record and reflect",
        description: "Keep text locally and export your record as JSON.",
      },
    ],
  },
  howItWorks: {
    title: "How It Works",
    subtitle:
      "Six stages, one simulation. All days are simulated; real use takes about 15 minutes.",
    timeNote: "All days are simulated; real use takes about 15 minutes.",
    steps: [
      {
        number: "01",
        title: "Establish the baseline",
        description:
          "Simulated Day 0. All days are simulated; real use takes about 15 minutes.",
        detail:
          "Enter idea, cash, monthly costs, team and commitment. The first AI reply introduces the scenario without charging future costs.",
      },
      {
        number: "02",
        title: "Test demand",
        description:
          "Simulated Day 5. All days are simulated; real use takes about 15 minutes.",
        detail:
          "Choose a demand experiment; code settles cash and customer changes for the interval.",
      },
      {
        number: "03",
        title: "Explore launch",
        description:
          "Simulated Day 90. All days are simulated; real use takes about 15 minutes.",
        detail:
          "AI proposes visits, conversion, price and costs. These are assumptions, not research findings.",
      },
      {
        number: "04",
        title: "Observe retention",
        description:
          "Simulated Day 120. All days are simulated; real use takes about 15 minutes.",
        detail:
          "Retention compounds monthly churn; visits and conversion assumptions determine new paying customers.",
      },
      {
        number: "05",
        title: "Adjust spending",
        description:
          "Simulated Day 150. All days are simulated; real use takes about 15 minutes.",
        detail:
          "Compare monthly revenue and cost, then choose an action. Bankruptcy ends the scenario early.",
      },
      {
        number: "06",
        title: "Review the outcome",
        description:
          "Simulated Day 180. All days are simulated; real use takes about 15 minutes.",
        detail:
          "Review a rule-based outcome, inspect the timeline and export it. It cannot predict real success.",
      },
    ],
    detail: {
      heading: "What the model calculates",
      intro:
        "AI proposes assumptions; code controls settlement and termination.",
      items: [
        {
          title: "Time and initialization",
          body: "Stages are simulated Days 0, 5, 90, 120, 150 and 180; real use takes about 15 minutes. The first successful AI reply initializes Day 0 without charging costs or acquiring customers. Later interval months = (new day − previous day) / 30.",
        },
        {
          title: "Paying customers and retention",
          body: "Retained customers = floor(previous customers × (1 − monthly churn)^interval months). New paying customers = floor(interval visits × signup rate × paid conversion rate). Add these two integers; visits are an interval total, not a monthly rate.",
        },
        {
          title: "Revenue and cash, in integer cents",
          body: "Monthly revenue = paying customers × price per month. Cash = clamp(previous cash + Math.round((monthly revenue − monthly cost) × interval months) − one-time cost, 0, 1,000,000,000 cents). Retention is applied first; the new monthly revenue is treated as constant across the whole interval. This is a simplification, not accounting.",
        },
        {
          title: "Runway and scenario outcome",
          body: "Runway months = cash / (monthly cost − monthly revenue) when net burn is positive; otherwise the UI shows no net burn. Cash reaching zero ends the simulation early. At Day 180, positive cash with revenue covering cost is viable within the model; positive cash below break-even means revise. Zero cash means abandon the simulated scenario, not a recommendation about a real business.",
        },
        {
          title: "A reproducible Day 5 example",
          body: "Hypothetical inputs: $10,000 starting cash, $1,500 monthly cost, zero customers; after Day 0 use 1,000 interval visits, 10% signup, 10% paid conversion, 10% monthly churn, $10 monthly price and no one-time cost. The five-day interval is 1/6 month. Paying customers = 10; monthly revenue = $100; cash = $9,766.67; runway is about 6.98 months. The calculation uses JavaScript Math.round for integer cents (exact half-cent ties round toward positive infinity). These are invented inputs, not observed conversion benchmarks.",
        },
        {
          title: "Scope and limitations",
          body: "AI proposes assumptions; validated code settles them. The model omits taxes, receivables, financing, uncertainty distributions and live market research. It approximates interval revenue and retention, and does not simulate customer-by-customer billing. Team size and commitment provide AI context rather than directly changing arithmetic. Test demand outside the simulator.",
        },
      ],
      sourceLabel: "Calculation source and revision",
      sourceUrl:
        "https://github.com/liuyewang/goodbye-startup/blob/d07cd6e19a38dd54728af6a5b3a69269b89e2a07/src/domain/simulation/engine.ts",
      reviewed:
        "Method reviewed: 2026-11-10. Worked examples are hypothetical, not customer results.",
      closing:
        "Turn the scenario’s critical assumptions into real-world tests before committing resources.",
    },
  },
  pricing: {
    title: "Simple, Honest Pricing",
    subtitle:
      "One free simulation is available. Paid plans are not available yet.",
    plans: [
      {
        name: "Free",
        price: "$0",
        period: "anonymous browser allocation",
        description: "Explore one complete simulation",
        features: [
          "Up to 180 simulated days, about 15 real minutes",
          "Six stages, with possible early bankruptcy",
          "At most 10 provider attempts",
          "Local record and JSON export",
        ],
        cta: "Start Free",
        popular: false,
      },
      {
        name: "Pro",
        price: "TBD",
        period: "future plan",
        description: "Not sold; no payment is collected",
        features: [
          "Features and price are not finalized",
          "No checkout or subscription available",
        ],
        cta: "Not available yet",
        popular: false,
      },
      {
        name: "Lifetime",
        price: "TBD",
        period: "future plan",
        description: "Not sold; no payment is collected",
        features: [
          "Features and price are not finalized",
          "No checkout or subscription available",
        ],
        cta: "Not available yet",
        popular: false,
      },
    ],
    guarantee:
      "There is currently no payment, subscription or refund workflow.",
    valueComparison: {
      title: "Use the simulation for the right purpose",
      intro: "It supports thinking, not real-world validation.",
      items: [
        {
          real: "Interview customers",
          cost: "Find evidence of demand",
        },
        {
          real: "Test a prototype",
          cost: "Observe actual behavior",
        },
      ],
      conclusion:
        "One simulation takes about 15 real minutes. Real experiments have project-specific time and cost.",
    },
    faq: {
      heading: "Before you begin",
      items: [
        {
          q: "What counts as one simulation?",
          a: "The first successful AI response uses the free eligibility. A normal run has six stages and at most 10 attempts. Failed attempts count, but eligibility is not used until the first success.",
        },
        {
          q: "Do I need an account?",
          a: "No. An anonymous cookie identifies a browser allocation, not a natural person. Clearing cookies or changing devices can create a new identity.",
        },
        {
          q: "Where does my data live?",
          a: "Text stays in the browser and is sent to DeepSeek for inference. The server retains anonymous numerical state for 30 days and quota metadata for 180 days.",
        },
        {
          q: "Can I buy more simulations?",
          a: "Not yet. Pro and Lifetime are future directions; their features and prices are unconfirmed.",
        },
        {
          q: "Does deletion reset eligibility?",
          a: "No. Deletion, abandonment or expiry does not refund used eligibility.",
        },
        {
          q: "Are results reliable predictions?",
          a: "They are assumption-based educational scenarios, not market research or success predictions.",
        },
      ],
    },
  },
  whoFor: {
    title: "Who is this for?",
    subtitle:
      "If you're nodding at any of these, this simulator was built for you.",
    items: [
      {
        icon: "💻",
        title: "Solo developers",
        description:
          "You can build it, but you're not sure if anyone will pay for it. Test the idea before you quit your job.",
      },
      {
        icon: "🎓",
        title: "First-time founders",
        description:
          "You've never run a business. Learn how cash burn, churn, and CAC actually work — without losing your savings.",
      },
      {
        icon: "🚀",
        title: "Side-project starters",
        description:
          "You're building on weekends. Simulate whether your side project has a shot at becoming your main thing.",
      },
      {
        icon: "💼",
        title: "9-5 refugees",
        description:
          "You hate your job and want out. Find out if your escape plan is viable — or if you're just jumping from one bad situation to another.",
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Straight answers before you spend a minute or a dollar.",
    items: [
      {
        q: "What counts as one simulation?",
        a: "The first successful AI response uses the free eligibility. A normal run has six stages and at most 10 attempts. Failed attempts count, but eligibility is not used until the first success.",
      },
      {
        q: "Do I need an account?",
        a: "No. An anonymous cookie identifies a browser allocation, not a natural person. Clearing cookies or changing devices can create a new identity.",
      },
      {
        q: "Where does my data live?",
        a: "Text stays in the browser and is sent to DeepSeek for inference. The server retains anonymous numerical state for 30 days and quota metadata for 180 days.",
      },
      {
        q: "Can I buy more simulations?",
        a: "Not yet. Pro and Lifetime are future directions; their features and prices are unconfirmed.",
      },
      {
        q: "Does deletion reset eligibility?",
        a: "No. Deletion, abandonment or expiry does not refund used eligibility.",
      },
      {
        q: "Are results reliable predictions?",
        a: "They are assumption-based educational scenarios, not market research or success predictions.",
      },
    ],
  },
  examples: {
    title: "What does a simulation actually look like?",
    subtitle:
      "These are fictional teaching examples, not saved run results or market data.",
    items: [
      {
        idea: "Idea: A weather app for drone pilots",
        verdict: "Requires real-world validation",
        details:
          "A weather tool for drone pilots: interview specific users and test willingness to pay for reliability.",
      },
      {
        idea: "Idea: A productivity tool for remote teams",
        verdict: "Requires real-world validation",
        details:
          "A remote-team tool: define one frequent problem and observe whether a small cohort keeps using it.",
      },
      {
        idea: "Idea: A meal-kit delivery service",
        verdict: "Requires real-world validation",
        details:
          "Meal delivery: estimate ingredients, packaging and delivery separately; simulation cannot replace operational trials.",
      },
    ],
  },
  myths: {
    title: "5 myths that kill startups",
    subtitle:
      "Every founder believes at least one of these. The simulator tests whether your idea survives them.",
    items: [
      {
        myth: "If I build it, they will come",
        truth:
          "Traffic requires a channel and effort. Measure conversion in your own small experiment; example percentages are not universal benchmarks.",
      },
      {
        myth: "My friends like it, so customers will pay",
        truth:
          "Friends’ approval is not evidence of recurring payments. Observe actual use and retention.",
      },
      {
        myth: "I can bootstrap forever",
        truth:
          "Runway depends on cash and net burn. There is no universal number of months for every founder.",
      },
      {
        myth: "A great product will win",
        truth:
          "Validate both product and distribution; feature count alone is not a competitive advantage.",
      },
      {
        myth: "I'll know it when I see it",
        truth:
          "Write down conditions for stopping or changing direction, then review real evidence.",
      },
    ],
  },
  footer: {
    tagline: "Test your startup idea before you quit your job.",
    product: "Product",
    company: "Company",
    legal: "Legal",
    links: {
      home: "Home",
      howItWorks: "How It Works",
      pricing: "Pricing",
      about: "About",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    },
    copyright: "© 2026 Goodbye Startup. All rights reserved.",
    madeWith: "Made with ☕ and realistic pessimism",
  },
  about: {
    title: "About Goodbye Startup",
    subtitle: "Practice startup decisions with an explainable simulation.",
    mission: {
      title: "Our Mission",
      description:
        "We help aspiring founders articulate assumptions, understand cash and retention, and choose their next real-world experiment. Simulation is a learning tool, not a guarantee or market study.",
    },
    why: {
      title: "Why We Built This",
      description:
        "A seemingly complete idea often hides untested conditions. A limited model makes those conditions visible so feedback can be discussed and tested.",
    },
    editorial: {
      heading: "Who this is for and how to check it",
      body: "Goodbye Startup is an educational decision rehearsal for aspiring founders, not a demand-validation service or an investment forecast. One anonymous free simulation is available without an account; paid plans are unavailable. The public repository records implementation changes. Report unclear calculations or misleading copy through its issue tracker; no independent certification or customer outcome is implied.",
      label: "Project history and corrections",
      url: "https://github.com/liuyewang/goodbye-startup/issues",
    },
    values: {
      title: "Our Values",
      items: [
        {
          icon: "🎯",
          title: "Radical Honesty",
          description: "Distinguish facts, assumptions and model limits.",
        },
        {
          icon: "📊",
          title: "Data Over Hype",
          description:
            "Reproducible rules calculate metrics; AI suggestions must pass validation.",
        },
        {
          icon: "🌱",
          title: "Learning Over Failure",
          description:
            "Failure in simulation is just learning. The goal is to make you better.",
        },
      ],
    },
  },
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "Updated: November 9, 2026",
    sections: [
      {
        title: "Text in your browser",
        content:
          "Your idea, decisions and AI replies are saved in browser local storage. Clearing site data, changing devices or disabling storage can lose text. Export JSON at any time; legacy records are export-only.",
      },
      {
        title: "What is sent to AI",
        content:
          "Each inference sends the idea, decision, limited history and numerical state to DeepSeek. Our server does not save that text. DeepSeek processing and retention follow its own policy; we do not promise provider-side deletion or training exclusions. Avoid sensitive personal information.",
      },
      {
        title: "Anonymous state and quota",
        content:
          "Cloudflare D1 stores anonymous session hashes, numerical state, operation versions, model versions and token counts. Saves expire and are cleaned 30 days after successful progression, or creation for drafts. Used quota lasts 180 days from first success; unused allocations last at most 180 days from creation.",
      },
      {
        title: "Cookies and logs",
        content:
          "An HttpOnly, SameSite=Lax cookie identifies an anonymous allocation, with Secure transport in production. It is not an advertising cookie. Short-window limits use HMAC-derived IP identifiers; the application database stores neither raw IPs nor simulation text. Cloudflare and DeepSeek may process necessary connection and operational logs.",
      },
      {
        title: "Deletion and recovery",
        content:
          "The delete control removes the server numerical save and operation records; quota remains until expiry. Clear browser storage separately to remove local text. Expiry, deletion or abandonment does not refund used eligibility. Local text cannot restore authoritative server state.",
      },
      {
        title: "Public content and contact",
        content:
          "Public pages may be indexed by search and AI crawlers. Private APIs are excluded from public content exports. This version has no accounts, checkout or email marketing. Report issues in the project GitHub repository without including secrets or simulation text.",
      },
    ],
  },
};
export type Translations = typeof en;
