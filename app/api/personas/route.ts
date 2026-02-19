import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { WriterPersona } from "@/models/WriterPersona";

export async function GET(req: NextRequest) {
  try {
    const userId = "guest_user_123";
    await dbConnect();
    const personas = await WriterPersona.find({ userId });
    return NextResponse.json({ success: true, personas });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch personas" }, { status: 500 });
  }
}
