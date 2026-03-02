import { Plus } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { CancelSessionButton } from "@/components/cancel-session-button";
import { FinishSessionButton } from "@/components/finish-session-button";
import { WorkoutSessionHeader } from "@/components/workout-session-header";
import { abandonSession, addSetLog, completeSession, getSessionById } from "@/lib/store";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function WorkoutSessionPage({ params }: PageProps) {
  const { sessionId } = await params;
  const sessionData = await getSessionById(sessionId);

  if (!sessionData) {
    notFound();
  }

  async function addSetAction(formData: FormData) {
    "use server";

    await addSetLog({
      sessionExerciseId: formData.get("sessionExerciseId"),
      reps: formData.get("reps"),
      weight: emptyToNull(formData.get("weight")),
      notes: formData.get("notes"),
    });

    revalidatePath(`/workout/${sessionId}`);
    revalidatePath(`/history/${sessionId}`);
  }

  async function completeSessionAction() {
    "use server";

    await completeSession(sessionId);
    revalidatePath("/");
    revalidatePath("/history");
    redirect(`/history/${sessionId}`);
  }

  async function cancelSessionAction() {
    "use server";

    await abandonSession(sessionId);
    revalidatePath("/");
    revalidatePath("/history");
    revalidatePath(`/workout/${sessionId}`);
    redirect("/");
  }

  return (
    <div className="page-shell workout-live-page">
      <section className="workout-sticky-header workout-sticky-header-bleed">
        <div className="flex items-start justify-between gap-3">
          <WorkoutSessionHeader
            templateName={sessionData.session.name_snapshot}
            startedAt={sessionData.session.started_at}
            endedAt={sessionData.session.ended_at}
            status={sessionData.session.status}
          />
          {sessionData.session.status === "active" ? (
            <CancelSessionButton action={cancelSessionAction} />
          ) : null}
        </div>
      </section>

      <div className="workout-scroll-overlay workout-scroll-overlay-bleed" aria-hidden />

      <div className="workout-scroll-content space-y-4 mt-4">
        {sessionData.exercises.map((exercise) => (
          <section key={exercise.id} className="surface">
            <h2 className="text-lg font-semibold">
              {exercise.order_index}. {exercise.exercise_name_snapshot}
            </h2>

            {exercise.sets.length > 0 ? (
              <div className="table-wrap mt-3">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Set</th>
                      <th>Reps</th>
                      <th>Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.sets.map((set) => (
                      <tr key={set.id}>
                        <td>{set.set_number}</td>
                        <td>{set.reps}</td>
                        <td>{set.weight ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            {sessionData.session.status === "active" ? (
              <form action={addSetAction} className="mt-4 grid gap-3 md:grid-cols-5">
                <input type="hidden" name="sessionExerciseId" value={exercise.id} />
                <div className="md:col-span-5">
                  <div className="grid grid-cols-[5.5rem_4.5rem_minmax(0,1fr)_2.7rem] items-center gap-2 md:grid-cols-[5rem_6rem_minmax(0,1fr)_2.9rem]">
                    <input
                      className="input text-center"
                      name="weight"
                      type="number"
                      min={0}
                      step="0.5"
                      placeholder="Weight"
                    />
                    <input
                      className="input text-center"
                      name="reps"
                      required
                      type="number"
                      min={1}
                      max={200}
                      placeholder="Reps"
                    />
                    <input className="input min-w-0" name="notes" placeholder="Notes (optional)" />
                    <button
                      className="inline-flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-foreground"
                      type="submit"
                      aria-label="Add set"
                      title="Add set"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </form>
            ) : null}

            {exercise.last_session_set ? (
              <p className="mt-3 text-xs text-muted">
                Last session:{" "}
                {formatLastSet(exercise.last_session_set.weight, exercise.last_session_set.reps)}
              </p>
            ) : null}
          </section>
        ))}
      </div>

      {sessionData.session.status === "active" ? (
        <section className="sticky bottom-20 z-10 md:bottom-4">
          <FinishSessionButton action={completeSessionAction} />
        </section>
      ) : null}
    </div>
  );
}

function emptyToNull(value: FormDataEntryValue | null) {
  const stringValue = String(value ?? "").trim();
  return stringValue === "" ? null : Number(stringValue);
}

function formatLastSet(weight: string | null, reps: number) {
  if (!weight) {
    return `${reps} reps`;
  }

  const value = Number(weight);
  const compactWeight = Number.isFinite(value) ? value.toString() : weight;
  return `${compactWeight} lbs | ${reps} reps`;
}
