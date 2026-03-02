"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

type ExerciseItem = {
  id: string;
  name: string;
  muscle_group: string;
  equipment: string;
};

type ExerciseListCollapsibleProps = {
  exercises: ExerciseItem[];
};

export function ExerciseListCollapsible({ exercises }: ExerciseListCollapsibleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <button
        className="muted-surface flex w-full items-center justify-between gap-3"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className="text-sm font-medium">
          {open ? "Hide exercises" : "Show exercises"} ({exercises.length})
        </span>
        <ChevronDown className={`h-4 w-4 text-muted transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity,transform] duration-300 ease-out ${
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
        }`}
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <ul className="space-y-2 pt-1">
            {exercises.map((exercise) => (
              <li key={exercise.id} className="muted-surface">
                <Link href={`/templates/exercises/${exercise.id}`} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{exercise.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {exercise.muscle_group || "Unknown muscle"} | {exercise.equipment || "Unknown equipment"}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
