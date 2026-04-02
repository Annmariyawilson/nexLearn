"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearTokens } from "@/lib/storage";
import { logoutApi } from "@/lib/api";
import { logoutUser } from "@/store/features/authSlice";
import { resetExam } from "@/store/features/examSlice";

export default function ResultPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { result } = useAppSelector((state) => state.exam);

  useEffect(() => {
    if (!result) {
      router.replace("/exam");
    }
  }, [result, router]);

  const handleDone = async () => {
    dispatch(resetExam());
    try {
      await logoutApi();
    } catch {
    } finally {
      clearTokens();
      dispatch(logoutUser());
      window.location.href = "/";
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
    } finally {
      clearTokens();
      dispatch(logoutUser());
      router.replace("/");
    }
  };

  if (!result) return null;

  const total =
    (result.correct ?? 0) + (result.wrong ?? 0) + (result.not_attended ?? 0);

  return (
    <main className="min-h-screen bg-[#F8FAFB] flex flex-col items-center">
      
      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 h-[80px] flex items-center justify-between px-4 md:px-[60px] lg:px-[80px] shadow-sm">
        <div className="hidden lg:block w-[90px]" /> {/* Spacer for centering */}
        
        <div className="flex-1 flex justify-center lg:justify-center">
          <Image
            src="/assets/logo_blue.png"
            alt="NexLearn"
            width={160}
            height={50}
            className="w-[110px] md:w-[130px] lg:w-[160px] h-auto object-contain"
            priority
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="w-[90px] h-[40px] rounded-[6px] bg-[#177A9C] text-sm font-medium text-white hover:bg-[#156d8c] transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <section className="w-full max-w-[440px] pt-[140px] px-4 flex flex-col items-center pb-20">
        
        {/* Score Header Card */}
        <div 
          className="w-full max-w-[429px] flex flex-col items-center justify-center text-white mb-8 shadow-lg"
          style={{
            height: '150px',
            borderRadius: '17.64px',
            background: "linear-gradient(225deg, #1C3141 0%, #177A9C 100%)",
          }}
        >
          <span 
            className="opacity-90 mb-1 font-inter"
            style={{
              fontWeight: 500,
              fontSize: '18.81px',
              lineHeight: '100%',
            }}
          >
            Marks Obtained:
          </span>
          <h1 
            className="font-inter text-[44px] md:text-[68px]"
            style={{
              fontWeight: 500,
              lineHeight: '144%',
            }}
          >
            {result.score ?? 0} / {total}
          </h1>
        </div>

        {/* Metric Rows */}
        <div className="w-full max-w-[429px] space-y-[18px] mb-10">
          {[
            {
              iconBg: "#E5A42D",
              label: "Total Questions:",
              value: String(total).padStart(3, "0"),
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <path d="M9 17h6"></path><path d="M9 12h6"></path><path d="M9 7h6"></path>
                </svg>
              )
            },
            {
              iconBg: "#4CAF50",
              label: "Correct Answers:",
              value: String(result.correct ?? 0).padStart(3, "0"),
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <polyline points="9 11 12 14 16 8"></polyline>
                </svg>
              )
            },
            {
              iconBg: "#EE3535",
              label: "Incorrect Answers:",
              value: String(result.wrong ?? 0).padStart(3, "0"),
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line>
                </svg>
              )
            },
            {
              iconBg: "#5C5C5C",
              label: "Not Attended Questions:",
              value: String(result.not_attended ?? 0).padStart(3, "0"),
              icon: (
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="3" width="16" height="16" rx="2" ry="2"></rect>
                  <line x1="9" y1="12" x2="15" y2="12"></line>
                </svg>
              )
            }
          ].map((item) => (
            <div 
              key={item.label}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div 
                  className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] text-white"
                  style={{ background: item.iconBg }}
                >
                  {item.icon}
                </div>
                <span className="text-[15px] md:text-[17px] font-medium text-[#5C5C5C] font-inter">{item.label}</span>
              </div>
              <span className="text-[17px] md:text-[20px] font-bold text-[#1C3141] font-inter">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Done Button */}
        <button
          onClick={handleDone}
          style={{
            height: '48px',
            borderRadius: '10px',
            background: '#1C3141',
          }}
          className="w-full max-w-[429px] text-[16px] font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.98]"
        >
          Done
        </button>
      </section>
    </main>
  );
}
