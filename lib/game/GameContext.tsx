"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { GameState, GameStats, Message, INITIAL_STATE } from "./types";
import { loadGameState, saveGameState, clearGameState, getSimulationCount, incrementSimulationCount } from "./storage";

interface GameContextType {
  state: GameState;
  isLoading: boolean;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  updateStats: (stats: Partial<GameStats>) => void;
  setDay: (day: number) => void;
  setPhase: (phase: GameState["phase"]) => void;
  setGameOver: (isOver: boolean) => void;
  resetGame: () => void;
  simulationCount: number;
  hasUsedFreeSimulation: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [simulationCount, setSimulationCount] = useState(0);

  // Load saved state on mount
  useEffect(() => {
    const saved = loadGameState();
    const count = getSimulationCount();
    setSimulationCount(count);

    if (saved) {
      setState(saved);
    }
    setIsLoading(false);
  }, []);

  // Save state on change
  useEffect(() => {
    if (!isLoading) {
      saveGameState(state);
    }
  }, [state, isLoading]);

  const addMessage = useCallback((message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
  }, []);

  const updateStats = useCallback((stats: Partial<GameStats>) => {
    setState((prev) => ({
      ...prev,
      stats: { ...prev.stats, ...stats },
    }));
  }, []);

  const setDay = useCallback((day: number) => {
    setState((prev) => ({ ...prev, day }));
  }, []);

  const setPhase = useCallback((phase: GameState["phase"]) => {
    setState((prev) => ({ ...prev, phase }));
  }, []);

  const setGameOver = useCallback((isOver: boolean) => {
    setState((prev) => ({ ...prev, isGameOver: isOver }));
  }, []);

  const resetGame = useCallback(() => {
    clearGameState();
    const count = incrementSimulationCount();
    setSimulationCount(count);
    setState({
      ...INITIAL_STATE,
      simulationCount: count,
    });
  }, []);

  const hasUsedFreeSimulation = simulationCount >= 1;

  return (
    <GameContext.Provider
      value={{
        state,
        isLoading,
        addMessage,
        updateStats,
        setDay,
        setPhase,
        setGameOver,
        resetGame,
        simulationCount,
        hasUsedFreeSimulation,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
