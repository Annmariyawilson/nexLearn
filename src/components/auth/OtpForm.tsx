"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { verifyOtpApi } from "@/lib/api";
import { saveTokens } from "@/lib/storage";
import { useAppDispatch } from "@/store/hooks";
import { setAuthTokens } from "@/store/features/authSlice";

// ─── ZOD SCHEMA ─────────────────────────────────────────────────────────────
const otpSchema = z.object({
  otp: z
    .string()
    .min(4, "OTP must be at least 4 digits")
    .max(6, "OTP cannot exceed 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

type OtpInputs = z.infer<typeof otpSchema>;

export default function OtpForm() {
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const stored = localStorage.getItem("nexlearn_mobile") || "";
    setMobileNumber(stored);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<OtpInputs>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
  });

  const onFormSubmit = async (data: OtpInputs) => {
    if (!mobileNumber) {
      alert("Mobile number not found. Please login again.");
      router.replace("/");
      return;
    }

    try {
      setLoading(true);
      const resData = await verifyOtpApi(mobileNumber, data.otp);

      if (resData?.access_token && resData?.refresh_token) {
        saveTokens(resData.access_token, resData.refresh_token);
        dispatch(
          setAuthTokens({
            accessToken: resData.access_token,
            refreshToken: resData.refresh_token,
          })
        );
      }

      console.log("[OtpForm] OTP verified, navigating to profile setup");
      router.replace("/profile");
    } catch (error) {
      console.error(error);
      alert("OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const { sendOtpApi } = await import("@/lib/api");
      await sendOtpApi(mobileNumber);
      alert("OTP resent successfully");
    } catch {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="flex flex-col justify-between h-full w-full min-h-0">
      {/* ── TOP CONTENT ── */}
      <div className="flex flex-col">
        <h1 className="auth-title">
          Enter the code we texted you
        </h1>
        <p className="auth-subtitle">
          We&apos;ve sent an SMS to{" "}
          <span className="font-semibold text-[#1C3141]">
            {mobileNumber || "your mobile number"}
          </span>
        </p>

        {/* OTP Input with high-fidelity container */}
        <div className="relative mt-7">
          <span className="phone-floating-label">SMS code</span>
          
          <div className={`exact-phone-field ${errors.otp ? "!border-red-400 !shadow-none" : ""}`}>
            <input
              {...register("otp")}
              className="w-full h-full bg-transparent border-none outline-none text-[18px] font-bold tracking-[4px] text-[#1C3141] placeholder:text-slate-300 placeholder:tracking-normal"
              placeholder="000000"
              maxLength={6}
            />
          </div>

          {errors.otp && (
            <span className="mt-1.5 block text-[11.5px] font-medium text-red-500 pl-1">
              {errors.otp.message}
            </span>
          )}
        </div>

        <p className="mt-5 text-[12.5px] text-[#64748b] leading-relaxed">
          Your digit code is on its way. This can sometimes take a few moments
          to arrive.
        </p>

        <button
          type="button"
          onClick={handleResend}
          className="mt-3 text-[13px] font-semibold text-[#1a2e40] underline underline-offset-2 w-fit"
        >
          Resend code
        </button>
      </div>

      {/* ── BOTTOM BUTTON ── */}
      <div className="mt-8">
        <button
          className="primary-btn"
          type="button"
          onClick={handleSubmit(onFormSubmit)}
          disabled={loading || !isValid}
        >
          {loading ? "Verifying..." : "Verify & Proceed"}
        </button>
      </div>
    </div>
  );
}