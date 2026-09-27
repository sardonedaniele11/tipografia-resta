import { NextRequest, NextResponse } from "next/server";
import { getMovements } from "@/lib/warehouse/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 60;
    const movements = await getMovements(limit);

    return NextResponse.json({
      success: true,
      movements,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Errore lettura movimenti" },
      { status: 500 }
    );
  }
}
