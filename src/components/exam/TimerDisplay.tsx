"use client";

import { memo } from "react";

interface TimerDisplayProps {
  timeLeft: number;
}

function TimerDisplay({ timeLeft }: TimerDisplayProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2 rounded bg-slate-900 px-3 py-1.5 text-white shadow-sm">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="text-[13px] font-bold tabular-nums">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}

export default memo(TimerDisplay);
