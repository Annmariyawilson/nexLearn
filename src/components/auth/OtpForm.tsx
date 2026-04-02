"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { verifyOtpApi } from "@/lib/api";
import { saveTokens, getAccessToken } from "@/lib/storage";
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

      // Handle Redirection based on user profile completion
      const hasProfile = resData?.user?.name || resData?.profile_exists || resData?.login;
      
      console.log("[OtpForm] Verification result:", { 
          hasProfile, 
          user: resData?.user,
          login: resData?.login 
      });

      if (hasProfile) {
        // Existing user with profile: direct to exam instructions
        const token = resData?.access_token || getAccessToken();
        if (!token) {
          alert("Login succeeded, but no access token returned.");
          return;
        }
        router.replace("/exam");
      } else {
        // New user or missing profile: must create profile
        router.replace("/profile");
      }
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
    <div className="pt-1">
      <h2 className="auth-title">Enter the code we texted you</h2>
      <p className="auth-subtitle">
        We&apos;ve sent an SMS to{" "}
        <span className="font-semibold text-slate-700">
          {mobileNumber || "your mobile number"}
        </span>
      </p>

      <form onSubmit={handleSubmit(onFormSubmit)} className="mt-7">
        <label className="mb-2 block text-[12px] font-medium text-slate-500">
          SMS code
        </label>
        <input
          {...register("otp")}
          className={`input-base ${errors.otp ? "border-red-400 focus:ring-red-100" : ""}`}
          placeholder="123 456"
          maxLength={6}
        />
        {errors.otp && (
          <span className="mt-1 block text-[10px] font-medium text-red-500">
            {errors.otp.message}
          </span>
        )}

        <p className="mt-4 text-[11px] leading-4 text-slate-400">
          Your digit code is on its way. This can sometimes take a few moments
          to arrive.
        </p>

        <button
          type="button"
          onClick={handleResend}
          className="mt-3 text-[12px] font-medium text-sky-700 hover:underline"
        >
          Resend code
        </button>

        <button
          className="primary-btn mt-10"
          type="submit"
          disabled={loading || !isValid}
        >
          {loading ? "Verifying..." : "Get Started"}
        </button>
      </form>
    </div>
  );
}