const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export function formatWorkoutDateTime(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return `${dateFormatter.format(date)} ${timeFormatter.format(date)}`;
}

export function formatSessionDuration(
  startedAt: string | Date,
  endedAt?: string | Date | null,
) {
  const start = startedAt instanceof Date ? startedAt.getTime() : new Date(startedAt).getTime();
  const end = endedAt
    ? endedAt instanceof Date
      ? endedAt.getTime()
      : new Date(endedAt).getTime()
    : Date.now();

  const totalMinutes = Math.max(0, Math.round((end - start) / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) {
    return `${minutes} min`;
  }

  return `${hours}h ${minutes}m`;
}
