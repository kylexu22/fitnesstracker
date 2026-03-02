import Link from "next/link";
import { ArrowRight, BarChart3, CalendarDays, Clock3, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { StartWorkoutModal } from "@/components/start-workout-modal";
import { formatSessionDuration, formatWorkoutDateTime } from "@/lib/format";
import {
  getAnalyticsSummary,
  listActiveSessions,
  listCompletedSessionsWithProgress,
  listTemplates,
  startSessionFromTemplate,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [allRecentSessions, templates, activeSessions, analytics30] = await Promise.all([
    listCompletedSessionsWithProgress(20),
    listTemplates(),
    listActiveSessions(),
    getAnalyticsSummary(30),
  ]);

  const activeSession = activeSessions[0] ?? null;
  const completedRecentSessions = allRecentSessions.slice(0, 3);
  const lastCompletedSession = completedRecentSessions[0] ?? null;

  const trendPool = allRecentSessions.filter((session) => session.progress_direction !== null).slice(0, 6);
  const trendUpCount = trendPool.filter((session) => session.progress_direction === "up").length;
  const trendDownCount = trendPool.length - trendUpCount;
  const hasEnoughTrendData = trendPool.length >= 3;

  const progressiveOverloadValue = !hasEnoughTrendData
    ? "Not enough data"
    : trendUpCount > trendDownCount
      ? "Trending Up"
      : trendUpCount === trendDownCount
        ? "Mixed"
        : "Needs Focus";

  const progressiveOverloadDetail = !hasEnoughTrendData
    ? "Complete more workouts to detect trend"
    : `${trendUpCount}/${trendPool.length} sessions improved`;

  async function startSessionAction(formData: FormData) {
    "use server";

    const templateId = String(formData.get("templateId") ?? "");
    if (!templateId) {
      return;
    }

    const sessionId = await startSessionFromTemplate(templateId);
    revalidatePath("/");
    revalidatePath("/history");
    redirect(`/workout/${sessionId}`);
  }

  return (
    <div className="page-shell">
      <section>
        <h1 className="text-3xl font-bold">Welcome back, Beast.</h1>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Progressive Overload"
          value={progressiveOverloadValue}
          detail={progressiveOverloadDetail}
        />
        <StatCard
          icon={<Clock3 className="h-4 w-4" />}
          label="Last Session"
          value={
            lastCompletedSession
              ? formatSessionDuration(lastCompletedSession.started_at, lastCompletedSession.ended_at)
              : "No data"
          }
          detail={
            lastCompletedSession
              ? `${lastCompletedSession.name_snapshot} - ${formatWorkoutDateTime(lastCompletedSession.started_at)}`
              : "Complete a workout to populate"
          }
        />
        <StatCard
          icon={<CalendarDays className="h-4 w-4" />}
          label="Sessions (30d)"
          value={analytics30.sessions}
          detail="Completed workouts"
        />
        <StatCard
          icon={<BarChart3 className="h-4 w-4" />}
          label="Sets (30d)"
          value={analytics30.sets}
          detail="Total logged sets"
        />
      </section>

      <section className="surface">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Recent Sessions</h2>
          <Link className="text-sm text-primary" href="/history">
            View all
          </Link>
        </div>

        {completedRecentSessions.length === 0 ? (
          <p className="text-sm text-muted">No sessions logged yet.</p>
        ) : (
          <ul className="space-y-2">
            {completedRecentSessions.map((session) => (
              <li key={session.id} className="muted-surface">
                <Link href={`/history/${session.id}`} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{session.name_snapshot}</p>
                    <p className="text-xs text-muted">
                      {formatWorkoutDateTime(session.started_at)} | {formatSessionDuration(session.started_at, session.ended_at)}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <StartWorkoutModal
        templates={templates.map((template) => ({
          id: template.id,
          name: template.name,
          exerciseCount: template.exercise_count,
        }))}
        activeSession={
          activeSession
            ? {
                id: activeSession.id,
                name: activeSession.name_snapshot,
              }
            : null
        }
        startSessionAction={startSessionAction}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="stat-card min-h-[8.25rem]">
      <span className="mb-2 inline-flex rounded-lg bg-primary/15 p-2 text-primary">{icon}</span>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold leading-tight">{value}</p>
      <p className="mt-1 line-clamp-2 text-[11px] text-muted">{detail}</p>
    </div>
  );
}
