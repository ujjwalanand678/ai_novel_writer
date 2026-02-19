import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { Novel } from "@/models/Novel";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id } = params;

    await dbConnect();
    const novel = await Novel.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: { ...body, updatedAt: new Date() } },
      { new: true, runValidators: true }
    );

    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, novel });
  } catch (error: any) {
    console.error("Error updating novel:", error);
    return NextResponse.json({ error: error.message || "Failed to update novel" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    await dbConnect();
    const novel = await Novel.findOne({ _id: id, userId: session.user.id }).populate("writerPersonaId");
    
    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, novel });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch novel" }, { status: 500 });
  }
}
