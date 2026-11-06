"use client";

import { GameProvider } from "@/lib/game/GameContext";
import SimulatorContent from "@/components/sim/SimulatorContent";
import SimulatorGuide from "@/components/sim/SimulatorGuide";

export default function SimulatorPage() {
  return (
    <>
      <GameProvider>
        <SimulatorContent />
      </GameProvider>
      <SimulatorGuide />
    </>
  );
}
