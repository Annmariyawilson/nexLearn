import { memo } from "react";
import Image from "next/image";

interface ExamHeaderProps {
  onLogout: () => void;
}

function ExamHeader({ onLogout }: ExamHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 h-[64px] flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center">
        <Image
          src="/assets/logo_blue.png"
          alt="NexLearn"
          width={130}
          height={40}
          className="h-9 w-auto"
          priority
        />
      </div>

      <div className="flex items-center">
        <button
          onClick={onLogout}
          className="bg-[#0e7490] text-white px-7 py-2 rounded text-[13px] font-bold hover:brightness-110 transition-all border border-[#0d6d87]"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default memo(ExamHeader);
