"use client";

import { GameProvider } from "@/lib/game/GameContext";
import SimulatorContent from "@/components/sim/SimulatorContent";

export default function SimulatorPage() {
  return (
    <GameProvider>
      <SimulatorContent />
    </GameProvider>
  );
}
