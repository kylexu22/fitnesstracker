import Link from "next/link";
import { Activity, ArrowRight, BarChart3, Dumbbell, FileText } from "lucide-react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { StartWorkoutModal } from "@/components/start-workout-modal";
import { formatSessionDuration, formatWorkoutDateTime } from "@/lib/format";
import { getDashboardStats, listActiveSessions, listSessions, listTemplates, startSessionFromTemplate } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [stats, recentSessions, templates, activeSessions] = await Promise.all([
    getDashboardStats(),
    listSessions(3),
    listTemplates(),
    listActiveSessions(),
  ]);

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
        <h1 className="text-3xl font-bold">Welcome back</h1>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Dumbbell className="h-4 w-4" />} label="Exercises" value={stats.exerciseCount} />
        <StatCard icon={<FileText className="h-4 w-4" />} label="Templates" value={stats.templateCount} />
        <StatCard icon={<BarChart3 className="h-4 w-4" />} label="Completed" value={stats.completedSessions} />
        <StatCard
          icon={<Activity className="h-4 w-4" />}
          label="Active Session"
          value={stats.activeSession ? stats.activeSession.name_snapshot : "None"}
          small
        />
      </section>

      <section className="surface">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Recent Sessions</h2>
          <Link className="text-sm text-primary" href="/history">
            View all
          </Link>
        </div>

        {recentSessions.length === 0 ? (
          <p className="text-sm text-muted">No sessions logged yet.</p>
        ) : (
          <ul className="space-y-2">
            {recentSessions.map((session) => (
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
          activeSessions[0]
            ? {
                id: activeSessions[0].id,
                name: activeSessions[0].name_snapshot,
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
  small,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  small?: boolean;
}) {
  return (
    <div className="stat-card">
      <span className="mb-2 inline-flex rounded-lg bg-primary/15 p-2 text-primary">{icon}</span>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-1 font-semibold ${small ? "text-sm" : "text-2xl"}`}>{value}</p>
    </div>
  );
}
