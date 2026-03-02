import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { TemplateExercisePicker } from "@/components/template-exercise-picker";
import { addExercisesToTemplate, getTemplateById, listExercises } from "@/lib/store";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AddExercisesToTemplatePage({ params }: PageProps) {
  const { id } = await params;
  const [templateData, exercises] = await Promise.all([getTemplateById(id), listExercises()]);

  if (!templateData) {
    redirect("/templates");
  }

  async function saveSelectionAction(exerciseIds: string[]) {
    "use server";

    await addExercisesToTemplate(id, exerciseIds);
    revalidatePath(`/templates/${id}`);
    revalidatePath("/templates");
    redirect(`/templates/${id}`);
  }

  return (
    <div className="page-shell">
      <section>
        <h1 className="text-3xl font-semibold">Add Exercises</h1>
        <p className="mt-1 text-sm text-muted">Select one or more exercises for {templateData.template.name}.</p>
      </section>

      <TemplateExercisePicker
        exercises={exercises.map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          muscle_group: exercise.muscle_group,
          equipment: exercise.equipment,
        }))}
        existingExerciseIds={templateData.exercises.map((exercise) => exercise.exercise_id)}
        onDone={saveSelectionAction}
      />
    </div>
  );
}
