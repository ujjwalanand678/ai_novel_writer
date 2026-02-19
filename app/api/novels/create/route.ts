import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { Novel } from "@/models/Novel";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, writerPersonaId, worldSettings } = await req.json();

    if (!title || !writerPersonaId) {
      return NextResponse.json({ error: "Missing title or persona id" }, { status: 400 });
    }

    await dbConnect();
    const newNovel = await Novel.create({
      userId: session.user.id,
      writerPersonaId,
      title,
      worldSettings: worldSettings || {},
      characters: [],
      chapters: [],
      status: "Draft",
    });

    return NextResponse.json({ success: true, novel: newNovel });
  } catch (error: any) {
    console.error("Error creating novel:", error);
    return NextResponse.json({ error: error.message || "Failed to create novel" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const novels = await Novel.find({ userId: session.user.id }).populate("writerPersonaId");
    return NextResponse.json({ success: true, novels });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch novels" }, { status: 500 });
  }
}
