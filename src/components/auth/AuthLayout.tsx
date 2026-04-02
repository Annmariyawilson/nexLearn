// components/auth/AuthLayout.tsx

import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="auth-bg">
      <div className="auth-shell">
        {/* LEFT PANEL: Branded Dark Foundation */}
        <section className="left-panel">
          {/* LOGO: Centered at the top */}
          <div className="w-full flex justify-center">
            <Image
              src="/assets/logo_white.png"
              alt="NexLearn Identity"
              width={240}
              height={80}
              className="object-contain top-logo"
              priority
            />
          </div>

          {/* ILLUSTRATION: Larger centered illustration */}
          <div className="w-full flex justify-center pb-2 animate-fade-in-up">
            <Image
              src="/assets/group.png"
              alt="Interactive Learning"
              width={440}
              height={380}
              className="object-contain"
              style={{ height: "auto", maxWidth: "90%" }}
              priority
            />
          </div>
        </section>

        {/* RIGHT PANEL: White Interaction Card */}
        <section className="right-panel">
          {children}
        </section>
      </div>
    </main>
  );
}