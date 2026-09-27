import { NextRequest, NextResponse } from "next/server";
import { getItemById, updateStock, updateItem, deleteItem } from "@/lib/warehouse/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await getItemById(params.id);
    if (!item) {
      return NextResponse.json({ success: false, error: "Articolo non trovato" }, { status: 404 });
    }
    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Se è un aggiornamento rapido delle scorte (delta o absolute)
    if (body.delta !== undefined || body.absolute !== undefined) {
      const { item, movement } = await updateStock(
        params.id,
        { delta: body.delta, absolute: body.absolute },
        body.reason || "Aggiornamento manuale scorte",
        body.operator || "Operatore"
      );
      return NextResponse.json({ success: true, item, movement });
    }

    // Altrimenti è un aggiornamento anagrafico dell'articolo
    const updated = await updateItem(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Articolo non trovato" }, { status: 404 });
    }
    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    console.error("API PATCH /items/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteItem(params.id);
    if (!success) {
      return NextResponse.json({ success: false, error: "Articolo non trovato" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Articolo eliminato con successo" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
