"use client";

interface ParagraphModalProps {
  content: string;
  onClose: () => void;
}

export default function ParagraphModal({ content, onClose }: ParagraphModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="paragraph-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="w-full max-w-[1410px] h-[633px] max-h-[90vh] rounded-xl bg-white shadow-2xl animate-fade-in-up flex flex-col overflow-hidden">
        <div className="border-b border-slate-100 px-12 py-6">
          <h3 id="paragraph-modal-title" className="text-lg font-bold text-slate-800">
            Comprehensive Paragraph
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto px-12 py-10 text-[15px] leading-8 text-slate-600">
          <div className="whitespace-pre-wrap">{content}</div>
        </div>
        
        <div className="px-12 py-8 flex justify-center bg-slate-50/50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="rounded bg-[#1f3647] px-20 py-3 text-sm font-bold text-white hover:opacity-90 shadow-lg transition-all active:scale-95"
          >
            Minimize
          </button>
        </div>
      </div>
    </div>
  );
}
