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
  onSubmit: () => void;
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
  onSubmit,
  onShowParagraph,
}: QuestionSectionProps) {
  if (!currentQuestion) return null;

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="flex-1 flex flex-col h-full gap-5">
      {/* ── Question Card ── */}
      <div className="bg-white rounded-lg border border-[#E9EBEC] p-5 shadow-sm min-h-[200px]">
        <div className="mb-6 flex">
          <button
            onClick={onShowParagraph}
            className="bg-[#177A9C] text-white rounded-md flex items-center justify-center gap-[10px] hover:bg-[#156d8c] transition-all w-full sm:w-auto sm:min-w-[293px] min-h-[44px] h-auto py-2 px-4 shadow-sm"
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '13.81px',
              lineHeight: '1',
            }}
          >
            <svg width="18" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 hidden sm:block"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10M7 12h10" /></svg>
            <span className="whitespace-nowrap">Read Comprehensive Paragraph</span>
            <svg width="13" height="8" viewBox="0 0 13 8" fill="currentColor" className="-rotate-90 shrink-0 hidden sm:block"><path d="M6.5 8L0 0H13L6.5 8Z" /></svg>
          </button>
        </div>

        <div className="flex items-start gap-3 mb-6">
          <span className="text-[17px] font-bold text-[#1C3141] font-inter">
            {currentQuestionIndex + 1}.
          </span>
          <p className="text-[17px] font-bold leading-relaxed text-[#1C3141] font-inter">
            {currentQuestion.question_text}
          </p>
        </div>

        {currentQuestion.image && (
          <div className="w-full sm:w-[320px] h-[180px] overflow-hidden rounded-[4px] border border-[#E9EBEC]">
            <Image
              src={currentQuestion.image}
              alt="Question Visual"
              width={320}
              height={180}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        )}
      </div>

      {/* ── Options Selection Area ── */}
      <div className="flex flex-col gap-3">
        <h4 className="text-[11px] font-bold text-[#5C5C5C] uppercase tracking-wider mb-2">
          Choose the answer :
        </h4>
        
        <div className="flex flex-col gap-[12px]">
          {currentQuestion.options.map((option, index) => {
            const isChecked = selectedAnswers[currentQuestion.id] === option.id;
            const labels = ["A.", "B.", "C.", "D."];

            return (
              <label
                key={option.id}
                className={`flex cursor-pointer items-center justify-between transition-all px-5 h-[44px] rounded-[4px] border ${
                  isChecked ? "border-[#1C3141] bg-slate-50" : "border-[#E9EBEC] bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[16px] font-bold text-[#1C3141]">
                    {labels[index]} {option.option_text}
                  </span>
                </div>
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isChecked ? "border-[#1C3141]" : "border-[#CECECE]"
                }`}>
                  {isChecked && <div className="h-2.5 w-2.5 rounded-full bg-[#1C3141]" />}
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
      </div>

      {/* ── Bottom Controls ── */}
      <div className="mt-auto pt-6 flex flex-wrap sm:flex-nowrap gap-3 w-full">
        <button
          onClick={() => onToggleMark(currentQuestion.id)}
          className="h-[46px] w-full sm:flex-1 min-w-[120px] rounded-[6px] bg-[#800080] text-white font-bold text-[14px] hover:brightness-110 active:scale-[0.98] transition-all"
        >
          Mark for review
        </button>
        <button
          onClick={onPrevious}
          disabled={currentQuestionIndex === 0}
          className="h-[46px] w-full sm:flex-1 min-w-[120px] rounded-[6px] bg-[#CECECE] text-[#1C3141] font-bold text-[14px] hover:brightness-95 disabled:opacity-50 active:scale-[0.98] transition-all"
        >
          Previous
        </button>
        {isLastQuestion ? (
          <button
            onClick={onSubmit}
            className="h-[46px] w-full sm:flex-1 min-w-[120px] rounded-[6px] bg-[#4CAF50] text-white font-bold text-[14px] hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={onNext}
            className="h-[46px] w-full sm:flex-1 min-w-[120px] rounded-[6px] bg-[#1C3141] text-white font-bold text-[14px] hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(QuestionSection);
