import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { WriterPersona } from "@/models/WriterPersona";

export async function POST(req: NextRequest) {
  try {
    const userId = "000000000000000000000001";
    const { message, personaId } = await req.json();
    
    await dbConnect();
    const persona = await WriterPersona.findById(personaId);

    if (!persona) {
      return NextResponse.json({ error: "Persona not found" }, { status: 404 });
    }

    // Mock Chat Logic - responding in the persona's style
    const mockResponses = [
      `As ${persona.name}, I'd suggest adding more conflict here.`,
      `Interesting idea! Based on my style (${persona.styleAttributes?.tone || 'balanced'}), maybe try...`,
      `Does this character's action align with the world building?`,
      `In my stories, I usually focus on pacing. This scene feels a bit slow.`,
    ];
    
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    return NextResponse.json({ 
      success: true, 
      reply: randomResponse 
    });

  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}
