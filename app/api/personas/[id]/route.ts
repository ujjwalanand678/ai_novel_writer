import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { WriterPersona } from "@/models/WriterPersona";
import { Novel } from "@/models/Novel";

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const userId = "000000000000000000000001";

    const params = await props.params;
    const { id } = params;
    await dbConnect();

    // Check if any novels are using this persona
    const novelsUsingPersona = await Novel.countDocuments({ writerPersonaId: id });
    if (novelsUsingPersona > 0) {
      return NextResponse.json({ error: "Cannot delete persona: used by existing novels." }, { status: 400 });
    }

    const deletedPersona = await WriterPersona.findOneAndDelete({ _id: id, userId });

    if (!deletedPersona) {
      return NextResponse.json({ error: "Persona not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Persona deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting persona:", error);
    return NextResponse.json({ error: error.message || "Failed to delete persona" }, { status: 500 });
  }
}
