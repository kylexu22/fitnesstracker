"use client";

import { useEffect, useMemo, useState } from "react";

import { formatWorkoutDateTime } from "@/lib/format";

type WorkoutSessionHeaderProps = {
  templateName: string;
  startedAt: string | Date;
  endedAt: string | Date | null;
  status: "active" | "completed" | "abandoned";
};

export function WorkoutSessionHeader({
  templateName,
  startedAt,
  endedAt,
  status,
}: WorkoutSessionHeaderProps) {
  const startTime = useMemo(
    () => (startedAt instanceof Date ? startedAt.getTime() : new Date(startedAt).getTime()),
    [startedAt],
  );
  const endTime = useMemo(() => {
    if (!endedAt) {
      return null;
    }
    return endedAt instanceof Date ? endedAt.getTime() : new Date(endedAt).getTime();
  }, [endedAt]);

  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (status !== "active") {
      return;
    }

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [status]);

  const elapsedSeconds = Math.max(
    0,
    Math.floor(((status === "active" ? now : (endTime ?? now)) - startTime) / 1000),
  );

  return (
    <section>
      <div className="flex items-center gap-3">
        {status === "active" ? <span className="live-dot" /> : null}
        <h1 className="text-5xl font-semibold tabular-nums" suppressHydrationWarning>
          {formatElapsed(elapsedSeconds)}
        </h1>
      </div>
      <p className="mt-2 text-xl font-semibold">{templateName}</p>
      <p className="mt-1 text-sm text-muted">Started {formatWorkoutDateTime(startedAt)}</p>
    </section>
  );
}

function formatElapsed(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}
