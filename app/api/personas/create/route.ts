import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { WriterPersona } from "@/models/WriterPersona";
import pdf from "pdf-parse";
import mammoth from "mammoth";
// @ts-ignore
import EPub from "node-epub";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const files = formData.getAll("files") as File[];

    if (!name || files.length === 0) {
      return NextResponse.json({ error: "Missing name or files" }, { status: 400 });
    }

    let combinedText = "";
    const sourceFiles: string[] = [];

    for (const file of files) {
      sourceFiles.push(file.name);
      const buffer = Buffer.from(await file.arrayBuffer());

      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const data = await pdf(buffer);
        combinedText += data.text + "\n";
      } else if (
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.endsWith(".docx")
      ) {
        const result = await mammoth.extractRawText({ buffer });
        combinedText += result.value + "\n";
      } else if (file.name.endsWith(".epub")) {
        // Basic epub text extraction (simplified for this context)
        // node-epub usually needs a file path, so we'd need to save it temporarily
        // or use a different parser that takes a buffer.
        // For now, let's add a placeholder or attempt a quick read if possible.
        combinedText += "[EPUB Text Extraction Placeholder]\n";
      } else {
        // Plain text as fallback
        combinedText += buffer.toString("utf-8") + "\n";
      }
    }

    // Basic Analysis Logic (Placeholder for AI/LLM analysis)
    const styleAttributes = {
      tone: combinedText.includes("dark") ? "Dark/Moody" : "Balanced",
      pacing: combinedText.length > 50000 ? "Slow/Detailed" : "Fast-paced",
      vocabulary: "Standard",
      wordCount: combinedText.trim().split(/\s+/).length,
    };

    await dbConnect();
    const newPersona = await WriterPersona.create({
      userId: session.user.id,
      name,
      description: `Persona based on ${sourceFiles.join(", ")}`,
      sourceFiles,
      styleAttributes,
      genre: "General",
    });

    return NextResponse.json({ success: true, persona: newPersona });
  } catch (error: any) {
    console.error("Error creating persona:", error);
    return NextResponse.json({ error: error.message || "Failed to create persona" }, { status: 500 });
  }
}
