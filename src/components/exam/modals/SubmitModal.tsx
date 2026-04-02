"use client";

import React from "react";

interface SubmitModalProps {
  onClose: () => void;
  onConfirm: () => void;
  timeLeft: number;
  totalQuestions: number;
  answeredCount: number;
  reviewCount: number;
}

export default function SubmitModal({
  onClose,
  onConfirm,
  timeLeft,
  totalQuestions,
  answeredCount,
  reviewCount,
}: SubmitModalProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-fade-in-up">
      <div className="w-full max-w-[440px] rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-[15px] font-bold text-slate-700 leading-tight">
            Are you sure you want to submit the test?
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 transition-all p-1"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Modal Statistics */}
        <div className="p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-lg bg-[#1a2d3d] text-white">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
              </div>
              <span className="text-[14.5px] font-bold text-slate-500">Remaining Time:</span>
            </div>
            <span className="text-[16px] font-extrabold text-slate-800 tabular-nums">{formatTime(timeLeft)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
               <div className="flex h-[38px] w-[38px] items-center justify-center rounded-lg bg-[#f39c12] text-white">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
                </svg>
              </div>
              <span className="text-[14.5px] font-bold text-slate-500">Total Questions:</span>
            </div>
            <span className="text-[16px] font-extrabold text-slate-800 tabular-nums">{String(totalQuestions).padStart(3, "0")}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-lg bg-[#5cb85c] text-white">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <span className="text-[14.5px] font-bold text-slate-500">Questions Answered:</span>
            </div>
            <span className="text-[16px] font-extrabold text-slate-800 tabular-nums">{String(answeredCount).padStart(3, "0")}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-lg bg-[#8b0ea7] text-white">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                </svg>
              </div>
              <span className="text-[14.5px] font-bold text-slate-500">Marked for review:</span>
            </div>
            <span className="text-[16px] font-extrabold text-slate-800 tabular-nums">{String(reviewCount).padStart(3, "0")}</span>
          </div>

          {/* Submit Action */}
          <button
            onClick={onConfirm}
            className="w-full mt-6 rounded-lg bg-[#1e2d3d] py-4 text-[14.5px] font-bold text-white shadow-lg transition-transform active:scale-[0.98] hover:bg-[#253748]"
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
}
