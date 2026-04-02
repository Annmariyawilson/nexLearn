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
    .refine((file) => file instanceof File || file === null, "Profile image is required")
    .nullable(),
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
    formState: { errors, isValid },
  } = useForm<ProfileInputs>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      profile_image: null
    }
  });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue("profile_image", file, { shouldValidate: true });
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("profile_image", null, { shouldValidate: true });
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onFormSubmit = async (data: ProfileInputs) => {
    if (!mobileNumber) {
      alert("Mobile number not found. Please login again.");
      router.replace("/");
      return;
    }

    if (!data.profile_image) {
      alert("Please upload a profile picture.");
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

      router.replace("/exam");
    } catch (error) {
      console.error(error);
      alert("Profile creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* ── TOP SECTION ── */}
      <div className="flex flex-col">
        <h1 className="auth-title">Add Your Details</h1>

        <form onSubmit={handleSubmit(onFormSubmit)} className="mt-2">
          {/* ── PROFILE PICTURE UPLOAD ── */}
          <div className="flex justify-center mb-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer flex flex-col items-center justify-center border-dashed border-[1.5px] rounded-[16px] transition-all
                ${errors.profile_image ? "border-red-400 bg-red-50" : "border-[#E2E8F0] hover:border-[#1C3141]"}
              `}
              style={{ width: '132px', height: '127px' }}
            >
              {preview ? (
                <>
                  <Image
                    src={preview}
                    alt="Profile"
                    fill
                    className="object-cover rounded-[16px]"
                  />
                  {/* Close Icon */}
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-[#1C3141] text-white rounded-full p-1 shadow-lg hover:bg-black transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-center px-2">
                  <div className="bg-[#F8FAFC] p-3 rounded-full mb-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1C3141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </div>
                  <span className="text-[10px] font-medium text-[#1C3141] leading-tight opacity-70">
                    Add your Profile picture
                  </span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
          </div>

          {/* ── FORM FIELDS WITH FLOATING LABELS ── */}
          <div className="space-y-5">
            {/* Name */}
            <div className="relative">
              <span className="phone-floating-label">Name*</span>
              <div className={`exact-phone-field ${errors.name ? "!border-red-400" : ""}`}>
                <input
                  {...register("name")}
                  className="w-full h-full bg-transparent outline-none border-none text-[16px] text-[#1C3141] font-medium placeholder:text-[#94A3B8]"
                  placeholder="Enter your Full Name"
                />
              </div>
              {errors.name && <p className="mt-1 text-[10px] text-red-500 font-medium pl-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="relative">
              <span className="phone-floating-label">Email*</span>
              <div className={`exact-phone-field ${errors.email ? "!border-red-400" : ""}`}>
                <input
                  {...register("email")}
                  className="w-full h-full bg-transparent outline-none border-none text-[16px] text-[#1C3141] font-medium placeholder:text-[#94A3B8]"
                  placeholder="Enter your Email Address"
                />
              </div>
              {errors.email && <p className="mt-1 text-[10px] text-red-500 font-medium pl-1">{errors.email.message}</p>}
            </div>

            {/* Qualification */}
            <div className="relative">
              <span className="phone-floating-label">Your qualification*</span>
              <div className={`exact-phone-field ${errors.qualification ? "!border-red-400" : ""}`}>
                <input
                  {...register("qualification")}
                  className="w-full h-full bg-transparent outline-none border-none text-[16px] text-[#1C3141] font-medium placeholder:text-[#94A3B8]"
                  placeholder="Enter your qualification"
                />
              </div>
              {errors.qualification && <p className="mt-1 text-[10px] text-red-500 font-medium pl-1">{errors.qualification.message}</p>}
            </div>
          </div>
        </form>
      </div>

      {/* ── BUTTON SECTION ── */}
      <div className="mt-8">
        <button
          className="primary-btn"
          type="button"
          onClick={handleSubmit(onFormSubmit)}
          disabled={loading || !isValid}
        >
          {loading ? "Saving Profile..." : "Get Started"}
        </button>
      </div>
    </div>
  );
}