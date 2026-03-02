import Link from "next/link";
import { Clock3, TrendingDown, TrendingUp } from "lucide-react";
import { notFound } from "next/navigation";

import { getSessionById } from "@/lib/store";
import type { SetLog } from "@/lib/types";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function SessionDetailPage({ params }: PageProps) {
  const { sessionId } = await params;
  const sessionData = await getSessionById(sessionId);

  if (!sessionData) {
    notFound();
  }

  const startedAt = new Date(sessionData.session.started_at);
  const endedAt = sessionData.session.ended_at ? new Date(sessionData.session.ended_at) : null;
  const durationMinutes = Math.max(
    0,
    Math.round(((endedAt ?? new Date()).getTime() - startedAt.getTime()) / 60000),
  );

  return (
    <div className="page-shell">
      <section className="surface">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-semibold">{sessionData.session.name_snapshot}</h1>
            <p className="mt-1 text-sm text-muted">{formatWorkoutDateTimeWithComma(startedAt)}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted">
              <Clock3 className="h-4 w-4" />
              {durationMinutes} minutes
            </p>
          </div>
          <Link className="button-secondary" href="/history">
            Back
          </Link>
        </div>
      </section>

      {sessionData.exercises.map((exercise) => {
        const progressDirection = getExerciseProgressDirection(exercise.sets, exercise.last_session_set);
        return (
        <section key={exercise.id} className="surface">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">
              {exercise.order_index}. {exercise.exercise_name_snapshot}
            </h2>
            {progressDirection === "up" ? (
              <TrendingUp className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : progressDirection === "down" ? (
              <TrendingDown className="h-4 w-4 shrink-0 text-red-400" />
            ) : null}
          </div>
          {exercise.sets.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No sets recorded.</p>
          ) : (
            <div className="table-wrap mt-3">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Set</th>
                    <th>Reps</th>
                    <th>Weight</th>
                    <th>Notes</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {exercise.sets.map((set) => (
                    <tr key={set.id}>
                      <td>{set.set_number}</td>
                      <td>{set.reps}</td>
                      <td>{set.weight ?? "-"}</td>
                      <td>{set.notes || "-"}</td>
                      <td className="text-xs text-muted">{formatTimeOnly(set.logged_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      );
      })}
    </div>
  );
}

function formatWorkoutDateTimeWithComma(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  const datePart = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
  return `${datePart}, ${timePart}`;
}

function formatTimeOnly(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function getExerciseProgressDirection(
  sets: SetLog[],
  previous: { session_name: string; started_at: Date; reps: number; weight: string | null } | null,
) {
  if (!previous) {
    return null;
  }

  const currentBest = getBestSet(sets);
  if (!currentBest) {
    return null;
  }

  const previousWeight = safeNumber(previous.weight);
  const previousReps = previous.reps;

  if (
    currentBest.weight > previousWeight ||
    (currentBest.weight === previousWeight && currentBest.reps > previousReps)
  ) {
    return "up";
  }

  return "down";
}

function getBestSet(sets: SetLog[]) {
  if (sets.length === 0) {
    return null;
  }

  return sets.reduce(
    (best, set) => {
      const weight = safeNumber(set.weight);
      if (weight > best.weight || (weight === best.weight && set.reps > best.reps)) {
        return { weight, reps: set.reps };
      }
      return best;
    },
    { weight: -1, reps: 0 },
  );
}

function safeNumber(value: string | null) {
  if (!value) {
    return 0;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
