/** Normalized option shape used throughout the app */
export interface Option {
  id: number;
  option_text: string;
}

/** Normalized question shape stored in Redux */
export interface Question {
  id: number;
  question_text: string;
  image?: string | null;
  comprehension?: string | null;
  options: Option[];
}

/** Local question with a known correct answer (used in data file only) */
export interface LocalQuestion extends Question {
  correct_answer_id: number;
}

/** Raw option from API — may use option_id instead of id and variations of text */
export interface RawOption {
  id?: number;
  option_id?: number;
  option_text?: string;
  option?: string;
  text?: string;
}

/** Raw question from API — may use question_id instead of id and variations of text */
export interface RawQuestion {
  id?: number;
  question_id?: number;
  question_text?: string;
  question?: string;
  text?: string;
  question_image?: string | null;
  image?: string | null;
  comprehension?: string | null;
  options: RawOption[];
}

export interface AnswerPayload {
  question_id: number;
  selected_option_id: number | null;
}

export interface SubmitResult {
  exam_history_id: string;
  score: number;
  correct: number;
  wrong: number;
  not_attended: number;
  submitted_at: string;
  details: unknown[];
}