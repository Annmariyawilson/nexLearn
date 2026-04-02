import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Exam Terminal",
  description: "Secure and interactive MCQ examination terminal on NexLearn.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
