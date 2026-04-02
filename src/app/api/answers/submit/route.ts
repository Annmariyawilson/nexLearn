import { NextRequest, NextResponse } from "next/server";
import { forwardRequest } from "@/lib/server-api";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const authHeader = req.headers.get("authorization") || "";

    // Debug: log the answers payload being forwarded
    const answersRaw = formData.get("answers");
    console.log("[submit/route] Forwarding answers payload:", answersRaw);

    const upstream = await forwardRequest("/answers/submit", {
      method: "POST",
      headers: authHeader ? { Authorization: authHeader } : undefined,
      body: formData,
    });

    console.log("[submit/route] Upstream status:", upstream.status);

    // Read response as text first — upstream may return plain text on error
    const rawText = await upstream.text();
    console.log("[submit/route] Upstream raw response:", rawText);

    // Safely parse JSON; if it fails, surface the raw upstream text
    let data: unknown;
    try {
      data = JSON.parse(rawText);
    } catch {
      // Upstream returned non-JSON (e.g. "Internal Server Error")
      return NextResponse.json(
        {
          success: false,
          message: "Upstream returned a non-JSON response",
          upstream_status: upstream.status,
          upstream_text: rawText,
        },
        { status: upstream.status >= 400 ? upstream.status : 502 }
      );
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    console.error("[submit/route] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit answers", error: String(error) },
      { status: 500 }
    );
  }
}