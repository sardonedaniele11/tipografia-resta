import { NextRequest, NextResponse } from "next/server";
import { analyzeDdtDocument } from "@/lib/warehouse/gemini";
import { updateStock, createItem } from "@/lib/warehouse/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, mimeType, rawText, applyItems, documentNumber, supplierName } = body;

    // Se stiamo applicando gli articoli confermati dall'operatore
    if (applyItems && Array.isArray(applyItems)) {
      const updatedList: any[] = [];
      for (const item of applyItems) {
        if (item.matchedItemId) {
          const res = await updateStock(
            item.matchedItemId,
            { delta: Number(item.quantity) },
            `Carico merce DDT n. ${documentNumber || "fornitore"} da ${supplierName || "Fornitore"}`,
            "IA Scanner DDT"
          );
          updatedList.push({ itemId: item.matchedItemId, name: item.rawDescription, qtyAdded: item.quantity });
        } else if (item.createNew) {
          const newItem = await createItem({
            code: `ART-${Date.now().toString().slice(-6)}`,
            name: item.rawDescription,
            category: item.categoryGuess || "offset_digitale",
            subcategory: "Nuovo da DDT",
            unit: item.unit || "pz",
            quantity: Number(item.quantity) || 1,
            minStockAlert: 5,
            optimalStock: 15,
            supplier: supplierName || "Fornitore DDT",
            location: "Area Arrivi Merce",
            notes: `Caricato da DDT ${documentNumber || ""}`,
          });
          updatedList.push({ itemId: newItem.id, name: newItem.name, qtyAdded: newItem.quantity });
        }
      }

      return NextResponse.json({
        success: true,
        message: `${updatedList.length} articoli caricati a magazzino con successo!`,
        applied: updatedList,
      });
    }

    // Altrimenti eseguiamo l'analisi del documento (OCR / Visione Gemini)
    const scanResult = await analyzeDdtDocument(imageBase64, mimeType, rawText);

    return NextResponse.json({
      success: true,
      data: scanResult,
    });
  } catch (error: any) {
    console.error("API POST /ai-scan-ddt error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Errore analisi documento con IA" },
      { status: 500 }
    );
  }
}
