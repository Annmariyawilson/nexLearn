import api from "./axios";
import { AnswerPayload, Question, RawOption, RawQuestion } from "@/types/exam";

export const sendOtpApi = async (mobile: string) => {
  const formData = new FormData();
  formData.append("mobile", mobile);

  const res = await api.post("/auth/send-otp", formData);
  return res.data;
};

export const verifyOtpApi = async (mobile: string, otp: string) => {
  const formData = new FormData();
  formData.append("mobile", mobile);
  formData.append("otp", otp);

  const res = await api.post("/auth/verify-otp", formData);
  return res.data;
};

export const createProfileApi = async (payload: {
  mobile: string;
  name: string;
  email: string;
  qualification: string;
  profile_image: File;
}) => {
  const formData = new FormData();
  formData.append("mobile", payload.mobile);
  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("qualification", payload.qualification);
  formData.append("profile_image", payload.profile_image);

  const res = await api.post("/auth/create-profile", formData);
  return res.data;
};

export const logoutApi = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

/** 
 * NORMALIZER
 * Converts raw API responses into the state shape the UI expects.
 */
function normalizeQuestions(rawQuestions: RawQuestion[]): Question[] {
  return rawQuestions.map((rq) => {
    // Determine the question ID from multiple possible API properties
    const id = rq.id || rq.question_id || 0;
    
    // Determine question text
    const question_text = rq.question_text || rq.question || rq.text || "";
    
    // Determine image
    const image = rq.image || rq.question_image || null;

    // Normalize options
    const options = (rq.options || []).map((ro: RawOption) => ({
      id: ro.id || ro.option_id || 0,
      option_text: ro.option_text || ro.option || ro.text || "",
    }));

    return {
      id,
      question_text,
      image,
      comprehension: rq.comprehension || null,
      options,
    };
  });
}

export const getQuestionsApi = async () => {
  const res = await api.get("/question/list");
  const { questions, ...meta } = res.data;
  
  return {
    questions: normalizeQuestions(questions),
    meta: {
      questions_count: meta.questions_count || 10,
      total_marks: meta.total_marks || 10,
      total_time: meta.total_time || 90,
      time_for_each_question: meta.time_for_each_question || 0.9,
      mark_per_each_answer: meta.mark_per_each_answer || 1,
      instruction: meta.instruction || "Please complete the exam.",
    }
  };
};

export const submitAnswersApi = async (answers: AnswerPayload[]) => {
  const formData = new FormData();
  formData.append("answers", JSON.stringify(answers));

  const res = await api.post("/answers/submit", formData);
  return res.data;
};