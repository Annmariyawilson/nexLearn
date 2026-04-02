"use client";

import { memo } from "react";

interface ExamInstructionsProps {
  title: string;
  meta: {
    questions_count: number;
    total_marks: number;
    total_time: number;
  } | null;
  instructionHtml: string;
  onStart: () => void;
}

function ExamInstructions({ 
  title, 
  meta, 
  instructionHtml, 
  onStart 
}: ExamInstructionsProps) {
  return (
    <div className="mx-auto max-w-[1000px] pt-[74px] pb-12 animate-fade-in-up">
      <h1 className="text-center text-[26px] font-bold text-[#1e2e3d] mb-10 tracking-tight">
        {title}
      </h1>

      {/* Stats Summary Bar */}
      <div className="bg-[#1f3647] rounded-lg shadow-xl overflow-hidden mb-12 flex items-stretch h-[115px]">
        <div className="flex-1 flex flex-col items-center justify-center border-r border-[#ffffff20]">
          <span className="text-[14px] font-medium text-[#c0d0dd] mb-1">Total MCQ&apos;s:</span>
          <span className="text-[32px] font-bold text-white leading-none">{meta?.questions_count || 100}</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center border-r border-[#ffffff20]">
            <span className="text-[14px] font-medium text-[#c0d0dd] mb-1">Total marks:</span>
            <span className="text-[32px] font-bold text-white leading-none">{meta?.total_marks || 100}</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
            <span className="text-[14px] font-medium text-[#c0d0dd] mb-1">Total time:</span>
            <span className="text-[32px] font-bold text-white leading-none">{meta?.total_time || 90}:00</span>
        </div>
      </div>

      <div className="px-5">
        <h3 className="text-[16px] font-bold text-[#1e2e3d] mb-6">Instructions:</h3>
        
        <div 
           className="exam-instructions-list text-[14px] leading-relaxed text-[#4a5f70] space-y-4"
           dangerouslySetInnerHTML={{ __html: instructionHtml }}
        />

        <div className="mt-16 flex justify-center">
          <button
            onClick={onStart}
            className="bg-[#1f3647] text-white px-24 py-4 rounded text-[15px] font-bold shadow-2xl hover:opacity-95 transition-all transform active:scale-95 border-b-4 border-[#00000040]"
          >
            Start Test
          </button>
        </div>
      </div>

      <style jsx global>{`
        .exam-instructions-list ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }
        .exam-instructions-list li {
          margin-bottom: 0.75rem;
          padding-left: 0.5rem;
        }
      `}</style>
    </div>
  );
}

export default memo(ExamInstructions);
