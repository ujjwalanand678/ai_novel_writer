import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Novel } from "@/models/Novel";
import PDFDocument from "pdfkit";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const userId = "000000000000000000000001";

    const params = await props.params;
    const { id } = params;
    await dbConnect();
    const novel = await Novel.findOne({ _id: id, userId });
    
    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    // PDF Generation
    const doc = new PDFDocument();
    const chunks: any[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    
    // Add content to PDF
    doc.fontSize(24).text(novel.title, { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text(`Author Persona: ${novel.writerPersonaId}`, { align: "center" });
    doc.moveDown(2);

    novel.chapters.sort((a, b) => a.order - b.order).forEach((chapter) => {
      doc.addPage();
      doc.fontSize(20).text(chapter.title, { underline: true });
      doc.moveDown();
      doc.fontSize(12).text(chapter.content);
    });

    doc.end();

    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
    });

    return new NextResponse(pdfBuffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${novel.title.replace(/\s+/g, "_")}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Error downloading novel:", error);
    return NextResponse.json({ error: error.message || "Failed to download novel" }, { status: 500 });
  }
}
