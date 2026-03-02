"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Play, X } from "lucide-react";

type TemplateOption = {
  id: string;
  name: string;
  exerciseCount: number;
};

type ActiveSession = {
  id: string;
  name: string;
};

type StartWorkoutModalProps = {
  templates: TemplateOption[];
  activeSession: ActiveSession | null;
  startSessionAction: (formData: FormData) => Promise<void>;
};

export function StartWorkoutModal({
  templates,
  activeSession,
  startSessionAction,
}: StartWorkoutModalProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pending, startTransition] = useTransition();

  function openModal() {
    setOpen(true);
    requestAnimationFrame(() => setVisible(true));
  }

  function closeModal() {
    setVisible(false);
    window.setTimeout(() => setOpen(false), 220);
  }

  function submitStart(formData: FormData) {
    startTransition(async () => {
      await startSessionAction(formData);
      closeModal();
    });
  }

  return (
    <>
      <div className="fixed bottom-24 left-4 right-4 z-40 md:bottom-8 md:left-auto md:right-8 md:w-[18rem]">
        {activeSession ? (
          <Link
            href={`/workout/${activeSession.id}`}
            className="button-neutral dashboard-cta-pill w-full rounded-full text-base"
          >
            <span className="live-dot" />
            View Active Workout
          </Link>
        ) : (
          <button className="button-primary dashboard-cta-pill w-full rounded-full text-base" type="button" onClick={openModal}>
            <Play className="h-4 w-4" />
            Start Workout
          </button>
        )}
      </div>

      {open ? (
        <div
          className={`fixed inset-0 z-50 flex items-end justify-center p-4 transition-opacity duration-200 md:items-center ${
            visible ? "bg-black/70 opacity-100" : "bg-black/0 opacity-0"
          }`}
          onClick={closeModal}
        >
          <div
            className={`w-full max-w-sm rounded-2xl border border-zinc-700 bg-[#090b14] p-5 transition-transform duration-200 ${
              visible ? "translate-y-0" : "translate-y-7"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Start Workout</h3>
              <button className="button-secondary h-10 w-10 rounded-full p-0" type="button" onClick={closeModal}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={submitStart} className="space-y-4">
              <label className="space-y-2 text-sm">
                <select className="input" name="templateId" required>
                  <option value="">Choose template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.exerciseCount} exercises)
                    </option>
                  ))}
                </select>
              </label>
              <button className="button-primary w-full py-3 text-base mt-4" type="submit" disabled={templates.length === 0 || pending}>
                <Play className="h-4 w-4" />
                {pending ? "Starting..." : "Start Session"}
              </button>
              {templates.length === 0 ? (
                <p className="text-sm text-muted">
                  Create a template first in{" "}
                  <Link className="text-primary" href="/templates" onClick={closeModal}>
                    Builder
                  </Link>
                  .
                </p>
              ) : null}
            </form>

            {activeSession ? (
              <div className="mt-4 rounded-xl border border-border bg-zinc-900 p-3">
                <p className="text-xs uppercase tracking-wide text-muted">Active session</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{activeSession.name}</p>
                  <Link className="button-secondary" href={`/workout/${activeSession.id}`} onClick={closeModal}>
                    Continue
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
