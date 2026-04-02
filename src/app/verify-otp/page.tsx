import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import OtpForm from "@/components/auth/OtpForm";

export const metadata: Metadata = {
  title: "Verify Identity",
  description: "Secure your account by entering the verification code sent to your device.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyOtpPage() {
  return (
    <AuthLayout>
      <OtpForm />
    </AuthLayout>
  );
}