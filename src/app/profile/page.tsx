import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import ProfileForm from "@/components/auth/ProfileForm";

export const metadata: Metadata = {
  title: "User Profile",
  description: "Complete your profile to personalize your NexLearn experience.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return (
    <AuthLayout>
      <ProfileForm />
    </AuthLayout>
  );
}