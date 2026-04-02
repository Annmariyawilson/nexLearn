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
      router.replace("/");
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
    <main className="min-h-screen bg-[#edf2f5]">
      <header className="exam-topbar">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/logo_blue.png"
            alt="NexLearn"
            width={115}
            height={36}
            className="exam-logo-blue"
          />
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <section className="mx-auto max-w-[480px] px-4 py-12 animate-fade-in-up">
        <div
          className="result-card shadow-soft"
          style={{
            background:
              "linear-gradient(307.95deg, #1C3141 2.54%, #177A9C 79.7%)",
          }}
        >
          <p className="mb-2 text-sm uppercase tracking-wide opacity-70">
            Marks Obtained:
          </p>
          <p className="text-5xl font-bold">
            {result.score ?? 0}{" "}
            <span className="text-2xl opacity-60">/ {total}</span>
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              icon: "Q",
              label: "Total Questions:",
              value: String(total).padStart(3, "0"),
              color: "#475569",
              iconBg: "#e2e8f0",
              valColor: "text-slate-800",
            },
            {
              icon: "✓",
              label: "Correct Answers:",
              value: String(result.correct ?? 0).padStart(3, "0"),
              color: "#fff",
              iconBg: "#22c55e",
              valColor: "text-green-600",
            },
            {
              icon: "✕",
              label: "Incorrect Answers:",
              value: String(result.wrong ?? 0).padStart(3, "0"),
              color: "#fff",
              iconBg: "#ef4444",
              valColor: "text-red-500",
            },
            {
              icon: "–",
              label: "Not Attended Questions:",
              value: String(result.not_attended ?? 0).padStart(3, "0"),
              color: "#fff",
              iconBg: "#94a3b8",
              valColor: "text-slate-400",
            },
          ].map((item, idx) => (
            <div
              key={item.label}
              className="result-row transition-transform hover:scale-[1.01]"
              style={{ animationDelay: `${(idx + 1) * 0.1}s` }}
            >
              <div className="flex items-center">
                <span
                  className="result-icon font-bold"
                  style={{ background: item.iconBg, color: item.color }}
                >
                  {item.icon}
                </span>
                <span className="text-slate-600">{item.label}</span>
              </div>
              <span className={`font-bold ${item.valColor}`}>{item.value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleDone}
          className="primary-btn mt-8 transition-transform active:scale-[0.98]"
        >
          Done
        </button>
      </section>
    </main>
  );
}
