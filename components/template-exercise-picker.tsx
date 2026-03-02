"use client";

import { useMemo, useState, useTransition } from "react";
import { Circle, CircleCheckBig } from "lucide-react";

type ExerciseOption = {
  id: string;
  name: string;
  muscle_group: string;
  equipment: string;
};

type TemplateExercisePickerProps = {
  exercises: ExerciseOption[];
  existingExerciseIds: string[];
  onDone: (exerciseIds: string[]) => Promise<void>;
};

export function TemplateExercisePicker({
  exercises,
  existingExerciseIds,
  onDone,
}: TemplateExercisePickerProps) {
  const [pending, startTransition] = useTransition();
  const initialSelected = useMemo(() => new Set(existingExerciseIds), [existingExerciseIds]);
  const [selected, setSelected] = useState<Set<string>>(initialSelected);

  function toggleExercise(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function submitSelection() {
    const selectedIds = Array.from(selected);
    startTransition(async () => {
      await onDone(selectedIds);
    });
  }

  return (
    <>
      <ul className="space-y-2 pb-24">
        {exercises.map((exercise) => {
          const active = selected.has(exercise.id);
          return (
            <li key={exercise.id}>
              <button
                className="muted-surface flex w-full items-center justify-between gap-3 text-left"
                type="button"
                onClick={() => toggleExercise(exercise.id)}
              >
                <div>
                  <p className="font-semibold">{exercise.name}</p>
                  <p className="mt-1 text-xs text-muted">
                    {exercise.muscle_group || "Unknown muscle"} | {exercise.equipment || "Unknown equipment"}
                  </p>
                </div>
                <span className="text-primary">
                  {active ? <CircleCheckBig className="h-6 w-6" /> : <Circle className="h-6 w-6 text-muted" />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="fixed bottom-24 left-4 right-4 z-40 md:bottom-8 md:left-auto md:right-8 md:w-[18rem]">
        <button className="button-primary w-full rounded-full py-3 text-base" type="button" onClick={submitSelection} disabled={pending}>
          {pending ? "Saving..." : "Done"}
        </button>
      </div>
    </>
  );
}
