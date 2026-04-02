import React from "react";

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  stats: {
    timeLeft: string;
    total: number;
    answered: number;
    marked: number;
  };
}

const SubmitModal: React.FC<SubmitModalProps> = ({ isOpen, onClose, onSubmit, stats }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[440px] rounded-2xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-[15px] font-bold text-slate-700">Are you sure you want to submit the test?</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Time Left */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1e2d3d] text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <span className="text-[14px] font-bold text-slate-500">Remaining Time:</span>
            </div>
            <span className="text-[15px] font-extrabold text-slate-800">{stats.timeLeft}</span>
          </div>

          {/* Total Questions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f0ad4e] text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <span className="text-[14px] font-bold text-slate-500">Total Questions:</span>
            </div>
            <span className="text-[15px] font-extrabold text-slate-800">{String(stats.total).padStart(3, '0')}</span>
          </div>

          {/* Answered */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5cb85c] text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </div>
              <span className="text-[14px] font-bold text-slate-500">Questions Answered:</span>
            </div>
            <span className="text-[15px] font-extrabold text-slate-800">{String(stats.answered).padStart(3, '0')}</span>
          </div>

          {/* Marked for Review */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8b0ea7] text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <span className="text-[14px] font-bold text-slate-500">Marked for review:</span>
            </div>
            <span className="text-[15px] font-extrabold text-slate-800">{String(stats.marked).padStart(3, '0')}</span>
          </div>

          {/* Submit Button */}
          <button
            onClick={onSubmit}
            className="w-full mt-4 rounded-lg bg-[#1e2d3d] py-4 text-[14px] font-bold text-white shadow-lg transition-transform active:scale-[0.98]"
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;
