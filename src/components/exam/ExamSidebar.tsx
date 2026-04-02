"use client";

import { memo } from "react";
import { Question } from "@/types/exam";
import TimerDisplay from "./TimerDisplay";

interface ExamSidebarProps {
  questions: Question[];
  currentQuestionIndex: number;
  timeLeft: number;
  selectedAnswers: Record<number, number | null>;
  markedForReview: number[];
  onSubmit: () => void;
  onNavigatePalette: (index: number) => void;
}

function ExamSidebar({
  questions,
  currentQuestionIndex,
  timeLeft,
  selectedAnswers,
  markedForReview,
  onNavigatePalette,
}: ExamSidebarProps) {
  return (
    <aside className="flex flex-col gap-5 w-[674px] min-h-[743px] max-w-full">
      {/* ── Sidebar Header ── */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[14px] font-bold text-slate-700 tracking-tight">Question No. Sheet:</h3>
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-bold text-slate-500">Remaining Time:</span>
          <TimerDisplay timeLeft={timeLeft} />
        </div>
      </div>

      {/* ── Palette Grid (10 Columns) ── */}
      <div className="bg-white border border-[#d3e0e8] p-4 rounded-sm shadow-sm overflow-hidden min-h-[480px]">
        <div className="grid grid-cols-10 gap-x-2 gap-y-3">
          {questions.map((q, index) => {
            const answered = selectedAnswers[q.id] != null;
            const review = markedForReview.includes(q.id);
            const current = currentQuestionIndex === index;
            
            let bg = "bg-white text-slate-700 border-slate-200";
            
            if (answered && review) {
              bg = "bg-[#59ae5b] text-white border-[3px] border-[#8b0ea7]";
            } else if (review) {
              bg = "bg-[#8b0ea7] text-white border-[#8b0ea7]";
            } else if (answered) {
              bg = "bg-[#59ae5b] text-white border-[#59ae5b]";
            } else if (index < currentQuestionIndex) {
               bg = "bg-[#eb4335] text-white border-[#eb4335]";
            }

            return (
              <button
                key={q.id}
                onClick={() => onNavigatePalette(index)}
                className={`flex h-[54px] w-full items-center justify-center rounded-sm border text-[14px] font-bold transition-all hover:brightness-95 ${bg} ${
                  current ? "ring-2 ring-black ring-offset-2 z-10" : ""
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Legend Section ── */}
      <div className="bg-white border-0 py-2">
        <div className="grid grid-cols-4 gap-2">
           <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-sm bg-[#59ae5b]" />
            <span className="text-[11px] font-bold text-slate-600">Attended</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-sm bg-[#eb4335]" />
            <span className="text-[11px] font-bold text-slate-600">Not Attended</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-sm bg-[#8b0ea7]" />
            <span className="text-[11px] font-bold text-slate-600 uppercase">Marked For Review</span>
          </div>
           <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-sm bg-[#59ae5b] border-2 border-[#8b0ea7]" />
            <span className="text-[11px] font-bold text-slate-600 leading-tight">Answered and Marked For Review</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default memo(ExamSidebar);
