import Link from "next/link";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";

import { HistoryFilter } from "@/components/history-filter";
import { formatSessionDuration, formatWorkoutDateTime } from "@/lib/format";
import { listCompletedSessionsWithProgress } from "@/lib/store";

export const dynamic = "force-dynamic";

type HistoryPageProps = {
  searchParams: Promise<{ range?: string }>;
};

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const { range } = await searchParams;
  const selectedRange = range === "month" || range === "year" || range === "all" ? range : "month";

  const sessions = (await listCompletedSessionsWithProgress()).filter((session) =>
    matchesRange(session.started_at, selectedRange),
  );

  const subtitle =
    selectedRange === "month"
      ? "Last 30 Days"
      : selectedRange === "year"
        ? "This year"
        : "All time";

  return (
    <div className="page-shell">
      <section>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-semibold">
              Workout History
            </h1>
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          </div>
          <HistoryFilter selectedRange={selectedRange} />
        </div>
      </section>

      <section className="pt-1">
        {sessions.length === 0 ? (
          <p className="text-sm text-muted">No sessions yet.</p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((session) => (
              <li key={session.id} className="muted-surface">
                <Link href={`/history/${session.id}`} className="block">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{session.name_snapshot}</p>
                      <p className="mt-1 text-xs text-muted">
                        {formatWorkoutDateTime(session.started_at)} |{" "}
                        {formatSessionDuration(session.started_at, session.ended_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.progress_direction === "up" ? (
                        <TrendingUp className="h-4 w-4 shrink-0 text-emerald-400" />
                      ) : session.progress_direction === "down" ? (
                        <TrendingDown className="h-4 w-4 shrink-0 text-red-400" />
                      ) : null}
                      <ArrowRight className="h-5 w-5 shrink-0 text-muted" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function matchesRange(value: string | Date, range: "month" | "year" | "all") {
  if (range === "all") {
    return true;
  }

  const date = typeof value === "string" ? new Date(value) : value;
  const now = new Date();

  if (range === "month") {
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    return date >= thirtyDaysAgo && date <= now;
  }

  return date.getFullYear() === now.getFullYear();
}
