import Link from "next/link";
import { Edit, Plus } from "lucide-react";
import { revalidatePath } from "next/cache";

import { ExerciseListCollapsible } from "@/components/exercise-list-collapsible";
import { ExerciseCreateModal } from "@/components/exercise-create-modal";
import { createExercise, listExercises, listTemplates } from "@/lib/store";

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

  return (
    <div className="page-shell">
      <section>
        <h1 className="text-3xl font-semibold">Workout Builder</h1>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl">Exercises</h2>
          <ExerciseCreateModal createExerciseAction={createExerciseAction} />
        </div>
        {exercises.length === 0 ? (
          <p className="text-sm text-muted">No exercises yet.</p>
        ) : (
          <ExerciseListCollapsible
            exercises={exercises.map((exercise) => ({
              id: exercise.id,
              name: exercise.name,
              muscle_group: exercise.muscle_group,
              equipment: exercise.equipment,
            }))}
          />
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl">Workout Splits</h2>
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
