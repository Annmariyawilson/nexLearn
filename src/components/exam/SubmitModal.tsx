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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="w-full max-w-[440px] rounded-[24px] bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 pb-4">
          <h2 className="text-[19px] font-bold text-[#1C3141] font-inter">
            Are you sure you want to submit the test?
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="px-8 flex flex-col pt-0">
          <div className="h-[1px] w-full bg-[#E9EBEC] mb-8" />

          {/* Content Rows */}
          <div className="space-y-6 mb-10">
            
            {/* Remaining Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[8px] bg-[#1C3141] text-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <span className="text-[17px] font-medium text-[#5C5C5C] font-inter">Remaining Time:</span>
              </div>
              <span className="text-[20px] font-bold text-[#1C3141] font-inter">
                {stats.timeLeft}
              </span>
            </div>

            {/* Total Questions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[8px] bg-[#E5A42D] text-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <path d="M9 17h6"></path><path d="M9 12h6"></path><path d="M9 7h6"></path>
                    <circle cx="18" cy="18" r="4" fill="#E5A42D" stroke="#fff" strokeWidth="1"></circle>
                    <text x="16" y="20" fontSize="5" fill="#fff" fontWeight="bold">?</text>
                  </svg>
                </div>
                <span className="text-[17px] font-medium text-[#5C5C5C] font-inter">Total Questions:</span>
              </div>
              <span className="text-[20px] font-bold text-[#1C3141] font-inter">
                {String(stats.total).padStart(3, '0')}
              </span>
            </div>

            {/* Questions Answered */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[8px] bg-[#4CAF50] text-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <polyline points="9 11 12 14 16 8"></polyline>
                    <circle cx="18" cy="18" r="4" fill="#4CAF50" stroke="#fff" strokeWidth="1"></circle>
                    <text x="16" y="20" fontSize="5" fill="#fff" fontWeight="bold">?</text>
                  </svg>
                </div>
                <span className="text-[17px] font-medium text-[#5C5C5C] font-inter">Questions Answered:</span>
              </div>
              <span className="text-[20px] font-bold text-[#1C3141] font-inter">
                {String(stats.answered).padStart(3, '0')}
              </span>
            </div>

            {/* Marked for review */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[8px] bg-[#800080] text-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="3" width="16" height="16" rx="2" ry="2"></rect>
                    <path d="M12 3v12l-4-4-4 4V3h8z"></path>
                    <circle cx="18" cy="18" r="4" fill="#800080" stroke="#fff" strokeWidth="1"></circle>
                    <text x="16" y="20" fontSize="5" fill="#fff" fontWeight="bold">?</text>
                  </svg>
                </div>
                <span className="text-[17px] font-medium text-[#5C5C5C] font-inter">Marked for review:</span>
              </div>
              <span className="text-[20px] font-bold text-[#1C3141] font-inter">
                {String(stats.marked).padStart(3, '0')}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={onSubmit}
            className="w-full mb-8 rounded-[12px] bg-[#1C3141] py-[18px] text-[18px] font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;
