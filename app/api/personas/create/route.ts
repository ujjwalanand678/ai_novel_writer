import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { WriterPersona } from "@/models/WriterPersona";
export async function POST(req: NextRequest) {
  try {
    // Lazy load dependencies to avoid build-time issues
    // Import the core logic directly to avoid buggy debug code in index.js
    // @ts-ignore
    const pdf = require("pdf-parse/lib/pdf-parse.js");
    // @ts-ignore
    const mammoth = require("mammoth");
    // @ts-ignore
    const EPub = require("node-epub");

    const userId = "000000000000000000000001"; // Valid ObjectId hex string for no auth mode

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
        try {
          // EPUBs are ZIP files. We can extract text from .html and .xhtml files.
          // @ts-ignore
          const AdmZip = require("adm-zip");
          const zip = new AdmZip(buffer);
          const entries = zip.getEntries();
          
          for (const entry of entries) {
            if (entry.entryName.endsWith(".xhtml") || entry.entryName.endsWith(".html")) {
              const html = entry.getData().toString("utf-8");
              // Basic tag stripping for style analysis
              const text = html.replace(/<[^>]*>?/gm, ' ');
              combinedText += text + "\n";
            }
          }
        } catch (epubError) {
          console.error("Error parsing EPUB:", epubError);
          combinedText += "[EPUB Extraction Failed]\n";
        }
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
      userId,
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
