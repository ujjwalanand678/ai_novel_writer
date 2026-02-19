import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { WriterPersona } from "@/models/WriterPersona";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const personas = await WriterPersona.find({ userId: session.user.id });
    return NextResponse.json({ success: true, personas });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch personas" }, { status: 500 });
  }
}
