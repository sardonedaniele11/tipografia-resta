import { NextRequest, NextResponse } from "next/server";
import { calculateJobMaterials } from "@/lib/warehouse/gemini";
import { updateStock } from "@/lib/warehouse/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { calculationInput, deductStock } = body;

    if (!calculationInput) {
      return NextResponse.json({ success: false, error: "Dati commessa mancanti" }, { status: 400 });
    }

    const result = await calculateJobMaterials(calculationInput);

    // Se l'operatore preme "Scala materiali commessa da magazzino"
    if (deductStock && result.primaryMaterial && result.primaryMaterial.isAvailable) {
      await updateStock(
        result.primaryMaterial.id,
        { delta: -result.primaryMaterial.requiredQuantity },
        `Scarico per commessa: "${result.jobName}" (${calculationInput.runQuantity} copie)`,
        "Ufficio Tecnico Stampa"
      );
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("API POST /ai-job-estimator error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Errore calcolo commessa" },
      { status: 500 }
    );
  }
}
