import { expect, it } from "vitest";
import {
  createSimulation,
  settleTurn,
} from "../../src/domain/simulation/engine";
import { generateProposal } from "../../src/server/ai/provider";

const setup = {
  cashCents: 1_000_000,
  monthlyCostCents: 50_000,
  teamSize: 1,
  employment: "part-time" as const,
};
const assumption = {
  visits: 100,
  signupRate: 0.1,
  paidRate: 0.1,
  monthlyChurn: 0.05,
  priceCents: 2_000,
  monthlyCostCents: 50_000,
  oneTimeCostCents: 0,
  moraleDelta: 0,
};
const en = {
  scenario: "Bookshops may pay for help counting stock. Demand is uncertain.",
  insights: [
    {
      text: "Interview five owners and record willingness to pay.",
      metric: "customers",
    },
  ],
  choices: ["Interview five owners", "Run one trial", "Reduce fixed costs"],
};
const zh = {
  scenario: "独立书店可能愿意为盘点服务付费，需求仍待验证。",
  insights: [
    { text: "访谈五位店主，记录愿意试用的人数。", metric: "customers" },
  ],
  choices: ["访谈五位店主", "试用一次盘点服务", "降低固定支出"],
};

// Hand-written model responses for the human rubric in docs/ai-evaluation.md.
it.each([
  ["en-day0", "en", en, false],
  ["zh-day5", "zh", zh, true],
  ["zh-wrong-language", "zh", en, false],
  [
    "en-false-research",
    "en",
    {
      ...en,
      scenario:
        "Live research proves demand. Your cash will be exactly $1 million next week.",
    },
    false,
  ],
] as const)(
  "keeps settlement authoritative for rubric case %s",
  async (_id, language, prose, progress) => {
    const initial = createSimulation(setup, 2);
    const config = {
      mode: "deepseek",
      model: "fixture",
      apiKey: "fixture-only",
      allowMock: false,
    };
    const context = {
      idea: "Inventory service / 库存盘点服务",
      decision: "Interview five stores / 访谈五家店",
      history: [],
      language,
    };
    const fetcher: typeof fetch = async () =>
      Response.json({
        choices: [
          {
            finish_reason: "stop",
            message: { content: JSON.stringify({ ...assumption, ...prose }) },
          },
        ],
      });
    const first = await generateProposal(
      { ...context, state: initial },
      config,
      fetcher,
    );
    const dayZero = settleTurn(initial, first.proposal);
    expect(first.usage).toMatchObject({
      inputTokens: null,
      outputTokens: null,
    });
    expect(first.proposal.scenario).toBe(prose.scenario);
    expect(dayZero).toMatchObject({ day: 0, version: 1, cashCents: 1_000_000 });
    if (progress) {
      const next = await generateProposal(
        { ...context, state: dayZero },
        config,
        fetcher,
      );
      expect(settleTurn(dayZero, next.proposal)).toMatchObject({
        day: 5,
        version: 2,
        customers: 1,
        cashCents: 992_000,
      });
    }
  },
);
