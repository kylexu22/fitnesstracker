import Link from "next/link";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  getTemplateById,
  moveTemplateExercise,
  removeTemplateExercise,
} from "@/lib/store";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TemplateDetailPage({ params }: PageProps) {
  const { id } = await params;
  const templateData = await getTemplateById(id);

  if (!templateData) {
    notFound();
  }

  async function moveExerciseAction(formData: FormData) {
    "use server";

    const templateId = String(formData.get("templateId") ?? "");
    const templateExerciseId = String(formData.get("templateExerciseId") ?? "");
    const direction = String(formData.get("direction") ?? "");

    if (!templateId || !templateExerciseId || (direction !== "up" && direction !== "down")) {
      return;
    }

    await moveTemplateExercise(templateId, templateExerciseId, direction);
    revalidatePath(`/templates/${templateId}`);
  }

  async function removeExerciseAction(formData: FormData) {
    "use server";

    const templateExerciseId = String(formData.get("templateExerciseId") ?? "");
    if (!templateExerciseId) {
      return;
    }

    await removeTemplateExercise(templateExerciseId);
    revalidatePath(`/templates/${id}`);
    revalidatePath("/templates");
  }

  return (
    <div className="page-shell">
      <section>
        <h1 className="text-3xl font-semibold">{templateData.template.name}</h1>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Exercises</h2>
          <Link className="button-primary h-10 w-10 rounded-full p-0" href={`/templates/${id}/add-exercises`} aria-label="Add exercise">
            <Plus className="h-5 w-5" />
          </Link>
        </div>
        {templateData.exercises.length === 0 ? (
          <p className="text-sm text-muted">Add exercises to this split.</p>
        ) : (
          <ul className="space-y-2">
            {templateData.exercises.map((item, index) => (
              <li key={item.id} className="muted-surface">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {item.order_index}. {item.exercise_name}
                    </p>
                    {item.notes ? <p className="mt-1 text-sm text-muted">{item.notes}</p> : null}
                  </div>
                  <div className="flex items-center gap-1">
                    <form action={moveExerciseAction}>
                      <input type="hidden" name="templateId" value={templateData.template.id} />
                      <input type="hidden" name="templateExerciseId" value={item.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button className="button-secondary" type="submit" disabled={index === 0}>
                        <ArrowUp className="h-4 w-4" />
                      </button>
                    </form>
                    <form action={moveExerciseAction}>
                      <input type="hidden" name="templateId" value={templateData.template.id} />
                      <input type="hidden" name="templateExerciseId" value={item.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button className="button-secondary" type="submit" disabled={index === templateData.exercises.length - 1}>
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </form>
                    <form action={removeExerciseAction}>
                      <input type="hidden" name="templateExerciseId" value={item.id} />
                      <button className="button-secondary button-danger" type="submit">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
