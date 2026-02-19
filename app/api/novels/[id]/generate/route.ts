import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Novel } from "@/models/Novel";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const userId = "000000000000000000000001";

    const { chapterIndex, summary, targetWordCount, charactersPresent } = await req.json();
    const params = await props.params;
    const { id } = params;

    await dbConnect();
    const novel = await Novel.findOne({ _id: id, userId }).populate("writerPersonaId");
    
    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    // Mock AI Generation Logic
    const persona = novel.writerPersonaId as any;
    const generatedContent = `
# Generated Chapter Content
Summary: ${summary}
Persona used: ${persona.name}
Tone: ${persona.styleAttributes?.tone || "Standard"}

Characters present: ${charactersPresent?.join(", ") || "None"}

[This is a placeholder for the AI generated text based on the persona's style. 
In a real implementation, this would call OpenAI or Gemini API with a detailed prompt 
incorporating the persona's writing attributes and the chapter summary.]

Word count target: ${targetWordCount || 1000}
    `.trim();

    // Update novel with new chapter content or existing chapter
    if (chapterIndex !== undefined && novel.chapters[chapterIndex]) {
      novel.chapters[chapterIndex].content = generatedContent;
      novel.chapters[chapterIndex].summary = summary;
      novel.chapters[chapterIndex].charactersPresent = charactersPresent;
    } else {
      novel.chapters.push({
        title: `Chapter ${novel.chapters.length + 1}`,
        summary,
        content: generatedContent,
        targetWordCount,
        charactersPresent,
        order: novel.chapters.length,
      });
    }

    novel.updatedAt = new Date();
    await novel.save();

    return NextResponse.json({ success: true, chapter: novel.chapters[novel.chapters.length - 1], novel });
  } catch (error: any) {
    console.error("Error generating chapter:", error);
    return NextResponse.json({ error: error.message || "Failed to generate chapter" }, { status: 500 });
  }
}
