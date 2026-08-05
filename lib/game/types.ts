export type GamePhase = "prologue" | "market" | "launch" | "growth" | "verdict";

export interface GameStats {
  cash: number;
  runway: number; // in months
  users: number;
  revenue: number; // monthly revenue
  morale: number; // 0-100
  burn: number; // monthly burn rate
}

export interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: number;
}

export interface GameState {
  day: number;
  phase: GamePhase;
  stats: GameStats;
  messages: Message[];
  isGameOver: boolean;
  simulationCount: number;
}

export const INITIAL_STATS: GameStats = {
  cash: 10000,
  runway: 6,
  users: 0,
  revenue: 0,
  morale: 80,
  burn: 1500,
};

export const INITIAL_STATE: GameState = {
  day: 0,
  phase: "prologue",
  stats: INITIAL_STATS,
  messages: [],
  isGameOver: false,
  simulationCount: 0,
};
