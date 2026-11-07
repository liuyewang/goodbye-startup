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
    subtitle: "Test your startup idea in 15 minutes. The AI compresses 180 days of market reality into one conversation — so you find out if it works before you quit your job.",
    ctaPrimary: "Simulate 180 Days in 15 Min — Free",
    ctaSecondary: "How It Works",
    stats: {
      days: "180 Days",
      daysDesc: "compressed into 15 min",
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
  blog: {
    title: "Blog",
    subtitle: "Hard data about startups, validation, and why most ideas fail before they even start.",
    posts: {
      whyFail: {
        title: "Why 90% of Startups Fail — And What the Other 10% Do Differently",
        description: "It's not about effort or luck. The data shows exactly where most founders go wrong — and what the successful ones do instead.",
        intro: "You've heard the statistic: 90% of startups fail. But what does that actually mean? And more importantly, why? If you dig into the data, the failure reasons are surprisingly consistent — and most of them are predictable before you write a single line of code.",
        section1: {
          title: "Reason #1: No market need (42%)",
          body: "The #1 reason startups fail isn't competition or timing or funding. It's that nobody wanted the product. CB Insights analyzed 101 post-mortems and found that 42% of failed startups cited 'no market need' as the cause. That means almost half of founders built something nobody asked for — and spent 6-12 months doing it.",
        },
        section2: {
          title: "Reason #2: Ran out of cash (29%)",
          body: "The second biggest killer is simple math: burn rate exceeds runway. Most founders underestimate how long it takes to reach product-market fit — and how much it costs to get there. Typical underestimates:",
          points: [
            "Customer acquisition cost is 2-5x higher than they planned",
            "Time to first paying customer is 3-6x longer",
            "Churn is worse than the optimistic spreadsheet said",
            "Hiring takes longer and costs more than expected",
          ],
        },
        section3: {
          title: "Reason #3: Wrong team (23%)",
          body: "Founders overestimate their ability to do everything alone. By the time they realize they need help, they've already burned through half their runway. The successful 10% either start with a co-founder who fills their gaps, or they know exactly what they don't know — and hire for it early.",
        },
        section4: {
          title: "Reason #4: Got outcompeted (19%)",
          body: "Most founders think competition is about features. It's not. Competition is about distribution. You can build a better product, but if the incumbent already has 10x your users and 100x your ad budget, you're not winning on merit. The successful 10% pick markets where incumbents are lazy — not where they're strong.",
        },
        section5: {
          title: "What the 10% do differently",
          body: "They validate first, build second. They spend $50 on a landing page before spending $50,000 on development. They talk to 50 potential customers before writing a single line of code. They know their CAC before they launch their first ad. Most importantly: they test their assumptions in 15 minutes, not 6 months. That's what a startup simulator does.",
        },
        cta: {
          title: "Test your idea before you build it",
          subtitle: "Run a free 180-day simulation and find out if your idea survives real market data.",
        },
      },
      howMuchMoney: {
        title: "How Much Money Do You Actually Need to Start a Startup?",
        description: "The $30k vs $100k debate is missing the point. Here's what the real numbers look like for solo founders in 2026.",
        intro: "Everyone asks this question. And everyone gets the answer wrong. The truth is: the amount of money you need depends almost entirely on what kind of startup you're building — and what you're willing to do without. Here's the breakdown.",
        section1: {
          title: "The $10k bootstrap MVP",
          body: "If you're a solo developer building a SaaS tool, you can launch for under $10k. This is the 'build in public on weekends' model. You keep your day job, ship a minimal product, and see if anyone pays. Most successful solo founders started here.",
        },
        section2: {
          title: "What you actually spend money on",
          body: "The biggest costs aren't what you think. Here's where the money actually goes:",
          items: [
            { name: "Cloud hosting (first 6 months)", cost: "$200 – $600" },
            { name: "Domain + email + basic tools", cost: "$100 – $300" },
            { name: "Ads to test demand", cost: "$1,000 – $5,000" },
            { name: "Design (if you can't do it yourself)", cost: "$500 – $2,000" },
            { name: "Your living expenses (if you quit your job)", cost: "$2,000 – $4,000 / month" },
          ],
        },
        section3: {
          title: "The real question: how much runway do you need?",
          body: "Don't ask 'how much money do I need'. Ask 'how many months can I survive without revenue?'. The answer should be 12-18 months. Because that's how long it takes most solo founders to reach product-market fit — if they ever do. If you have $30k and burn $2k/month, you have 15 months. That's barely enough.",
        },
        section4: {
          title: "The hidden costs nobody tells you about",
          body: "The spreadsheet always forgets these: your own time (opportunity cost of not working your day job), slow seasons (revenue isn't linear), technical debt (the MVP you shipped in 2 weeks takes 3 months to fix), and churn (losing 15% of your users every month means you need constant new acquisition).",
        },
        section5: {
          title: "How to calculate your real number",
          body: "Take your monthly burn rate. Multiply by 18. That's your minimum. Then add 50% buffer for the unexpected. That's your real number. If it scares you — good. That means you're taking it seriously. Now test whether your idea can actually make that money back before you spend it. That's what a startup simulation does.",
        },
        cta: {
          title: "Calculate your runway in 15 minutes",
          subtitle: "Run a free simulation and see if your idea can survive 180 days of real market data.",
        },
      },
      churn: {
        title: "How to Reduce Churn Rate: 5 Things That Actually Work",
        description: "Churn kills more startups than competition. Here are the real benchmarks and what actually moves the needle.",
        intro: "You spend $50 to get a customer, they stay for 2 months, then they leave. That's the silent killer. Most founders obsess over acquisition and ignore churn — but churn is what determines whether you're building a business or a leaky bucket. Here's what actually works.",
        section1: {
          title: "What's a 'good' churn rate, anyway?",
          body: "For B2C SaaS, 3-5% monthly churn is typical for early-stage products. Anything above 7% monthly means you're losing more customers than you can replace. At 10% monthly churn, your entire customer base turns over every 10 months — you're running on a treadmill. The best products get it under 2%.",
        },
        section2: {
          title: "5 things that actually reduce churn",
          body: "Not the generic 'improve onboarding' advice. These are the specific levers that move the number:",
          tips: [
            "The first 72 hours matter more than anything. If a user doesn't experience value in their first session, they're gone forever. Design for the 'aha moment' in the first 5 minutes.",
            "Send a 30-day check-in email. Just one. Ask 'is this working for you?' You'll catch half the churn before it happens.",
            "Annual plans. 20% discount for annual prepayment cuts churn by 50% — because people don't cancel annual subscriptions.",
            "Reduce the number of features. Every extra feature adds cognitive load. Fewer features = more focused users = higher retention.",
            "Talk to 5 churned users every month. You'll learn more in 5 interviews than from any churn analysis dashboard.",
          ],
        },
        section3: {
          title: "The hidden cost of ignoring churn",
          body: "If you have 100 users and 5% monthly churn, you lose 5 users per month. You need 5 new users just to stay flat. At 10% churn, you need 10 new users per month. At that rate, acquisition costs eat up all your revenue. The math only works when churn is below 3%.",
        },
        section4: {
          title: "Test your churn assumption before you launch",
          body: "Most founders build an optimistic spreadsheet that assumes 2% monthly churn. The reality is usually 5-7%. That difference means your business model works or it doesn't. A startup simulator uses realistic churn benchmarks — not your best-case guess.",
        },
        cta: {
          title: "Test your churn math in 15 minutes",
          subtitle: "Run a free simulation and see if your retention assumptions actually hold up.",
        },
      },
      cac: {
        title: "Customer Acquisition Cost Benchmarks by Channel (2026)",
        description: "How much does it actually cost to get a paying customer? The numbers are very different from what founders expect.",
        intro: "CAC is the single most important number for early-stage startups. Get it right and you're building a business. Get it wrong and you're just buying users. Here's what the real numbers look like by channel — and how to calculate your break-even.",
        section1: {
          title: "Why CAC kills 29% of startups",
          body: "Most founders underestimate CAC by 3-5x. They look at a $5 CPC and think 'that's cheap'. They forget that 1% of visitors convert to sign-ups, and only 1-2% of sign-ups convert to paying customers. That $5 click becomes a $250-$500 paying customer. If your product makes $10/month, you need 25-50 months just to break even.",
        },
        section2: {
          title: "Real CAC benchmarks by channel",
          body: "These are published ranges for early-stage B2C and SaaS products:",
          channels: [
            { name: "Google Ads (search)", cost: "$50 – $200" },
            { name: "Facebook/Instagram ads", cost: "$20 – $80" },
            { name: "TikTok ads", cost: "$10 – $40" },
            { name: "Content marketing (SEO)", cost: "$5 – $20 (time cost)" },
            { name: "Product Hunt launch", cost: "$0 – $50 (one-time)" },
            { name: "Word-of-mouth / referrals", cost: "$0 – $5" },
          ],
        },
        section3: {
          title: "The LTV:CAC ratio that matters",
          body: "The golden rule: LTV should be 3x your CAC. If a customer stays for 6 months and pays $10/month, their LTV is $60. That means your CAC needs to be under $20. Anything higher and you're losing money on every customer you acquire.",
        },
        section4: {
          title: "How to reduce CAC without killing growth",
          body: "The fastest way to reduce CAC is not to spend less on ads — it's to improve conversion. Going from 1% to 3% conversion cuts your CAC by 2/3. The second fastest: build something worth sharing so word-of-mouth starts contributing. Most founders never test either of these before scaling ads.",
        },
        section5: {
          title: "Calculate your real CAC before you spend a dollar",
          body: "Take your planned ad spend. Divide by your expected conversion rate. That's your CAC. Then multiply by 3 to see if your LTV can handle it. If it doesn't fit, you have two options: raise your prices, or improve your conversion rate. The simulator does this math for you — with realistic benchmarks, not optimistic guesses.",
        },
        cta: {
          title: "Calculate your real CAC in 15 minutes",
          subtitle: "Run a free simulation and see if your acquisition math actually works.",
        },
      },
    },
  },
  guide: {
    benchmarks: {
      title: "Startup Cost Benchmarks You Need to Know",
      subtitle: "The real numbers behind early-stage startups — not the optimistic ones.",
      intro: "Every founder thinks their product will beat the averages. The problem is: most don't. These are the published ranges for early-stage consumer and SaaS products. If your plan assumes better than median, you're betting on luck, not math.",
      items: [
        {
          metric: "Cold-start CTR (ads)",
          range: "0.5% – 2%",
          why: "If you're spending $500 on ads, expect 5-20 clicks per 1000 impressions. Most founders overestimate this by 5-10x.",
        },
        {
          metric: "Website → signup conversion",
          range: "1% – 3%",
          why: "For every 100 visitors, 1-3 will sign up for your waitlist. Most founders assume 10%.",
        },
        {
          metric: "Free → paid conversion",
          range: "0.5% – 2%",
          why: "Out of every 100 free users, 0.5-2 will pay. That means you need 500-2000 free users to get 10 paying customers.",
        },
        {
          metric: "Monthly churn (early product)",
          range: "10% – 20%",
          why: "If 15% of your users leave every month, your average subscriber lifetime is ~6.7 months. Your LTV is much lower than you think.",
        },
        {
          metric: "Customer acquisition cost (B2C)",
          range: "$5 – $50",
          why: "Getting one user to sign up costs $5-$50. Getting one to pay costs 10x more. If your price is $10/month and CAC is $50, you need 5 months just to break even.",
        },
        {
          metric: "Average revenue per user / month",
          range: "$5 – $30",
          why: "Most consumer products make $5-$15 per user per month. SaaS is higher, but churn is worse. Be honest about which category you're in.",
        },
        {
          metric: "Average runway (solo founder)",
          range: "12 – 18 months",
          why: "With $30k savings and $2k/month burn, you have 15 months. Most founders run out of cash 2-3 months before product-market fit.",
        },
      ],
      howToUse: {
        title: "How to use these benchmarks",
        body: "Don't just read these numbers — stress-test your plan against them. If your financial model assumes better than the median, ask yourself: why will you beat the odds?",
        tips: [
          "If your conversion rate assumption is above 3%, you're probably wrong.",
          "If your CAC is below $5, you're probably not counting all the time you spend on distribution.",
          "If your churn is below 5% monthly, that's a mature product number, not an early-stage one.",
          "Run the numbers with pessimistic ranges, not optimistic ones. That's what the simulator does.",
        ],
      },
      cta: {
        title: "Test your plan against real benchmarks",
        subtitle: "The simulator uses these exact ranges. See if your idea survives.",
      },
    },
    simulation: {
      title: "The 180-Day Startup Simulation Explained",
      subtitle: "What happens in each phase, what numbers you'll see, and what decisions you'll make.",
      phases: [
        {
          name: "Prologue (Day 0)",
          description: "You describe your idea in plain language. The AI mentor asks follow-up questions to pin down your target customer, price point, and starting budget. This sets the baseline assumptions for the entire simulation.",
          outputs: [
            "A baseline financial model (cash, burn rate, runway)",
            "Your target customer profile",
            "Your price point and revenue model",
          ],
        },
        {
          name: "Market Reality Check (Days 1-5)",
          description: "The mentor pulls industry benchmarks for your category. You'll see your TAM shrink from 'everyone' to the actual number of people who might pay you. This phase is deliberately uncomfortable — it's supposed to be.",
          outputs: [
            "Your real TAM, SAM, and SOM",
            "Competitive landscape analysis",
            "Whether your price point is realistic",
          ],
        },
        {
          name: "Launch Phase (Days 60-90)",
          description: "You make your first real decisions: what to build first, where to launch, how much to spend on ads. The mentor simulates your first 30 days of traffic with realistic conversion rates.",
          outputs: [
            "Cold-start traffic numbers (CTR, conversion rates)",
            "Your first 10-100 users",
            "Customer acquisition cost (CAC)",
          ],
        },
        {
          name: "Growth Phase (Days 91-180)",
          description: "Now you have users. The hard part starts: retention, churn, hiring, ad spend. Every decision moves your runway number up or down. By Day 180, you'll know whether your idea can survive.",
          outputs: [
            "Monthly churn and LTV",
            "Cash runway after every decision",
            "Hiring vs. solo tradeoffs",
          ],
        },
        {
          name: "Judgment Day (Day 180)",
          description: "The final verdict: viable, marginal, or time to say goodbye. It's not a prediction — it's a data-backed assessment of whether your idea, executed the way you executed it, would have survived 180 days in the real market.",
          outputs: [
            "Final financial summary",
            "What worked and what didn't",
            "Specific recommendations for iteration",
          ],
        },
      ],
      cta: {
        title: "Ready to run your own simulation?",
        subtitle: "15 minutes. 180 simulated days. Free to try.",
      },
    },
    validation: {
      title: "How to Validate a Startup Idea Before You Build Anything",
      subtitle: "Most founders skip this step. Here's why it's the most important thing you'll do.",
      section1: {
        title: "Why validation beats building",
        body: "The most expensive thing you'll ever build is a product nobody wants. Average time to build an MVP: 3-6 months. Average cost: $15,000-$50,000. Average success rate: 10%. That means 9 out of 10 founders waste months of their lives and tens of thousands of dollars on something that could have been tested for free in an afternoon.",
      },
      section2: {
        title: "The 5-step validation framework",
        body: "Before writing a single line of code, ask these questions:",
        points: [
          "Who exactly is the customer? Not 'everyone' — name a specific person with a specific problem.",
          "How are they solving this problem today? If the answer is 'they aren't', that's not a win — it means the problem isn't painful enough.",
          "How much would they pay? Don't ask them — show them pricing and see if they walk away.",
          "How will you reach them? If your answer is 'social media', you haven't thought about distribution.",
          "Can you explain it in one sentence? If it takes more than 30 seconds, your positioning is confused.",
        ],
      },
      section3: {
        title: "The landing page test",
        body: "The cheapest validation is a $50 landing page that says what you'll build, how much it costs, and an email signup form. If you can't get 50 sign-ups in 2 weeks with $100 of ads, your idea isn't resonating. This costs you $150 and 2 weeks — not $50,000 and 6 months.",
      },
      section4: {
        title: "The simulator advantage",
        body: "A landing page test tells you if people are curious. It doesn't tell you if they'll pay, how long they'll stay, or what your real acquisition cost is. A startup simulator runs 180 days of market dynamics in 15 minutes — conversion rates, churn, CAC, burn — so you can see the full picture before you spend real money.",
      },
      section5: {
        title: "What to do next",
        body: "Pick your shakiest assumption. Is it that people will pay? That you can acquire customers cheaply? That churn won't kill you? Test that one thing first. Everything else is noise until that assumption is proven.",
      },
      cta: {
        title: "Test your idea in 15 minutes",
        subtitle: "Run a free 180-day simulation and see if your idea survives real market data.",
      },
    },
  },
  guides: {
    title: "Guides & Resources",
    subtitle: "Everything you need to know before you test your startup idea.",
    intro:
      "These four pages go deeper than the landing page: what the model actually computes, how the mentor reasons, what you pay for, and why this exists. If you only read one, start with the simulation walkthrough.",
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
      {
        q: "Is the AI mentor accurate?",
        a: "It's not a crystal ball — it's a structured second opinion. The numbers come from published industry ranges, and the conclusions are deliberately pessimistic to surface failure modes before you spend real money.",
      },
      {
        q: "Can I run multiple simulations to test different ideas?",
        a: "Yes — but the free tier gives you one run. Upgrade to Pro for unlimited simulations so you can compare pricing, positioning, and go-to-market strategies side by side.",
      },
      {
        q: "What happens if the simulation says my idea will fail?",
        a: "That's the best outcome. You just saved $30,000 and 14 months of your life. The mentor will tell you exactly which part of the idea is weakest — market size, pricing, acquisition cost, or churn — so you can iterate before building anything.",
      },
    ],
  },
  examples: {
    title: "What does a simulation actually look like?",
    subtitle: "Here's what happens when you run a typical idea through the 180-day pressure test.",
    items: [
      {
        idea: "Idea: A weather app for drone pilots",
        verdict: "Marginal — time to pivot to B2B",
        details: "TAM: ~140,000 US drone pilots. CAC: $25 per sign-up. Conversion: 1.2%. After 180 days: 240 users, 4 paying customers, $120 MRR. Burn: $2,200/mo. Runway left: 11 months. Verdict: consumer freemium won't work. Pivot to selling to inspection companies at $499/seat.",
      },
      {
        idea: "Idea: A productivity tool for remote teams",
        verdict: "Viable — but tight margin",
        details: "TAM: ~500,000 remote team leads. CAC: $45 per sign-up. Conversion: 2.1%. After 180 days: 1,800 users, 36 paying teams, $1,440 MRR. Burn: $3,000/mo. Runway left: 9 months. Verdict: works if you can keep churn below 8% monthly. Anything higher and you're underwater.",
      },
      {
        idea: "Idea: A meal-kit delivery service",
        verdict: "Dead on arrival",
        details: "TAM: large, but CAC: $80 per customer. Conversion: 0.8%. After 180 days: 120 users, 12 paying customers, $480 MRR. Burn: $8,000/mo (ingredients + delivery). Runway left: 4 months. Verdict: unit economics don't work. Grocery delivery is a scale game — solo founders can't win.",
      },
    ],
  },
  myths: {
    title: "5 myths that kill startups",
    subtitle: "Every founder believes at least one of these. The simulator tests whether your idea survives them.",
    items: [
      {
        myth: "If I build it, they will come",
        truth: "Cold-start traffic doesn't happen by magic. Typical conversion from a landing page visit to sign-up is 1–3%. You need 10,000 visitors to get 100 sign-ups — and 1–3 paying customers from that.",
      },
      {
        myth: "My friends like it, so customers will pay",
        truth: "Friends are biased. Early-stage products see 10–20% monthly churn. If your retention isn't better than that, your product isn't solving a real problem.",
      },
      {
        myth: "I can bootstrap forever",
        truth: "Average runway for a solo founder is 14 months. Burn rate includes hosting, ads, and opportunity cost — not just your salary. Most founders run out of cash before product-market fit.",
      },
      {
        myth: "A great product will win",
        truth: "Features get copied in 3 weeks. The real moat is distribution — how you get in front of the right people. Most good products fail because nobody hears about them.",
      },
      {
        myth: "I'll know it when I see it",
        truth: "Founders say they'll quit when they know it's not working. The data says most founders keep going 6+ months after the numbers say they should stop. The simulator forces the reality check earlier.",
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
    welcome: "Welcome to the Startup Pressure Test. In the next 15 minutes, we'll compress 180 days of market reality into one conversation. Forget the success stories — prepare for the brutal truth. Now, tell me about your startup idea.",
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
