import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { Novel } from "@/models/Novel";

export async function DELETE(
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
    const deletedNovel = await Novel.findOneAndDelete({ _id: id, userId: session.user.id });

    if (!deletedNovel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Novel deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting novel:", error);
    return NextResponse.json({ error: error.message || "Failed to delete novel" }, { status: 500 });
  }
}
