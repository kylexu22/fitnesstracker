"use client";

import { useState } from "react";
import { Archive } from "lucide-react";

type ArchiveExerciseButtonProps = {
  action: () => Promise<void>;
};

export function ArchiveExerciseButton({ action }: ArchiveExerciseButtonProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

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
      <button className="button-secondary button-danger" type="button" onClick={openModal}>
        <Archive className="h-4 w-4" />
        Archive
      </button>

      {open ? (
        <div
          className={`fixed inset-0 z-50 flex items-end justify-center px-4 pb-24 pt-4 transition-opacity duration-200 md:items-center md:p-4 ${
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
            <h3 className="text-xl font-semibold">Archive Exercise?</h3>
            <p className="mt-2 text-sm text-muted">
              This exercise will be hidden from your active lists and templates.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button className="button-secondary" type="button" onClick={closeModal}>
                Keep
              </button>
              <form action={action}>
                <button className="button-secondary button-danger w-full" type="submit">
                  Archive
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
