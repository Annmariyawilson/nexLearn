"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-number-input";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { sendOtpApi } from "@/lib/api";
import { useAppDispatch } from "@/store/hooks";
import { setMobile } from "@/store/features/authSlice";

// ─── ZOD SCHEMA ─────────────────────────────────────────────────────────────
const loginSchema = z.object({
  mobile: z
    .string()
    .min(10, "Mobile number is too short")
    .max(15, "Mobile number is too long"),
});

type LoginInputs = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onFormSubmit = async (data: LoginInputs) => {
    try {
      setLoading(true);
      await sendOtpApi(data.mobile);
      dispatch(setMobile(data.mobile));
      localStorage.setItem("nexlearn_mobile", data.mobile);
      router.replace("/verify-otp");
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* 
      Full height container with space-between:
      Top: Titles + Form
      Bottom: Submit Button
    */
    <div className="flex flex-col justify-between h-full w-full">
      {/* ── TOP SECTION: Branding & Inputs ── */}
      <div className="flex flex-col">
        <h1 className="auth-title">Enter your phone number</h1>
        
        <p className="auth-subtitle">
          We use your mobile number to identify your account
        </p>

        {/* BRANded Phone Input Field */}
        <div className="relative mt-[34px]">
          <span className="phone-floating-label">Phone number</span>
          
          <div className={`exact-phone-field ${errors.mobile ? "!border-red-400 !shadow-none" : ""}`}>
            <Controller
              name="mobile"
              control={control}
              render={({ field: { onChange, value } }) => (
                <PhoneInput
                  international
                  defaultCountry="IN"
                  countryCallingCodeEditable={false}
                  value={value}
                  onChange={onChange}
                  placeholder="1234 567891"
                />
              )}
            />
          </div>

          {errors.mobile && (
            <span className="mt-2 block text-[11px] font-medium text-red-500 pl-1">
              {errors.mobile.message}
            </span>
          )}
        </div>

        {/* Legal Terms: Wrapped naturally as per reference */}
        <p className="mt-[24px] text-[13px] text-[#5C5C5C] leading-relaxed">
          By tapping Get started, you agree to the{" "}
          <span className="font-semibold text-[#1a2e40] cursor-pointer hover:underline underline-offset-2">
            Terms &amp; Conditions
          </span>
        </p>
      </div>

      {/* ── BOTTOM SECTION: CTA Button ── */}
      <div className="mt-8">
        <button
          className="primary-btn"
          type="button"
          onClick={handleSubmit(onFormSubmit)}
          disabled={loading || !isValid}
        >
          {loading ? "Please wait..." : "Get Started"}
        </button>
      </div>
    </div>
  );
}