import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      status: "ok",
    });
  } catch (error) {
    throw error;
  }
}
