import Link from "next/link";
import { Archive, Edit, Plus } from "lucide-react";
import { revalidatePath } from "next/cache";

import { ExerciseCreateModal } from "@/components/exercise-create-modal";
import { archiveExercise, createExercise, listExercises, listTemplates } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const [templates, exercises] = await Promise.all([listTemplates(), listExercises()]);

  async function createExerciseAction(formData: FormData) {
    "use server";

    await createExercise({
      name: formData.get("name"),
      muscleGroup: formData.get("muscleGroup"),
      equipment: formData.get("equipment"),
      notes: formData.get("notes"),
    });

    revalidatePath("/templates");
    revalidatePath("/");
  }

  async function archiveExerciseAction(formData: FormData) {
    "use server";

    const exerciseId = String(formData.get("exerciseId") ?? "");
    if (!exerciseId) {
      return;
    }

    await archiveExercise(exerciseId);
    revalidatePath("/templates");
    revalidatePath("/");
  }

  return (
    <div className="page-shell">
      <section>
        <h1 className="text-4xl font-semibold">Workout Builder</h1>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Exercises</h2>
          <ExerciseCreateModal createExerciseAction={createExerciseAction} />
        </div>
        {exercises.length === 0 ? (
          <p className="text-sm text-muted">No exercises yet.</p>
        ) : (
          <ul className="space-y-2">
            {exercises.map((exercise) => (
              <li key={exercise.id} className="muted-surface">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{exercise.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {exercise.muscle_group || "Unknown muscle"} | {exercise.equipment || "Unknown equipment"}
                    </p>
                    {exercise.notes ? <p className="mt-2 text-sm text-muted">{exercise.notes}</p> : null}
                  </div>
                  <form action={archiveExerciseAction}>
                    <input type="hidden" name="exerciseId" value={exercise.id} />
                    <button className="button-secondary button-danger" type="submit">
                      <Archive className="h-4 w-4" />
                      Archive
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Workout Splits</h2>
          <Link className="button-primary h-10 w-10 rounded-full p-0" href="/templates/new" aria-label="Create split">
            <Plus className="h-5 w-5" />
          </Link>
        </div>

        {templates.length === 0 ? (
          <p className="text-sm text-muted">No templates yet.</p>
        ) : (
          <ul className="space-y-2">
            {templates.map((template) => (
              <li key={template.id} className="muted-surface">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{template.name}</p>
                    <p className="text-xs text-muted">
                      {template.exercise_count} exercises | {template.description || "No description"}
                    </p>
                  </div>
                  <Link className="button-secondary" href={`/templates/${template.id}`}>
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
