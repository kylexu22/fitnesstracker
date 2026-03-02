"use client";

import { useState } from "react";

type FinishSessionButtonProps = {
  action: () => Promise<void>;
};

export function FinishSessionButton({ action }: FinishSessionButtonProps) {
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
      <button className="button-primary w-full py-3 text-base" type="button" onClick={openModal}>
        Finish Session
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
            <h3 className="text-xl font-semibold">Finish Session?</h3>
            <p className="mt-2 text-sm text-muted">
              This will complete your workout and save the final log.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button className="button-secondary" type="button" onClick={closeModal}>
                Cancel
              </button>
              <form action={action}>
                <button className="button-primary w-full" type="submit">
                  Finish
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
