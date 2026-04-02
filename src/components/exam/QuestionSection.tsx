"use client";

import { memo } from "react";
import Image from "next/image";
import { Question } from "@/types/exam";

interface QuestionSectionProps {
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswers: Record<number, number | null>;
  markedForReview: number[];
  onSelectAnswer: (qid: number, oid: number | null) => void;
  onToggleMark: (qid: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onShowParagraph: () => void;
}

function QuestionSection({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswers,
  markedForReview,
  onSelectAnswer,
  onToggleMark,
  onPrevious,
  onNext,
  onShowParagraph,
}: QuestionSectionProps) {
  if (!currentQuestion) return null;

  return (
    <div className="flex flex-col">
      {/* ── Status Bar ── */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-slate-700 tracking-tight">
          Web Design & Development MCQ
        </h2>
        <div className="bg-[#f2f6f9] border border-[#d6dee5] px-3.5 py-1.5 rounded">
          <span className="text-[13px] font-bold text-slate-600">
            {String(currentQuestionIndex + 1).padStart(2, "0")}/{String(totalQuestions).padStart(3, "0")}
          </span>
        </div>
      </div>

      {currentQuestion.comprehension && (
        <div className="mb-5">
          <button
            onClick={onShowParagraph}
            className="flex items-center gap-2 rounded bg-[#0e7490] px-3.5 py-2.5 text-[12px] font-bold text-white shadow-sm hover:bg-[#0c667f] transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM13 3.5l5.5 5.5H13V3.5zM8 17h8v2H8v-2zm0-4h8v2H8v-2z" />
            </svg>
            Read Comprehensive Paragraph ▶
          </button>
        </div>
      )}

      {/* ── Question Card ── */}
      <div className="bg-white border border-[#d3e0e8] p-6 rounded-sm mb-6 min-h-[340px]">
        <div className="flex items-start gap-1.5 mb-6">
          <span className="text-[16px] font-bold text-slate-800 leading-normal">
            {currentQuestionIndex + 1}.
          </span>
          <p className="text-[16px] font-medium text-slate-800 leading-relaxed">
            {currentQuestion.question_text}
          </p>
        </div>

        {currentQuestion.image && (
          <div className="mt-4 max-w-[440px] overflow-hidden rounded border border-slate-100">
            <Image
              src={currentQuestion.image}
              alt="Indus Valley"
              width={440}
              height={260}
              className="w-full h-auto object-cover"
              unoptimized
            />
          </div>
        )}
      </div>

      {/* ── Options ── */}
      <div className="space-y-3.5">
        <p className="px-1 text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wide">
          Choose the answer :
        </p>
        
        {currentQuestion.options.map((option, index) => {
          const isChecked = selectedAnswers[currentQuestion.id] === option.id;
          const labels = ["A.", "B.", "C.", "D."];

          return (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center justify-between rounded-sm border px-5 py-4 transition-all duration-150 ${
                isChecked
                  ? "border-slate-800 bg-white"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center">
                <span className="text-[15px] font-bold text-slate-800">
                  {labels[index]} {option.option_text}
                </span>
              </div>
              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${isChecked ? "border-slate-800" : "border-slate-300"}`}>
                {isChecked && <div className="h-2.5 w-2.5 rounded-full bg-slate-800" />}
              </div>
              <input
                type="radio"
                className="hidden"
                checked={isChecked}
                onChange={() => onSelectAnswer(currentQuestion.id, option.id)}
              />
            </label>
          );
        })}
      </div>

      {/* ── Navigation Buttons ── */}
      <div className="mt-10 grid grid-cols-3 gap-6">
        <button
          onClick={() => onToggleMark(currentQuestion.id)}
          className="rounded py-4 text-[13px] font-extrabold text-white bg-[#8b0ea7] filter hover:brightness-110 active:opacity-80"
        >
          Mark for review
        </button>
        <button
          onClick={onPrevious}
          disabled={currentQuestionIndex === 0}
          className="rounded py-4 text-[13px] font-extrabold text-slate-700 bg-[#cfd7dc] disabled:opacity-50"
        >
          Pervious
        </button>
        <button
          onClick={onNext}
          disabled={currentQuestionIndex === totalQuestions - 1}
          className="rounded py-4 text-[13px] font-extrabold text-white bg-[#1e2d3d] disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default memo(QuestionSection);
