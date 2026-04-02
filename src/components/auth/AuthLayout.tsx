// app/(auth)/layout.tsx  — or components/auth/AuthLayout.tsx

import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="auth-bg">
      <div className="auth-shell">
        {/* Left panel with logo + illustration */}
        <section className="left-panel">
          <div className="branding-wrap">
            <Image
              src="/assets/logo_white.png"
              alt="NexLearn"
              width={180}
              height={56}
              className="top-logo"
              priority
            />
          </div>
          <div className="illustration-wrap animate-fade-in-up">
            <Image
              src="/assets/group.png"
              alt="Learning illustration"
              width={300}
              height={260}
              className="bottom-illustration"
              style={{ height: "auto" }}
              priority
            />
          </div>
        </section>

        {/* Right form area */}
        <section className="right-panel">{children}</section>
      </div>
    </main>
  );
}