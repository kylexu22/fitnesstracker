import { Activity, BarChart3, Repeat, Weight } from "lucide-react";

import { AnalyticsTremorCharts } from "@/components/analytics-tremor-charts";
import { getAnalyticsSummary, listAnalyticsDaily } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [summary, daily] = await Promise.all([getAnalyticsSummary(30), listAnalyticsDaily(30)]);

  return (
    <div className="page-shell">
      <section className="surface">
        <h1 className="text-xl font-semibold">Analytics</h1>
        <p className="mt-1 text-sm text-muted">Last 30 days of completed workout data.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Sessions" value={summary.sessions} icon={<Activity className="h-4 w-4" />} />
          <StatCard label="Sets" value={summary.sets} icon={<BarChart3 className="h-4 w-4" />} />
          <StatCard label="Reps" value={summary.reps} icon={<Repeat className="h-4 w-4" />} />
          <StatCard
            label="Tonnage"
            value={summary.tonnage.toLocaleString(undefined, { maximumFractionDigits: 1 })}
            icon={<Weight className="h-4 w-4" />}
          />
        </div>
      </section>

      {summary.topExercises.length === 0 ? (
        <section className="surface">
          <p className="text-sm text-muted">No completed workout data yet.</p>
        </section>
      ) : (
        <AnalyticsTremorCharts daily={daily} topExercises={summary.topExercises} />
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="stat-card">
      <span className="mb-2 inline-flex rounded-lg bg-primary/15 p-2 text-primary">{icon}</span>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
