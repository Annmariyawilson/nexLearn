import { NextResponse } from "next/server";
import { HISTORICAL_MCQS } from "@/data/questions";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      questions: HISTORICAL_MCQS,
      questions_count: HISTORICAL_MCQS.length,
      total_marks: HISTORICAL_MCQS.length,
      total_time: 90,
      time_for_each_question: 0.9,
      mark_per_each_answer: 1,
      instruction: `
        <ol>
          <li>You have 90 minutes to complete the test.</li>
          <li>Test consists of 100 multiple-choice q's.</li>
          <li>You are allowed 2 retest attempts if you do not pass on the first try.</li>
          <li>Each incorrect answer will incur a negative mark of -1/4.</li>
          <li>Ensure you are in a quiet environment and have a stable internet connection.</li>
          <li>Keep an eye on the timer, and try to answer all questions within the given time.</li>
          <li>Do not use any external resources such as dictionaries, websites, or assistance.</li>
          <li>Complete the test honestly to accurately assess your proficiency level.</li>
          <li>Check answers before submitting.</li>
          <li>Your test results will be displayed immediately after submission, indicating whether you have passed or need to retake the test.</li>
        </ol>
      `
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch questions", error: String(error) },
      { status: 500 }
    );
  }
}