import { NextRequest, NextResponse } from "next/server";
import { forwardRequest } from "@/lib/server-api";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const upstream = await forwardRequest("/auth/verify-otp", {
      method: "POST",
      body: formData,
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "OTP verification failed", error: String(error) },
      { status: 500 }
    );
  }
}