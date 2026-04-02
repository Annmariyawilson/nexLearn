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
    <div className="mx-auto pt-24 md:pt-[150px] pb-12 px-4 animate-fade-in-up flex flex-col items-center w-full">
      {/* Page Title */}
      <h1 
        className="w-full max-w-[345px] text-[22px] md:text-[26px] font-medium leading-[144%] text-[#1C3141] text-center mb-5 md:mb-8 tracking-tight font-inter"
      >
        {title}
      </h1>

      {/* Stats Summary Bar */}
      <div 
        className="w-full max-w-[682px] bg-[#1C3141] rounded-[8px] py-6 px-4 md:px-[10px] flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-[57px] shadow-lg overflow-hidden mb-8"
      >
        {/* MCQ's */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="font-inter font-semibold text-[14px] md:text-[15.82px] leading-[144%] text-white mb-2">Total MCQ’s:</span>
          <span className="text-[36px] md:text-[44px] font-medium text-white leading-none tracking-tight">
            {meta?.questions_count ?? 100}
          </span>
        </div>

        {/* Separator 1 */}
        <div className="hidden md:block w-[1.32px] h-[91.02px] bg-white opacity-40 self-center" />
        <div className="md:hidden w-full h-[1px] bg-white opacity-20" />

        {/* Total Marks */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="font-inter font-semibold text-[14px] md:text-[15.82px] leading-[144%] text-white mb-2">Total marks:</span>
          <span className="text-[36px] md:text-[44px] font-medium text-white leading-none tracking-tight">
            {meta?.total_marks ?? 100}
          </span>
        </div>

        {/* Separator 2 */}
        <div className="hidden md:block w-[1.32px] h-[91.02px] bg-white opacity-40 self-center" />
        <div className="md:hidden w-full h-[1px] bg-white opacity-20" />

        {/* Total Time */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="font-inter font-semibold text-[14px] md:text-[15.82px] leading-[144%] text-white mb-2">Total time:</span>
          <span className="text-[36px] md:text-[44px] font-medium text-white leading-none tracking-tight">
            {meta?.total_time ?? 90}:00
          </span>
        </div>
      </div>

      {/* Instructions Content */}
      <div className="w-full max-w-[680px]">
        <h3 className="font-inter font-semibold text-[16px] text-[#1e2e3d] mb-4">Instructions:</h3>
        
        <div 
           className="exam-instructions-list font-inter font-semibold text-[15px] md:text-[16px] leading-[154%] text-[#5C5C5C]"
           dangerouslySetInnerHTML={{ __html: instructionHtml }}
        />

        {/* Start Button */}
        <div className="mt-10 md:mt-12 flex justify-center w-full">
          <button
            onClick={onStart}
            className="w-full max-w-[361px] h-[48px] rounded-[10px] bg-[#1C3141] text-white font-inter font-semibold text-[16.88px] flex items-center justify-center shadow-md hover:bg-[#2c3e50] transition-all active:scale-95"
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
          margin-bottom: 0.5rem;
          padding-left: 0.5rem;
        }
      `}</style>
    </div>
  );
}

export default memo(ExamInstructions);
