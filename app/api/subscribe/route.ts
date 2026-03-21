// app/api/subscribe/route.ts
// Handles email newsletter signups for the weekly digest.

import { NextRequest, NextResponse } from "next/server";
import { addSubscriber } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    await addSubscriber(email);

    return NextResponse.json({ success: true, message: "Subscribed!" });
  } catch (error) {
    console.error("[Subscribe] Error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
