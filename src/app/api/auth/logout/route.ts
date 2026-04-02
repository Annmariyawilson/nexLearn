import { NextRequest, NextResponse } from "next/server";
import { forwardRequest } from "@/lib/server-api";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";

    const upstream = await forwardRequest("/auth/logout", {
      method: "POST",
      headers: authHeader ? { Authorization: authHeader } : undefined,
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Logout failed", error: String(error) },
      { status: 500 }
    );
  }
}