import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Novel } from "@/models/Novel";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const userId = "000000000000000000000001";
    const body = await req.json();
    const params = await props.params;
    const { id } = params;

    await dbConnect();
    const novel = await Novel.findOneAndUpdate(
      { _id: id, userId },
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
  props: { params: Promise<{ id: string }> }
) {
  try {
    const userId = "000000000000000000000001";
    const params = await props.params;
    const { id } = params;
    await dbConnect();
    const novel = await Novel.findOne({ _id: id, userId }).populate("writerPersonaId");
    
    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, novel });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch novel" }, { status: 500 });
  }
}
