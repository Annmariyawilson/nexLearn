// ══════════════════════════════════════════════════════
// app/(auth)/page.tsx  — Login page
// ══════════════════════════════════════════════════════
import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login – NexLearn",
  description: "Sign in to your NexLearn account.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}


