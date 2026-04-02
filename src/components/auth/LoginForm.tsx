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
      
      // Store mobile for OTP page fallback access
      localStorage.setItem("nexlearn_mobile", data.mobile);
      
      // ✅ Navigate FORWARD to OTP page
      router.replace("/verify-otp");
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-inner">
      <h1 className="auth-title">Enter your phone number</h1>

      <p className="auth-subtitle">
        We use your mobile number to identify your account
      </p>

      <form onSubmit={handleSubmit(onFormSubmit)} className="login-form-body">
        <label className="auth-label floating-label">Phone number</label>

        <div className={`exact-phone-field ${errors.mobile ? "border-red-400 ring-red-100" : ""}`}>
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
                placeholder="+91 1234 567891"
              />
            )}
          />
        </div>
        {errors.mobile && (
          <span className="mt-1 block text-[10px] font-medium text-red-500">
            {errors.mobile.message}
          </span>
        )}

        <p className="auth-muted login-terms">
          By tapping Get started, you agree to the{" "}
          <span className="cursor-pointer hover:underline text-[#3d4f61] font-semibold">
            Terms &amp; Conditions
          </span>
        </p>

        <button
          className="primary-btn"
          type="submit"
          disabled={loading || !isValid}
        >
          {loading ? "Sending..." : "Get Started"}
        </button>
      </form>
    </div>
  );
}