import { NextRequest, NextResponse } from "next/server";
import { askWarehouseAssistant } from "@/lib/warehouse/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question || !question.trim()) {
      return NextResponse.json({ success: false, error: "Domanda vuota" }, { status: 400 });
    }

    const answer = await askWarehouseAssistant(question);

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Errore assistente IA" },
      { status: 500 }
    );
  }
}
