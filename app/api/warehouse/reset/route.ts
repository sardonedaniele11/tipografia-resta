import { NextResponse } from "next/server";
import { resetToDefaultWarehouse } from "@/lib/warehouse/db";

export async function POST() {
  try {
    await resetToDefaultWarehouse();
    return NextResponse.json({
      success: true,
      message: "Magazzino ripristinato con i dati catalogo iniziali di Tipografia Resta",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Errore reset magazzino" },
      { status: 500 }
    );
  }
}
