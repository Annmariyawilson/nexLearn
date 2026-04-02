"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getQuestionsApi, logoutApi, submitAnswersApi } from "@/lib/api";
import { clearTokens } from "@/lib/storage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

// ── Components ──
import ExamHeader from "@/components/exam/ExamHeader";
import QuestionSection from "@/components/exam/QuestionSection";
import ExamSidebar from "@/components/exam/ExamSidebar";
import ParagraphModal from "@/components/exam/modals/ParagraphModal";
import SubmitModal from "@/components/exam/modals/SubmitModal";
import SkeletonLoader from "@/components/exam/SkeletonLoader";
import ExamInstructions from "@/components/exam/ExamInstructions";

// ── Redux Actions ──
import {
  setQuestions,
  setCurrentQuestionIndex,
  setAnswer,
  toggleMarkForReview,
  setResult,
} from "@/store/features/examSlice";
import { logoutUser } from "@/store/features/authSlice";

export default function ExamPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    questions,
    currentQuestionIndex,
    selectedAnswers,
    markedForReview,
    meta,
  } = useAppSelector((state) => state.exam);

  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [showParagraph, setShowParagraph] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  /**
   * REFS FOR STALE CLOSURES
   * Ensures the auto-submit logic always has the latest state.
   */
  const latestStateRef = useRef({
    selectedAnswers,
    questions,
    totalQuestions: questions.length,
  });

  useEffect(() => {
    latestStateRef.current = {
      selectedAnswers,
      questions,
      totalQuestions: questions.length,
    };
  }, [selectedAnswers, questions]);

  // ── Sync Initial Data ──
  useEffect(() => {
    async function init() {
      try {
        const data = await getQuestionsApi();
        dispatch(setQuestions(data));
        // We set the timer only when the test starts properly, or keep it ready
        setTimeLeft((data.meta?.total_time || 90) * 60);
      } catch (error) {
        console.error("Fetch failed", error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [dispatch]);

  // ── Timer Logic ──
  useEffect(() => {
    if (loading || !isStarted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, isStarted, timeLeft]);

  // ── Submission Logic ──
  const handleAutoSubmit = async () => {
    const { questions, selectedAnswers } = latestStateRef.current;
    const answers = questions.map((q) => ({
      question_id: q.id,
      selected_option_id: selectedAnswers[q.id] || null,
    }));
    try {
      const data = await submitAnswersApi(answers);
      dispatch(setResult(data));
      router.replace("/result");
    } catch (e) {
      alert("Submission failed during auto-submit");
    }
  };

  const handleFinalSubmit = async () => {
    const answers = questions.map((q) => ({
      question_id: q.id,
      selected_option_id: selectedAnswers[q.id] || null,
    }));
    try {
      const data = await submitAnswersApi(answers);
      dispatch(setResult(data));
      router.replace("/result");
    } catch (e) {
      alert("Failed to submit. Please check your connection.");
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      clearTokens();
      dispatch(logoutUser());
      router.replace("/");
    }
  }, [dispatch, router]);

  const handleStartExam = () => {
    setIsStarted(true);
  };

  const handleSelectAnswer = useCallback((qid: number, oid: number | null) => {
    dispatch(setAnswer({ questionId: qid, optionId: oid }));
    
    // Auto-open submit modal if it's the last question and an answer was picked
    if (oid !== null && currentQuestionIndex === questions.length - 1) {
      setTimeout(() => setShowSubmitModal(true), 400); // Slight delay for UX
    }
  }, [dispatch, currentQuestionIndex, questions.length]);

  const handleToggleMark = useCallback((qid: number) => {
    dispatch(toggleMarkForReview(qid));
  }, [dispatch]);

  const handlePrevious = useCallback(() => {
    dispatch(setCurrentQuestionIndex(Math.max(currentQuestionIndex - 1, 0)));
  }, [dispatch, currentQuestionIndex]);

  const handleNext = useCallback(() => {
    dispatch(setCurrentQuestionIndex(Math.min(currentQuestionIndex + 1, questions.length - 1)));
  }, [dispatch, currentQuestionIndex, questions.length]);

  const handleNavigatePalette = useCallback((index: number) => {
    dispatch(setCurrentQuestionIndex(index));
  }, [dispatch]);

  // ── Computed Values ──
  const currentQuestion = questions[currentQuestionIndex] || null;
  const answeredCount = Object.values(selectedAnswers).filter(v => v !== null).length;

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <main className="min-h-screen bg-[#edf2f5]">
      <ExamHeader onLogout={handleLogout} />

      {!isStarted ? (
        <ExamInstructions
          title={meta?.instruction?.includes("Ancient Indian History") ? "Ancient Indian History MCQ" : "General Examination"}
          meta={meta}
          instructionHtml={meta?.instruction || ""}
          onStart={handleStartExam}
        />
      ) : (
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-4 pt-[74px] pb-6 lg:grid-cols-[1fr_674px]">
          {/* Left: Main Content */}
          <section className="animate-fade-in-up">
            <QuestionSection
              currentQuestion={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              selectedAnswers={selectedAnswers}
              markedForReview={markedForReview}
              onSelectAnswer={handleSelectAnswer}
              onToggleMark={handleToggleMark}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onShowParagraph={() => setShowParagraph(true)}
            />
          </section>

          {/* Right: Sidebar */}
          <section className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <ExamSidebar
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              timeLeft={timeLeft}
              selectedAnswers={selectedAnswers}
              markedForReview={markedForReview}
              onNavigatePalette={handleNavigatePalette}
              onSubmit={() => setShowSubmitModal(true)}
            />
          </section>
        </div>
      )}

      {/* Modals */}
      {showParagraph && (
        <ParagraphModal 
          content={currentQuestion?.comprehension || ""} 
          onClose={() => setShowParagraph(false)} 
        />
      )}
      {showSubmitModal && (
        <SubmitModal
          onClose={() => setShowSubmitModal(false)}
          onConfirm={handleFinalSubmit}
          timeLeft={timeLeft}
          totalQuestions={questions.length}
          answeredCount={answeredCount}
          reviewCount={markedForReview.length}
        />
      )}
    </main>
  );
}