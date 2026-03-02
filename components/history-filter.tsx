"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

type RangeValue = "month" | "year" | "all";

const options: Array<{ value: RangeValue; label: string }> = [
  { value: "month", label: "Last 30 Days" },
  { value: "year", label: "This year" },
  { value: "all", label: "All time" },
];

export function HistoryFilter({ selectedRange }: { selectedRange: RangeValue }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeRange, setActiveRange] = useState<RangeValue>(selectedRange);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveRange(selectedRange);
  }, [selectedRange]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!containerRef.current) {
        return;
      }
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const activeIndex = useMemo(
    () => Math.max(0, options.findIndex((option) => option.value === activeRange)),
    [activeRange],
  );

  const currentLabel = options.find((option) => option.value === selectedRange)?.label ?? "All time";

  function selectRange(value: RangeValue) {
    if (value === activeRange) {
      setOpen(false);
      return;
    }

    setActiveRange(value);
    setOpen(false);
    window.setTimeout(() => {
      router.push(`/history?range=${value}`);
    }, 120);
  }

  return (
    <div className="relative" ref={containerRef}>
      <button className="button-secondary" type="button" onClick={() => setOpen((prev) => !prev)}>
        <Filter className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLabel}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {open ? (
        <div className="absolute right-0 top-11 z-20 w-44 rounded-xl border border-zinc-700 bg-zinc-950 p-1 shadow-2xl">
          <div className="relative">
            <span
              className="absolute left-1 right-1 h-9 rounded-md bg-zinc-800 transition-transform duration-300 ease-out"
              style={{ transform: `translateY(${activeIndex * 2.5}rem)` }}
            />
            <div className="relative flex flex-col gap-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="relative z-10 h-9 rounded-md px-3 text-left text-sm text-zinc-100"
                  onClick={() => selectRange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
