import { NextResponse } from "next/server";
import { HISTORICAL_MCQS } from "@/data/questions";

export async function POST(req: Request) {
  try {
    let answersRaw: any = null;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      answersRaw = body.answers;
    } else if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      const answersStr = formData.get("answers");
      if (answersStr) {
        try {
          answersRaw = JSON.parse(answersStr as string);
        } catch (e) {
          console.error("[SUBMIT_ROUTE] Failed to parse answers from FormData", e);
        }
      }
    }

    if (!answersRaw) {
      return NextResponse.json(
        { success: false, message: "No answers provided or invalid format" },
        { status: 400 }
      );
    }

    // Convert potential array of {question_id, option_id} into a lookup map if needed
    // or keep as is if it's already a map.
    // Based on submitAnswersApi, it sends AnswerPayload[] which is usually array.
    const answersMap: Record<string | number, any> = {};
    if (Array.isArray(answersRaw)) {
      answersRaw.forEach((item: any) => {
        if (item.question_id !== undefined) {
          answersMap[item.question_id] = item.option_id;
        }
      });
    } else {
      // already a map
      Object.assign(answersMap, answersRaw);
    }

    let correctCount = 0;
    let wrongCount = 0;
    let notAttendedCount = 0;

    HISTORICAL_MCQS.forEach((question) => {
      const userSelectedOptionId = answersMap[question.id];

      if (userSelectedOptionId === undefined || userSelectedOptionId === null || userSelectedOptionId === "") {
        notAttendedCount++;
      } else if (Number(userSelectedOptionId) === question.correct_answer_id) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const totalQuestions = HISTORICAL_MCQS.length;
    const score = correctCount; // 1 mark per question

    return NextResponse.json({
      success: true,
      message: "Exam submitted successfully",
      score,
      correct: correctCount,
      wrong: wrongCount,
      not_attended: notAttendedCount,
      total_questions: totalQuestions,
      submitted_at: new Date().toISOString()
    });
  } catch (error) {
    console.error("[SUBMIT_ROUTE_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during submission" },
      { status: 500 }
    );
  }
}