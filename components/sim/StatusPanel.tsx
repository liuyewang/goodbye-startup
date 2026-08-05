"use client";

import { useGame } from "@/lib/game/GameContext";
import { useI18n } from "@/lib/i18n";
import type { GamePhase } from "@/lib/game/types";

function formatCurrency(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value}`;
}

function getPhaseLabel(phase: GamePhase, t: ReturnType<typeof useI18n>["t"]): string {
  const labels: Record<GamePhase, string> = {
    prologue: t.sim.phase.prologue,
    market: t.sim.phase.market,
    launch: t.sim.phase.launch,
    growth: t.sim.phase.growth,
    verdict: t.sim.phase.verdict,
  };
  return labels[phase];
}

function getPhaseColor(phase: GamePhase): string {
  const colors: Record<GamePhase, string> = {
    prologue: "bg-dark-400",
    market: "bg-primary-500",
    launch: "bg-accent-500",
    growth: "bg-green-500",
    verdict: "bg-red-500",
  };
  return colors[phase];
}

export function StatusPanel() {
  const { state } = useGame();
  const { t } = useI18n();

  const progress = Math.min((state.day / 180) * 100, 100);

  const stats = [
    {
      label: t.sim.stats.cash,
      value: formatCurrency(state.stats.cash),
      icon: "💰",
      color: "text-green-600",
    },
    {
      label: t.sim.stats.runway,
      value: `${state.stats.runway} mo`,
      icon: "📅",
      color: state.stats.runway <= 2 ? "text-red-500" : "text-primary-600",
    },
    {
      label: t.sim.stats.users,
      value: state.stats.users.toLocaleString(),
      icon: "👥",
      color: "text-blue-600",
    },
    {
      label: t.sim.stats.revenue,
      value: formatCurrency(state.stats.revenue),
      icon: "📈",
      color: "text-green-600",
    },
    {
      label: t.sim.stats.morale,
      value: `${state.stats.morale}%`,
      icon: "😊",
      color: state.stats.morale < 30 ? "text-red-500" : "text-accent-600",
    },
    {
      label: t.sim.stats.burn,
      value: formatCurrency(state.stats.burn),
      icon: "🔥",
      color: "text-red-500",
    },
  ];

  return (
    <div className="bg-white border-b border-dark-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Day and Phase */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-dark-900">
              {t.sim.day} {state.day}
              <span className="text-sm font-normal text-dark-400 ml-1">
                {t.sim.of}
              </span>
            </span>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${getPhaseColor(state.phase)}`} />
              <span className="text-sm font-medium text-dark-600">
                {getPhaseLabel(state.phase, t)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-dark-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full gradient-bg transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="bg-dark-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">{stat.icon}</span>
                <span className="text-xs text-dark-500">{stat.label}</span>
              </div>
              <div className={`text-lg font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
