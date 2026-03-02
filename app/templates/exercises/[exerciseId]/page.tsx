import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { ArchiveExerciseButton } from "@/components/archive-exercise-button";
import { ExerciseHistoryTremorChart } from "@/components/exercise-history-tremor-chart";
import { formatWorkoutDateTime } from "@/lib/format";
import { archiveExercise, getExerciseById, listExerciseHistory } from "@/lib/store";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ exerciseId: string }>;
};

export default async function ExerciseDetailPage({ params }: PageProps) {
  const { exerciseId } = await params;
  const [exercise, history] = await Promise.all([getExerciseById(exerciseId), listExerciseHistory(exerciseId)]);

  if (!exercise || exercise.archived_at) {
    notFound();
  }

  async function archiveExerciseAction() {
    "use server";

    await archiveExercise(exerciseId);
    revalidatePath("/templates");
    revalidatePath("/");
    revalidatePath("/workout/start");
    redirect("/templates");
  }

  return (
    <div className="page-shell">
      <section className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">{exercise.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {exercise.muscle_group || "Unknown muscle"} | {exercise.equipment || "Unknown equipment"}
          </p>
          {exercise.notes ? <p className="mt-2 text-sm text-muted">{exercise.notes}</p> : null}
        </div>
        <ArchiveExerciseButton action={archiveExerciseAction} />
      </section>

      <section className="surface">
        <h2 className="text-lg font-semibold">History</h2>
        {history.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No completed history for this exercise yet.</p>
        ) : (
          <>
            <ExerciseHistoryTremorChart history={history} />
            <ul className="mt-3 space-y-2">
              {history.map((item) => (
                <li key={item.session_id} className="muted-surface">
                  <Link href={`/history/${item.session_id}`} className="block">
                    <p className="font-medium">{formatWorkoutDateTime(item.started_at)}</p>
                    <p className="mt-1 text-xs text-muted">
                      {item.set_count} sets | {item.max_reps} reps | {item.max_weight ? `${Number(item.max_weight)} lbs` : "No weight"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section>
        <Link className="button-secondary" href="/templates">
          <ArrowLeft className="h-4 w-4" />
          Back to Builder
        </Link>
      </section>
    </div>
  );
}
