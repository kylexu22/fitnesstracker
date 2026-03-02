"use client";

import { AreaChart, BarChart } from "@tremor/react";

type DailyPoint = {
  day: string;
  sessions: number;
  sets: number;
  reps: number;
};

type TopExercisePoint = {
  exercise_name_snapshot: string;
  sets: number;
  reps: number;
  tonnage: number;
};

type AnalyticsTremorChartsProps = {
  daily: DailyPoint[];
  topExercises: TopExercisePoint[];
};

export function AnalyticsTremorCharts({ daily, topExercises }: AnalyticsTremorChartsProps) {
  return (
    <div className="space-y-4">
      <section className="surface">
        <h2 className="text-lg font-semibold">Last 30 Days Trend</h2>
        <AreaChart
          className="chart-theme analytics-trend-chart mt-4 h-64"
          data={daily}
          index="day"
          categories={["sessions", "sets", "reps"]}
          colors={["indigo", "cyan", "emerald"]}
          yAxisWidth={44}
          showLegend
          valueFormatter={(value: number) => value.toLocaleString()}
        />
      </section>

      <section className="surface">
        <h2 className="text-lg font-semibold">Top Exercises by Tonnage</h2>
        <BarChart
          className="chart-theme analytics-tonnage-chart mt-4 h-72"
          data={topExercises.map((item) => ({
            exercise: item.exercise_name_snapshot,
            tonnage: item.tonnage,
          }))}
          index="exercise"
          categories={["tonnage"]}
          colors={["violet"]}
          yAxisWidth={56}
          showLegend={false}
          valueFormatter={(value: number) => `${value.toLocaleString()} lb`}
        />
      </section>
    </div>
  );
}
