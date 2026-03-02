import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createTemplate } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function NewTemplatePage() {
  async function createTemplateAction(formData: FormData) {
    "use server";

    const created = await createTemplate({
      name: formData.get("name"),
      description: formData.get("description"),
    });

    revalidatePath("/templates");
    revalidatePath("/");
    redirect(`/templates/${created.id}`);
  }

  return (
    <div className="page-shell">
      <section>
        <h1 className="text-3xl font-semibold">Create Workout Split</h1>
        <p className="mt-1 text-sm text-muted">After creating, you can add exercises and set the order.</p>
      </section>

      <section className="surface">
        <form action={createTemplateAction} className="space-y-4">
          <label className="space-y-1 text-sm">
            <span>Name</span>
            <input className="input" name="name" placeholder="Upper Body" required />
          </label>
          <label className="space-y-1 text-sm">
            <span>Description</span>
            <input className="input" name="description" placeholder="Push and pull focus" />
          </label>
          <div className="flex gap-2">
            <button className="button-primary" type="submit">
              Create Split
            </button>
            <Link className="button-secondary" href="/templates">
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
