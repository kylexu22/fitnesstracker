"use client";

import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";

type ExerciseCreateModalProps = {
  createExerciseAction: (formData: FormData) => Promise<void>;
};

export function ExerciseCreateModal({ createExerciseAction }: ExerciseCreateModalProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createExerciseAction(formData);
      closeModal();
    });
  }

  function openModal() {
    setOpen(true);
    requestAnimationFrame(() => setVisible(true));
  }

  function closeModal() {
    setVisible(false);
    window.setTimeout(() => setOpen(false), 220);
  }

  return (
    <>
      <button className="button-primary h-10 w-10 rounded-full p-0" type="button" onClick={openModal}>
        <Plus className="h-5 w-5" />
      </button>

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
              <h3 className="text-lg font-semibold">New Exercise</h3>
              <button className="button-secondary h-10 w-10 rounded-full p-0" type="button" onClick={closeModal}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={handleSubmit} className="space-y-6">
              <label className="space-y-2.5 text-sm">
                <span>Name</span>
                <input className="input" name="name" required placeholder="Chest Fly" />
              </label>
              <div className="grid grid-cols-2 gap-4 mb-2 mt-2">
                <label className="space-y-2.5 text-sm">
                  <span>Muscle</span>
                  <input className="input" name="muscleGroup" placeholder="Chest" />
                </label>
                <label className="space-y-2.5 text-sm">
                  <span>Equipment</span>
                  <input className="input" name="equipment" placeholder="Machine" />
                </label>
              </div>
              <label className="space-y-2.5 text-sm">
                <span>Notes</span>
                <input className="input" name="notes" placeholder="Optional" />
              </label>
              <div className="pt-2 mt-2">
                <button className="button-primary w-full py-2.5" type="submit" disabled={pending}>
                  {pending ? "Adding..." : "Add Exercise"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
