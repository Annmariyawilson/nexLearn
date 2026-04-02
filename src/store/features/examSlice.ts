import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Question, SubmitResult } from "@/types/exam";

interface ExamState {
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswers: Record<number, number | null>;
  markedForReview: number[];
  meta: {
    questions_count: number;
    total_marks: number;
    total_time: number;
    time_for_each_question: number;
    mark_per_each_answer: number;
    instruction: string;
  } | null;
  result: SubmitResult | null;
}

const initialState: ExamState = {
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswers: {},
  markedForReview: [],
  meta: null,
  result: null,
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<{ questions: Question[]; meta: ExamState["meta"] }>) => {
      state.questions = action.payload.questions;
      state.meta = action.payload.meta;
    },
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    setAnswer: (
      state,
      action: PayloadAction<{ questionId: number; optionId: number | null }>
    ) => {
      state.selectedAnswers[action.payload.questionId] = action.payload.optionId;
    },
    toggleMarkForReview: (state, action: PayloadAction<number>) => {
      if (state.markedForReview.includes(action.payload)) {
        state.markedForReview = state.markedForReview.filter(
          (id) => id !== action.payload
        );
      } else {
        state.markedForReview.push(action.payload);
      }
    },
    setResult: (state, action: PayloadAction<SubmitResult>) => {
      state.result = action.payload;
    },
    resetExam: () => initialState,
  },
});

export const {
  setQuestions,
  setCurrentQuestionIndex,
  setAnswer,
  toggleMarkForReview,
  setResult,
  resetExam,
} = examSlice.actions;

export default examSlice.reducer;