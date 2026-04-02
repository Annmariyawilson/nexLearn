import { memo } from "react";
import Image from "next/image";

interface ExamHeaderProps {
  onLogout: () => void;
}

function ExamHeader({ onLogout }: ExamHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 h-[80px] flex lg:grid lg:grid-cols-3 items-center justify-between px-4 md:px-[60px] lg:px-[80px] shadow-sm">
      <div className="hidden lg:block" /> {/* Left spacer for centering on desktop */}
      
      <div className="flex justify-start lg:justify-center">
        <Image
          src="/assets/logo_blue.png"
          alt="NexLearn"
          width={130}
          height={40}
          className="w-[110px] md:w-[130px] lg:w-[160px] h-auto object-contain"
          priority
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onLogout}
          style={{
            width: '90px',
            height: '40px',
            borderRadius: '6px',
            background: '#177A9C',
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: '13px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="hover:bg-[#156d8c] transition-all"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default memo(ExamHeader);
