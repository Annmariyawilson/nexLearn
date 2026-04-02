"use client";

import { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getQuestionsApi, logoutApi, submitAnswersApi } from "@/lib/api";
import { clearTokens } from "@/lib/storage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

// ── Heavy Modules (Dynamic Imports) ──
const ParagraphModal = dynamic(() => import("@/components/exam/modals/ParagraphModal"), { ssr: false });
const SubmitModal = dynamic(() => import("@/components/exam/modals/SubmitModal"), { ssr: false });

// ── Components (Memoized) ──
import ExamHeader from "@/components/exam/ExamHeader";
import QuestionSection from "@/components/exam/QuestionSection";
import ExamSidebar from "@/components/exam/ExamSidebar";
import TimerDisplay from "@/components/exam/TimerDisplay";
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

const COMPREHENSIVE_TEXT = `Ancient Indian history spans several millennia and offers a profound glimpse into the origins of one of the world's oldest and most diverse civilizations. It begins with the Indus Valley Civilization (c. 2500–1500 BCE), which is renowned for its advanced urban planning, architecture, and water management systems. Cities like Harappa and Mohenjo-Daro were highly developed, with sophisticated drainage systems and well-organized streets, showcasing the early brilliance of Indian civilization. The decline of this civilization remains a mystery, but it marks the transition to the next significant phase in Indian history.

Following the Indus Valley Civilization, the Vedic Period (c. 1500–600 BCE) saw the arrival of the Aryans in northern India. This period is characterized by the composition of the Vedas, which laid the foundations of Hinduism and early Indian society. 

It was during this time that the varna system (social hierarchy) began to develop, which later evolved into the caste system. The Vedic Age also witnessed the rise of important kingdoms and the spread of agricultural practices across the region, significantly impacting the social and cultural fabric of ancient India.

The 6th century BCE marked a turning point with the emergence of new religious and philosophical movements. Buddhism and Jainism, led by Gautama Buddha and Mahavira, challenged the existing Vedic orthodoxy and offered alternative paths to spiritual enlightenment. These movements gained widespread popularity and had a lasting influence on Indian society and culture. During this time, the kingdom of Magadha became one of the most powerful, laying the groundwork for future empires.

The Maurya Empire (c. 322–185 BCE), founded by Chandragupta Maurya, became the first large empire to unify much of the Indian subcontinent. Under Ashoka the Great, the empire reached its zenith, and Buddhism flourished both in India and abroad. Ashoka's support for non-violence, his spread of Buddhist teachings, and his contributions to governance and infrastructure had a lasting legacy on Indian history. His reign marks one of the earliest and most notable examples of state-sponsored religious tolerance and moral governance.`;

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

  // ── Refs for Latest State to avoid stale closures in Timer/Callbacks ──
  const latestStateRef = useRef({
    selectedAnswers,
    questions,
  });

  useEffect(() => {
    latestStateRef.current = { selectedAnswers, questions };
  }, [selectedAnswers, questions]);

  // ── Sync Initial Data (Optimized with error boundary) ──
  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const data = await getQuestionsApi();
        if (isMounted) {
          dispatch(setQuestions(data));
          setTimeLeft((data.meta?.total_time || 90) * 60);
        }
      } catch (error) {
        console.error("Fetch failed", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    init();
    return () => { isMounted = false; };
  }, [dispatch]);

  // ── Timer Logic (High-Precision Interval) ──
  useEffect(() => {
    if (loading || !isStarted || timeLeft <= 0) return;
    const startTime = Date.now();
    const initialTime = timeLeft;

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(initialTime - elapsed, 0);

      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(timer);
        handleAutoSubmit();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isStarted]); // Removed timeLeft from deps to avoid frequent interval resets

  // ── Generic Submission (Memoized) ──
  const performSubmission = useCallback(async (isAuto = false) => {
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
      if (!isAuto) alert("Failed to submit. Please check your connection.");
    }
  }, [dispatch, router]);

  const handleAutoSubmit = useCallback(() => performSubmission(true), [performSubmission]);
  const handleFinalSubmit = useCallback(() => performSubmission(false), [performSubmission]);

  const handleLogout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      clearTokens();
      dispatch(logoutUser());
      router.replace("/");
    }
  }, [dispatch, router]);

  const handleStartExam = useCallback(() => setIsStarted(true), []);

  const handleSelectAnswer = useCallback((qid: number, oid: number | null) => {
    dispatch(setAnswer({ questionId: qid, optionId: oid }));
    if (oid !== null && currentQuestionIndex === questions.length - 1) {
      setTimeout(() => setShowSubmitModal(true), 300);
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

  // ── Memoized Computations ──
  const currentQuestion = useMemo(() => questions[currentQuestionIndex] || null, [questions, currentQuestionIndex]);
  const answeredCount = useMemo(() => Object.values(selectedAnswers).filter(v => v !== null).length, [selectedAnswers]);
  const totalQuestionsLen = questions.length;

  if (loading) return <SkeletonLoader />;

  return (
    <main className="min-h-screen bg-[#edf2f5]">
      <ExamHeader onLogout={handleLogout} />

      {!isStarted ? (
        <ExamInstructions
          title="Ancient Indian History MCQ"
          meta={meta}
          instructionHtml={meta?.instruction || ""}
          onStart={handleStartExam}
        />
      ) : (
        <div className="mx-auto max-w-[1600px] pt-[100px] px-4 pb-12 flex flex-col flex-1">
          {/* Mobile-only Timer Section */}
          <div className="lg:hidden mb-6">
            <div className="bg-white rounded-lg border border-[#E9EBEC] p-4 flex items-center justify-between shadow-sm">
              <span className="text-[14px] font-semibold text-[#1C3141] font-inter">Remaining Time:</span>
              <TimerDisplay timeLeft={timeLeft} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_1px_minmax(0,1fr)] gap-0 items-stretch flex-1 leading-normal">
            <div className="lg:pr-10 pb-10 lg:pb-0 flex flex-col min-w-0">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-[18px] font-medium text-[#1C3141] font-inter">
                  Ancient Indian History MCQ
                </h1>
                <div className="bg-white px-3 py-1 rounded-[4px] border border-[#E9EBEC] shadow-sm">
                   <span className="text-[16px] font-medium text-[#5C5C5C]">
                    {String(currentQuestionIndex + 1).padStart(2, "0")}/{totalQuestionsLen}
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <QuestionSection
                  currentQuestion={currentQuestion}
                  currentQuestionIndex={currentQuestionIndex}
                  totalQuestions={totalQuestionsLen}
                  selectedAnswers={selectedAnswers}
                  markedForReview={markedForReview}
                  onSelectAnswer={handleSelectAnswer}
                  onToggleMark={handleToggleMark}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onSubmit={() => setShowSubmitModal(true)}
                  onShowParagraph={() => setShowParagraph(true)}
                />
              </div>
            </div>

            <div className="hidden lg:block w-[1px] bg-[#D7DADD]" />

            <div className="lg:pl-10 mt-10 lg:mt-0 flex flex-col min-w-0">
              <ExamSidebar
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                timeLeft={timeLeft}
                selectedAnswers={selectedAnswers}
                markedForReview={markedForReview}
                onNavigatePalette={handleNavigatePalette}
                onSubmit={() => setShowSubmitModal(true)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Lazy Modals with Suspense */}
      <Suspense fallback={null}>
        {showParagraph && (
          <ParagraphModal 
            content={COMPREHENSIVE_TEXT} 
            onClose={() => setShowParagraph(false)} 
          />
        )}
        {showSubmitModal && (
          <SubmitModal
            onClose={() => setShowSubmitModal(false)}
            onConfirm={handleFinalSubmit}
            timeLeft={timeLeft}
            totalQuestions={totalQuestionsLen}
            answeredCount={answeredCount}
            reviewCount={markedForReview.length}
          />
        )}
      </Suspense>
    </main>
  );
}