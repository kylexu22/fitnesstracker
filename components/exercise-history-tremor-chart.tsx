"use client";

import { LineChart } from "@tremor/react";

type ExerciseHistoryPoint = {
  started_at: string | Date;
  set_count: number;
  max_reps: number;
  max_weight: string | null;
};

type ExerciseHistoryTremorChartProps = {
  history: ExerciseHistoryPoint[];
};

export function ExerciseHistoryTremorChart({ history }: ExerciseHistoryTremorChartProps) {
  const chartData = history
    .slice()
    .reverse()
    .map((item) => {
      const date = item.started_at instanceof Date ? item.started_at : new Date(item.started_at);
      return {
        date: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date),
        reps: item.max_reps,
        weight: item.max_weight ? Number(item.max_weight) : 0,
        sets: item.set_count,
      };
    });

  return (
    <div className="mt-3">
      <h3 className="text-sm font-medium text-muted">Exercise Progress</h3>
      <LineChart
        className="chart-theme exercise-history-chart mt-2 h-64"
        data={chartData}
        index="date"
        categories={["weight", "reps", "sets"]}
        colors={["violet", "emerald", "cyan"]}
        yAxisWidth={44}
        showLegend
        valueFormatter={(value: number) => value.toLocaleString()}
      />
    </div>
  );
}
