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
    <aside className="flex flex-col h-full">
      {/* ── Sidebar Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 px-1 gap-4 sm:gap-0">
        <h3 className="text-[16px] font-semibold text-[#1C3141] font-inter">Question No. Sheet:</h3>
        <div className="hidden lg:flex items-center gap-3">
          <span className="text-[12px] font-medium text-[#5C5C5C] font-inter whitespace-nowrap">Remaining Time:</span>
          <TimerDisplay timeLeft={timeLeft} />
        </div>
      </div>

      {/* ── Palette Grid ── */}
      <div className="p-0 mb-6 flex-1 min-h-[480px] mt-0">
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-x-2 lg:gap-x-[12px] gap-y-3 lg:gap-y-[10px] justify-items-center">
          {questions.map((q, index) => {
            const answered = selectedAnswers[q.id] != null;
            const review = markedForReview.includes(q.id);
            const isCurrent = currentQuestionIndex === index;
            
            let bg = "bg-white text-slate-700 border-[#CECECE]";
            
            if (answered && review) {
              bg = "bg-[#4CAF50] text-white border-[3px] border-[#800080]";
            } else if (review) {
              bg = "bg-[#800080] text-white border-[#800080]";
            } else if (answered) {
              bg = "bg-[#4CAF50] text-white border-[#4CAF50]";
            } else if (index < currentQuestionIndex) {
               bg = "bg-[#EE3535] text-white border-[#EE3535]";
            }

            return (
              <button
                key={q.id}
                onClick={() => onNavigatePalette(index)}
                style={{
                  width: '44px',
                  height: '44px',
                  fontFamily: 'Inter',
                }}
                className={`flex items-center justify-center rounded-[4px] border transition-all text-[14px] font-semibold hover:brightness-95 ${bg} ${
                  isCurrent ? "ring-2 ring-black ring-offset-2 z-10 scale-105" : ""
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Legend Section ── */}
      <div className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-1.5 pb-6">
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="h-3 w-3 rounded-[2px] bg-[#4CAF50]" />
            <span className="text-[9px] lg:text-[11px] font-bold text-[#5C5C5C]">Attended</span>
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="h-3 w-3 rounded-[2px] bg-[#EE3535]" />
            <span className="text-[9px] lg:text-[11px] font-bold text-[#5C5C5C]">Not attended</span>
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="h-3 w-3 rounded-[2px] bg-[#800080]" />
            <span className="text-[9px] lg:text-[11px] font-bold text-[#5C5C5C]">Marked for review</span>
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="h-3 w-3 rounded-[2px] bg-[#4CAF50] border border-[#800080]" />
            <span className="text-[9px] lg:text-[11px] font-bold text-[#5C5C5C]">Answered & marked</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default memo(ExamSidebar);
