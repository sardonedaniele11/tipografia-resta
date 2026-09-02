import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const nome = formData.get("nome")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const telefono = formData.get("telefono")?.toString() || "";
    const servizio = formData.get("servizio")?.toString() || "";
    const quantita = formData.get("quantita")?.toString() || "";
    const carta = formData.get("carta")?.toString() || "";
    const nobilitazione = formData.get("nobilitazione")?.toString() || "";
    const dettagli = formData.get("dettagli")?.toString() || "";

    if (!nome || !email) {
      return NextResponse.json(
        { error: "Nome ed email sono campi obbligatori." },
        { status: 400 }
      );
    }

    console.log("=== NUOVA RICHIESTA PREVENTIVO ===");
    console.log({
      nome,
      email,
      telefono,
      servizio,
      quantita,
      carta,
      nobilitazione,
      dettagli,
      timestamp: new Date().toISOString(),
    });

    // In produzione, qui è possibile collegare Resend, SendGrid o Nodemailer
    // per inviare l'email direttamente a tipografiaresta@gmail.com

    return NextResponse.json(
      {
        success: true,
        message: `Grazie ${nome}, la tua richiesta di preventivo è stata ricevuta con successo!`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Errore elaborazione preventivo:", error);
    return NextResponse.json(
      { error: "Errore interno del server durante l'elaborazione del preventivo." },
      { status: 500 }
    );
  }
}
