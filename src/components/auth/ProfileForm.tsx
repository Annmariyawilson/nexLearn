"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createProfileApi } from "@/lib/api";
import { saveTokens, getAccessToken } from "@/lib/storage";
import { useAppDispatch } from "@/store/hooks";
import { setAuthTokens, setUser } from "@/store/features/authSlice";

// ─── ZOD SCHEMA ─────────────────────────────────────────────────────────────
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  qualification: z.string().min(2, "Qualification is required"),
  profile_image: z
    .any()
    .refine((file) => file instanceof File, "Profile image is required")
    .refine((file) => file?.size <= 5 * 1024 * 1024, "Image must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file?.type),
      "Only JPG, JPEG or PNG formats are supported"
    ),
});

type ProfileInputs = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const stored = localStorage.getItem("nexlearn_mobile") || "";
    setMobileNumber(stored);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileInputs>({
    resolver: zodResolver(profileSchema),
  });

  const profileImage = watch("profile_image");

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue("profile_image", file, { shouldValidate: true });
    setPreview(URL.createObjectURL(file));
  };

  const onFormSubmit = async (data: ProfileInputs) => {
    if (!mobileNumber) {
      alert("Mobile number not found. Please login again.");
      router.replace("/");
      return;
    }

    try {
      setLoading(true);

      const resData = await createProfileApi({
        mobile: mobileNumber,
        name: data.name,
        email: data.email,
        qualification: data.qualification,
        profile_image: data.profile_image,
      });

      if (resData?.access_token && resData?.refresh_token) {
        saveTokens(resData.access_token, resData.refresh_token);
        dispatch(
          setAuthTokens({
            accessToken: resData.access_token,
            refreshToken: resData.refresh_token,
          })
        );
      }

      if (resData?.user) {
        dispatch(setUser(resData.user));
      }

      const token = resData?.access_token || getAccessToken();
      if (!token) {
        alert("Success, but no access token returned.");
        return;
      }

      router.replace("/exam");
    } catch (error) {
      console.error(error);
      alert("Profile creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-1">
      <h2 className="auth-title">Add Your Details</h2>

      <form onSubmit={handleSubmit(onFormSubmit)} className="mt-5">
        {/* Profile Image Upload */}
        <div className="mb-6 flex flex-col items-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex h-[92px] w-[92px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded border border-dashed transition-colors hover:border-sky-400 ${
              errors.profile_image ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50"
            }`}
          >
            {preview ? (
              <Image
                src={preview}
                alt="Profile preview"
                width={92}
                height={92}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-400">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <span className="px-1 text-center text-[9px] font-medium leading-tight">
                  Add your photo here
                </span>
              </div>
            )}
          </button>
          {errors.profile_image && (
            <span className="mt-1.5 text-[10px] font-medium text-red-500">
              {errors.profile_image.message as string}
            </span>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImage}
          />
        </div>

        {/* Name Input */}
        <div className="mb-4">
          <label className="mb-1.5 block text-[12px] font-medium text-slate-500">
            Name*
          </label>
          <input
            {...register("name")}
            className={`input-base ${errors.name ? "border-red-400 focus:ring-red-100" : ""}`}
            placeholder="Enter your Full Name"
          />
          {errors.name && (
            <span className="mt-1 block text-[10px] font-medium text-red-500">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="mb-1.5 block text-[12px] font-medium text-slate-500">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            className={`input-base ${errors.email ? "border-red-400 focus:ring-red-100" : ""}`}
            placeholder="Enter your Email Address"
          />
          {errors.email && (
            <span className="mt-1 block text-[10px] font-medium text-red-500">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Qualification Input */}
        <div className="mb-4">
          <label className="mb-1.5 block text-[12px] font-medium text-slate-500">
            Your qualification*
          </label>
          <input
            {...register("qualification")}
            className={`input-base ${errors.qualification ? "border-red-400 focus:ring-red-100" : ""}`}
            placeholder="Enter your qualification"
          />
          {errors.qualification && (
            <span className="mt-1 block text-[10px] font-medium text-red-500">
              {errors.qualification.message}
            </span>
          )}
        </div>

        <button className="primary-btn mt-6" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Get Started"}
        </button>
      </form>
    </div>
  );
}