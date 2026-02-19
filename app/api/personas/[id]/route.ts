import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { WriterPersona } from "@/models/WriterPersona";
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

    // Check if any novels are using this persona
    const novelsUsingPersona = await Novel.countDocuments({ writerPersonaId: id });
    if (novelsUsingPersona > 0) {
      return NextResponse.json({ error: "Cannot delete persona: used by existing novels." }, { status: 400 });
    }

    const deletedPersona = await WriterPersona.findOneAndDelete({ _id: id, userId: session.user.id });

    if (!deletedPersona) {
      return NextResponse.json({ error: "Persona not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Persona deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting persona:", error);
    return NextResponse.json({ error: error.message || "Failed to delete persona" }, { status: 500 });
  }
}
