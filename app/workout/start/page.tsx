import Link from "next/link";
import { Play } from "lucide-react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { listActiveSessions, listTemplates, startSessionFromTemplate } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function StartWorkoutPage() {
  const [templates, activeSessions] = await Promise.all([listTemplates(), listActiveSessions()]);
  const activeSession = activeSessions[0] ?? null;

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
      <section className="mx-auto flex min-h-[68vh] w-full max-w-xl items-center justify-center px-1">
        <div className="w-full space-y-6">
          <h1 className="text-4xl font-semibold">Start Workout</h1>
          <form action={startSessionAction} className="space-y-4">
            <div className="space-y-2 text-sm">
              <select className="input" name="templateId" required>
                <option value="">Choose template</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.exercise_count} exercises)
                  </option>
                ))}
              </select>
            </div>
            <div className="pt-2">
            <button className="button-primary w-full py-3 text-base" type="submit" disabled={templates.length === 0}>
              <Play className="h-4 w-4" />
              Start Session
            </button>
            </div>
            {templates.length === 0 ? (
              <p className="text-sm text-muted">
                Create a template first in <Link className="text-primary" href="/templates">Templates</Link>.
              </p>
            ) : null}
          </form>
        </div>
      </section>

      {activeSession ? (
        <div className="fixed bottom-24 left-4 right-4 z-40 md:bottom-6 md:left-auto md:right-8 md:w-96">
          <div className="surface dash-glass px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Active session</p>
                <p className="text-sm font-semibold">{activeSession.name_snapshot}</p>
              </div>
              <Link className="button-primary" href={`/workout/${activeSession.id}`}>
                Continue
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
