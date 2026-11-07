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
    subtitle: "Test your startup idea in 180 days with a data-driven AI mentor. No risk, no wasted savings — just real market reality.",
    ctaPrimary: "Start Your Simulation — It's Free",
    ctaSecondary: "How It Works",
    stats: {
      days: "180 Days",
      daysDesc: "Full simulation cycle",
      accuracy: "Realistic Data",
      accuracyDesc: "Based on industry benchmarks",
      free: "1 Free Run",
      freeDesc: "Try before you pay",
    },
  },
  problem: {
    title: "The brutal truth about startups",
    subtitle: "Most people don't fail because they're lazy. They fail because they skipped the one step that would have saved them.",
    stats: [
      { value: "90%", label: "of startups fail within 3 years" },
      { value: "$30k", label: "average personal savings drained before quitting" },
      { value: "14 mo", label: "average runway before running out of cash" },
      { value: "80%", label: "of founders say the idea was wrong, not the execution" },
    ],
    description: "You don't need another motivational book. You don't need another networking event. You need to know — before you spend $30,000 and 14 months of your life — whether your idea can actually survive contact with the market.",
  },
  features: {
    title: "Why Goodbye Startup?",
    subtitle: "Because 90% of startups fail — and most of them could have seen it coming.",
    items: [
      {
        icon: "📊",
        title: "Data-Driven Reality",
        description: "No hype, no motivation porn. Just cold, hard industry data based on real startup failure rates.",
      },
      {
        icon: "⚡",
        title: "180 Day Simulation",
        description: "Experience the full startup lifecycle — from idea to launch to growth or death — in one sitting.",
      },
      {
        icon: "🎯",
        title: "Your Decisions Matter",
        description: "Every choice you make affects your runway, user growth, and chance of survival. Choose wisely.",
      },
      {
        icon: "💡",
        title: "Learn Before You Burn",
        description: "Discover the fatal flaws in your idea before you quit your job and drain your savings.",
      },
      {
        icon: "🤖",
        title: "AI Mentor That's Honest",
        description: "Our AI mentor doesn't sugarcoat. It tells you what you need to hear, not what you want to hear.",
      },
      {
        icon: "🔄",
        title: "Iterate Fast",
        description: "Fail fast in simulation, succeed in real life. Run multiple simulations to refine your approach.",
      },
    ],
  },
  howItWorks: {
    title: "How It Works",
    subtitle: "Five phases. 180 days. One brutal truth about your startup idea.",
    steps: [
      {
        number: "01",
        title: "Describe Your Idea",
        description: "Tell the AI mentor about your startup concept, target market, and initial resources.",
        detail: "You start with a plain-language description of what you want to build, who you think will pay for it, and how much money and time you're putting on the line. The mentor asks follow-up questions to pin down your price point, your distribution channel, and what makes you different from the ten other people who already tried this. No business plan required — just an honest description of what you're thinking.",
      },
      {
        number: "02",
        title: "Market Reality Check",
        description: "Days 1-5: Get a brutally honest assessment of your idea's market fit and competitive landscape.",
        detail: "This is where the dream meets the data. The mentor pulls industry benchmarks for your category: typical customer acquisition costs, conversion rates, churn ranges, and what incumbents charge. You'll see your TAM shrink from \"everyone on the internet\" to the actual number of people who might pay you. Expect this phase to hurt — it's supposed to.",
      },
      {
        number: "03",
        title: "Launch & Initial Data",
        description: "Day 60-90: Simulate your product launch with realistic conversion rates and user acquisition costs.",
        detail: "You make your first real decisions: what to build first, where to launch, how much to spend on ads. The mentor simulates the first 30 days of traffic — and it's rarely pretty. Cold-start click-through rates of 0.5-2%, website-to-signup conversion of 1-3%. You'll see exactly how many visitors you need to get your first paying customer, and what that costs.",
      },
      {
        number: "04",
        title: "User Behavior Simulation",
        description: "Days 91-180: Watch how real users would behave — churn, engagement, word-of-mouth, and more.",
        detail: "By now you have some users. The hard part starts: retention. The mentor simulates monthly churn (typically 10-20% for early products), word-of-mouth growth, and what happens when you try to raise prices. You'll make decisions about hiring, ad spend, feature priorities — and watch each one move your runway number up or down.",
      },
      {
        number: "05",
        title: "Judgment Day",
        description: "Day 180: Face the final verdict. Did you make it? Or did you run out of runway?",
        detail: "The mentor gives you a structured second opinion: viable, marginal, or time to say goodbye. It's not a prediction — it's a data-backed assessment of whether your idea, executed the way you executed it, would have survived 180 days in the real market. If the verdict is bad, you just saved $30,000 and 14 months of your life. That's worth more than any success story.",
      },
    ],
    detail: {
      heading: "What is actually being computed",
      intro:
        "Every decision you make updates a small financial model. The mentor is not guessing — it tracks four numbers and shows you what your last move did to them.",
      items: [
        {
          title: "Unit economics",
          body: "Customer acquisition cost, average revenue per user and churn come from published ranges for early-stage consumer and SaaS products. Change your price and the payback period recalculates immediately.",
        },
        {
          title: "The cash ledger",
          body: "Hiring, ad spend and discounts all move cash. Runway is simply cash divided by monthly burn; when it drops below three months the mentor starts flagging it.",
        },
        {
          title: "The decision cadence",
          body: "One run gives you five decision points: positioning, pricing, launch channel, growth spend, and whether to raise. Each one closes a phase and moves the clock.",
        },
        {
          title: "Why the benchmarks lean pessimistic",
          body: "Ranges sit at the median-to-weak end of published data: acquisition costs more, conversion is lower, churn is stickier. The goal is to surface failure modes before you spend real money.",
        },
        {
          title: "What it cannot tell you",
          body: "It is not due diligence. Legal, regulatory, co-founder and team dynamics are out of scope, and the Day 180 verdict is a structured second opinion, not a prediction.",
        },
      ],
      closing:
        "You can ask the mentor why a number moved at any point in the conversation — the answer is part of the exercise.",
    },
  },
  pricing: {
    title: "Simple, Honest Pricing",
    subtitle: "Try it free. Pay only if you want to keep testing ideas.",
    plans: [
      {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Perfect for testing the waters",
        features: [
          "1 full simulation (180 days)",
          "AI mentor with real data",
          "5 decision points",
          "Basic final report",
        ],
        cta: "Start Free",
        popular: false,
      },
      {
        name: "Pro",
        price: "$9.99",
        period: "per month",
        description: "For serious idea validators",
        features: [
          "Unlimited simulations",
          "Advanced AI mentor mode",
          "Unlimited decision points",
          "Detailed analytics report",
          "Save & compare simulations",
          "Export results",
        ],
        cta: "Get Pro",
        popular: true,
      },
      {
        name: "Lifetime",
        price: "$49.99",
        period: "one-time",
        description: "Pay once, test forever",
        features: [
          "Everything in Pro",
          "Lifetime access",
          "All future updates",
          "Priority support",
        ],
        cta: "Get Lifetime",
        popular: false,
      },
    ],
    guarantee: "30-day money-back guarantee. No questions asked.",
    valueComparison: {
      title: "What's the alternative?",
      intro: "A single simulation costs less than one month of your cloud hosting bill. Here's what you'd risk in the real world instead:",
      items: [
        { real: "Quit your job", cost: "$60,000+ foregone salary" },
        { real: "Spend 6 months building", cost: "2500 hours of your life" },
        { real: "Launch without market validation", cost: "3–12 months of ad spend" },
        { real: "Find out your idea was wrong", cost: "Total savings burned" },
      ],
      conclusion: "Our simulator lets you find out all of this in 15 minutes. For $0.99 per run. That's the cheapest insurance you'll ever buy.",
    },
    faq: {
      heading: "Before you pay",
      items: [
        {
          q: "What counts as one simulation?",
          a: "One full run: five phases, from your idea to the Day 180 verdict. The free run is counted per browser, so a different device gets its own free run.",
        },
        {
          q: "Do I need an account?",
          a: "No. The free run needs nothing but a browser. If you upgrade, checkout creates the billing record for you.",
        },
        {
          q: "Where does my data live?",
          a: "Simulation state stays in your browser's local storage, so clearing site data deletes it. Prompts are sent to our AI provider to generate the mentor's replies — see the privacy policy for the full picture.",
        },
        {
          q: "Can I cancel?",
          a: "Yes. Pro is month to month; cancel in the billing portal and it stays active until the end of the period you already paid for.",
        },
        {
          q: "What if it turns out not to be useful?",
          a: "30-day money-back guarantee, no questions asked. Email us with your receipt and the charge is refunded.",
        },
        {
          q: "Why is the free tier limited to one run?",
          a: "Every run costs real AI inference. One complete run is enough to judge whether this tool sharpens your thinking before you pay for more.",
        },
      ],
    },
  },
  whoFor: {
    title: "Who is this for?",
    subtitle: "If you're nodding at any of these, this simulator was built for you.",
    items: [
      {
        icon: "💻",
        title: "Solo developers",
        description: "You can build it, but you're not sure if anyone will pay for it. Test the idea before you quit your job.",
      },
      {
        icon: "🎓",
        title: "First-time founders",
        description: "You've never run a business. Learn how cash burn, churn, and CAC actually work — without losing your savings.",
      },
      {
        icon: "🚀",
        title: "Side-project starters",
        description: "You're building on weekends. Simulate whether your side project has a shot at becoming your main thing.",
      },
      {
        icon: "💼",
        title: "9-5 refugees",
        description: "You hate your job and want out. Find out if your escape plan is viable — or if you're just jumping from one bad situation to another.",
      },
    ],
  },
  guides: {
    title: "Guides & Resources",
    subtitle: "Everything you need to know before you test your startup idea.",
    howItWorks: {
      title: "How the 180-Day Simulation Works",
      description: "A deep dive into the five phases, the data benchmarks behind every number, and what actually gets computed when you make a decision.",
    },
    simulator: {
      title: "Inside the Simulator",
      description: "How the AI mentor works, what benchmarks it uses, and what you'll experience across the four stages of a run.",
    },
    pricing: {
      title: "Pricing & Value",
      description: "What you get for free, what you get with Pro, and why a $9.99/month tool is cheaper than quitting your job.",
    },
    about: {
      title: "About Goodbye Startup",
      description: "Why we built this, our mission, and the values that guide how the AI mentor talks to you.",
    },
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Straight answers before you spend a minute or a dollar.",
    items: [
      {
        q: "What is a startup simulator?",
        a: "A startup simulator tests a business idea against realistic market data — traffic limits, conversion rates, churn, and monthly burn — compressed into a 180-day timeline. Goodbye Startup runs that simulation with an AI mentor instead of a spreadsheet.",
      },
      {
        q: "How does Goodbye Startup work?",
        a: "You describe your idea and your real starting position (capital, team, monthly burn). The AI mentor then walks you through five phases: market reality check, product launch, user behavior simulation, the day-180 financial crunch, and a final lessons report.",
      },
      {
        q: "Is Goodbye Startup free?",
        a: "Your first full 180-day simulation is free and requires no credit card. Unlimited simulations cost $9.99/month, or a one-time $49.99 lifetime pass.",
      },
      {
        q: "What data does the simulation use?",
        a: "Industry-median and deliberately pessimistic benchmarks: cold-start click-through rates of 0.5–2%, website-to-signup conversion of 1–3%, free-to-paid conversion of 0.5–2%, and monthly churn of 10–20% for early-stage products.",
      },
      {
        q: "Do I need to quit my job to test my idea?",
        a: "No. The simulator exists so you can test the idea before quitting. It shows whether your savings and runway would survive realistic customer-acquisition costs.",
      },
      {
        q: "Who is Goodbye Startup for?",
        a: "Aspiring founders — especially solo developers and first-time entrepreneurs targeting the US market — who have an idea but want hard evidence before risking their savings or a steady salary.",
      },
      {
        q: "How long does one simulation take?",
        a: "About 15–30 minutes of conversation, covering 180 simulated days across five phases and key decision points.",
      },
    ],
  },
  sim: {
    title: "Startup Simulator",
    day: "Day",
    of: "of 180",
    phase: {
      prologue: "Prologue",
      market: "Market Analysis",
      launch: "Launch Phase",
      growth: "Growth Phase",
      verdict: "Judgment Day",
    },
    stats: {
      cash: "Cash",
      runway: "Runway",
      users: "Users",
      revenue: "Revenue",
      morale: "Team Morale",
      burn: "Monthly Burn",
    },
    input: {
      placeholder: "Describe your decision or ask a question...",
      send: "Send",
    },
    thinking: "AI is thinking...",
    welcome: "Welcome to the Startup Pressure Test. In the next 180 days, we'll put your idea through the wringer of real market data. Forget the success stories — prepare for the brutal reality. Now, tell me about your startup idea.",
    guide: {
      heading: "How the 180-day startup simulation works",
      intro:
        "This is a pressure test, not a pitch deck. You describe an idea, make one decision at a time, and watch a model of your market respond. Cash, runway, users, churn and morale move together, so a win in one area usually costs you in another.",
      inputTitle: "What you bring on Day 1",
      inputItems: [
        "Your idea in plain language — no business plan required",
        "A rough starting budget and price point",
        "Decisions at each stage: positioning, pricing, hiring, spending",
      ],
      outputTitle: "What the run gives back",
      outputItems: [
        "A cash and runway ledger that updates after every decision",
        "Market feedback on acquisition cost, pricing power and churn",
        "A Day 180 verdict: viable, marginal, or time to say goodbye",
      ],
      realismTitle: "Why the numbers are bounded",
      realism:
        "Ranges come from published benchmarks for early-stage consumer and SaaS businesses, not from an optimistic narrative. The model is deliberately harsh at the edges: acquisition costs more than founders expect, churn compounds, and every hire is sticky.",
      benchmarksTitle: "The benchmarks behind the numbers",
      benchmarksIntro:
        "When the mentor tells you your conversion rate is low, it's not making it up. These are the published ranges it draws from:",
      benchmarks: [
        { label: "Cold-start CTR (ads)", value: "0.5% – 2%" },
        { label: "Website → signup conversion", value: "1% – 3%" },
        { label: "Free → paid conversion", value: "0.5% – 2%" },
        { label: "Monthly churn (early product)", value: "10% – 20%" },
        { label: "Customer acquisition cost (B2C)", value: "$5 – $50" },
        { label: "Average revenue per user / month", value: "$5 – $30" },
      ],
      stagesTitle: "What you'll go through",
      stages: [
        { phase: "Prologue (Day 0)", description: "You describe your idea, your starting cash, and your target customer. The mentor sets baseline assumptions and asks you to confirm them." },
        { phase: "Market Analysis (Days 1–5)", description: "The mentor crunches your TAM, compares you to competitors, and tells you whether your price point is realistic. This is where you'll find out if the market is big enough — or if it's already saturated." },
        { phase: "Launch Phase (Days 60–90)", description: "You make your first real decisions: what to build, where to launch, how much to spend. The mentor simulates your first 30 days of traffic and shows you exactly how many visitors you need to get your first paying customer." },
        { phase: "Growth Phase (Days 91–180)", description: "Now you have users. The hard part starts: retention, churn, hiring, ad spend. Every decision moves your runway number up or down. By Day 180, you'll know whether your idea can survive — or whether it's time to say goodbye." },
      ],
      note:
        "One free run per browser, no account needed. Your inputs stay on your device until you decide to upgrade.",
    },
    paywall: {
      title: "Want to try another idea?",
      description: "You've used your free simulation. Upgrade to Pro to test unlimited startup ideas and become a better founder.",
      cta: "Upgrade to Pro — $9.99/mo",
      or: "or",
      lifetime: "Get Lifetime Access — $49.99",
    },
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
    subtitle: "We're here to save you from the #1 startup killer: bad ideas.",
    mission: {
      title: "Our Mission",
      description: "Every year, millions of people quit their jobs, drain their savings, and pour years of their lives into startup ideas that were doomed from the start. We believe that before you take the leap, you deserve to know what you're really jumping into. Goodbye Startup uses AI and real market data to simulate the startup journey — so you can learn the hard lessons without paying the hard price.",
    },
    why: {
      title: "Why We Built This",
      description: "We've seen too many friends and colleagues burn out chasing startup dreams that were never realistic. The problem isn't lack of effort — it's lack of honest feedback. Most startup advice is either hype or useless platitudes. We wanted to create something that tells you the truth, even when it hurts.",
    },
    values: {
      title: "Our Values",
      items: [
        {
          icon: "🎯",
          title: "Radical Honesty",
          description: "We don't sugarcoat. If your idea sucks, we'll tell you — and why.",
        },
        {
          icon: "📊",
          title: "Data Over Hype",
          description: "Every simulation is based on real industry data, not motivational quotes.",
        },
        {
          icon: "🌱",
          title: "Learning Over Failure",
          description: "Failure in simulation is just learning. The goal is to make you better.",
        },
      ],
    },
  },
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: August 5, 2026",
    sections: [
      {
        title: "Information We Collect",
        content: "We collect information you provide directly to us, such as when you use our simulator, create an account, or contact us for support. This may include your email address, simulation data, and any other information you choose to provide.",
      },
      {
        title: "How We Use Your Information",
        content: "We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience. We do not sell your personal information to third parties.",
      },
      {
        title: "AI & Data Processing",
        content: "Your simulation conversations are processed by our AI partner (Google Gemini) to generate responses. We do not use your conversations to train AI models without your explicit consent.",
      },
      {
        title: "Data Security",
        content: "We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.",
      },
      {
        title: "Your Choices",
        content: "You can access, update, or delete your personal information at any time by contacting us. You can also opt out of receiving promotional communications from us by following the instructions in those messages.",
      },
      {
        title: "Contact Us",
        content: "If you have any questions about this Privacy Policy, please contact us at privacy@goodbye.help.",
      },
    ],
  },
};

export type Translations = typeof en;
