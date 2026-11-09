import { GameState } from "./types";

const STORAGE_KEY = "gs_game_state";
const SIMULATION_COUNT_KEY = "gs_simulation_count";

/**
 * Get game state from localStorage
 */
export function loadGameState(): GameState | null {
  if (typeof window === "undefined") return null;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as GameState;
    }
  } catch (e) {
    console.error("Failed to load game state:", e);
  }

  return null;
}

/**
 * Save game state to localStorage
 */
export function saveGameState(state: GameState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save game state:", e);
  }
}

/**
 * Clear game state from localStorage
 */
export function clearGameState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get simulation count
 */
export function getSimulationCount(): number {
  if (typeof window === "undefined") return 0;

  try {
    const count = localStorage.getItem(SIMULATION_COUNT_KEY);
    return count ? parseInt(count, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * Increment simulation count
 */
export function incrementSimulationCount(): number {
  if (typeof window === "undefined") return 0;

  const count = getSimulationCount() + 1;
  localStorage.setItem(SIMULATION_COUNT_KEY, count.toString());
  return count;
}

/**
 * Check if user has used their free simulation
 */
export function hasUsedFreeSimulation(): boolean {
  return getSimulationCount() >= 1;
}
