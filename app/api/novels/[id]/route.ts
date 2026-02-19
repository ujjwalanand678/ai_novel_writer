import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Novel } from "@/models/Novel";

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const userId = "guest_user_123";

    const params = await props.params;
    const { id } = params;
    await dbConnect();
    const deletedNovel = await Novel.findOneAndDelete({ _id: id, userId });

    if (!deletedNovel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Novel deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting novel:", error);
    return NextResponse.json({ error: error.message || "Failed to delete novel" }, { status: 500 });
  }
}
