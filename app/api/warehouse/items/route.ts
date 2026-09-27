import { NextRequest, NextResponse } from "next/server";
import { getItems, createItem, getWarehouseSummary } from "@/lib/warehouse/db";
import { StockStatus, WarehouseCategory } from "@/lib/warehouse/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as WarehouseCategory | "all" | null;
    const status = searchParams.get("status") as StockStatus | "all" | null;
    const search = searchParams.get("search") || undefined;
    const includeSummary = searchParams.get("summary") === "true";

    const items = await getItems({
      category: category || "all",
      status: status || "all",
      search,
    });

    let summary = null;
    if (includeSummary) {
      summary = await getWarehouseSummary();
    }

    return NextResponse.json({
      success: true,
      items,
      summary,
    });
  } catch (error: any) {
    console.error("API GET /items error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Errore lettura magazzino" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.category || body.quantity === undefined) {
      return NextResponse.json(
        { success: false, error: "Campi obbligatori mancanti (nome, categoria, quantità)" },
        { status: 400 }
      );
    }

    const newItem = await createItem({
      code: body.code || `ART-${Date.now().toString().slice(-6)}`,
      name: body.name,
      category: body.category,
      subcategory: body.subcategory || "Generale",
      unit: body.unit || "pz",
      quantity: Number(body.quantity) || 0,
      minStockAlert: Number(body.minStockAlert) || 5,
      optimalStock: Number(body.optimalStock) || 15,
      supplier: body.supplier || "Fornitore non specificato",
      location: body.location || "Magazzino centrale",
      unitCost: body.unitCost ? Number(body.unitCost) : undefined,
      notes: body.notes || "",
    });

    return NextResponse.json({
      success: true,
      item: newItem,
    });
  } catch (error: any) {
    console.error("API POST /items error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Errore creazione articolo" },
      { status: 500 }
    );
  }
}
