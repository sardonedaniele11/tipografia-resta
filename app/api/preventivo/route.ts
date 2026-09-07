import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const nome = formData.get("nome")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const telefono = formData.get("telefono")?.toString() || "Non specificato";
    const servizio = formData.get("servizio")?.toString() || "Non specificato";
    const quantita = formData.get("quantita")?.toString() || "Non specificato";
    const carta = formData.get("carta")?.toString() || "Non specificato";
    const nobilitazione = formData.get("nobilitazione")?.toString() || "Nessuna";
    const dettagli = formData.get("dettagli")?.toString() || "Nessuna nota aggiuntiva";
    const file = formData.get("file") as File | null;

    if (!nome || !email) {
      return NextResponse.json(
        { error: "Nome ed email sono campi obbligatori." },
        { status: 400 }
      );
    }

    // Configurazione SMTP (es. Gmail, Aruba, Outlook, Brevo, Resend)
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
    const smtpUser = process.env.SMTP_USER; // es. tipografiaresta@gmail.com
    const smtpPass = process.env.SMTP_PASS; // password per le app di Google o password mail Aruba
    const recipientEmail = process.env.RECIPIENT_EMAIL || "tipografiaresta@gmail.com";

    // Se le variabili SMTP sono impostate, invia l'email reale
    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true per 465, false per altre porte come 587
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // Preparazione allegato se presente
      const attachments = [];
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        attachments.push({
          filename: file.name,
          content: buffer,
        });
      }

      // Template HTML email professionale
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #111; padding: 25px; background-color: #fcfbf9;">
          <div style="border-bottom: 3px solid #ff007f; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="color: #111; margin: 0; font-size: 22px;">📩 Nuova Richiesta di Preventivo dal Sito Web</h2>
            <p style="color: #666; margin: 5px 0 0 0; font-size: 13px;">Nuova Tipolitografia Resta - Bari</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold; width: 35%; color: #333;">Cliente / Azienda:</td>
              <td style="padding: 10px; color: #111;">${nome}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold; color: #333;">Email di Contatto:</td>
              <td style="padding: 10px; color: #111;"><a href="mailto:${email}" style="color: #0095f6; font-weight: bold;">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold; color: #333;">Telefono:</td>
              <td style="padding: 10px; color: #111;"><a href="tel:${telefono}" style="color: #111;">${telefono}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold; color: #333;">Servizio Richiesto:</td>
              <td style="padding: 10px; color: #ff007f; font-weight: bold;">${servizio.toUpperCase()}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold; color: #333;">Quantità / Tiratura:</td>
              <td style="padding: 10px; color: #111; font-weight: bold;">${quantita} copie/pz</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold; color: #333;">Tipo di Carta / Supporto:</td>
              <td style="padding: 10px; color: #111;">${carta}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold; color: #333;">Nobilitazione / Finitura:</td>
              <td style="padding: 10px; color: #111;">${nobilitazione}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; vertical-align: top; color: #333;">Note & Dettagli:</td>
              <td style="padding: 10px; color: #111; line-height: 1.5;">${dettagli}</td>
            </tr>
          </table>

          ${
            attachments.length > 0
              ? `<div style="margin-top: 15px; padding: 10px; background-color: #ffe60033; border: 1px dashed #111; font-size: 13px;">
                  📎 <strong>File allegato dal cliente:</strong> ${file?.name} (${(
                  (file?.size || 0) /
                  1024 /
                  1024
                ).toFixed(2)} MB)
                </div>`
              : ""
          }

          <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #888;">
            Messaggio generato automaticamente dal preventivatore online di Nuova Tipolitografia Resta.
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"Preventivatore Tipografia Resta" <${smtpUser}>`,
        to: recipientEmail,
        replyTo: email,
        subject: `🔔 Nuovo Preventivo: ${nome} - ${servizio}`,
        html: htmlContent,
        attachments,
      });

      return NextResponse.json({
        success: true,
        message: "Richiesta di preventivo inviata con successo!",
      });
    }

    // Se le variabili SMTP non sono ancora configurate
    console.log("⚠️ SMTP non configurato. Variabili mancanti: SMTP_USER o SMTP_PASS.");
    console.log({ nome, email, telefono, servizio, quantita, carta, nobilitazione, dettagli });

    return NextResponse.json({
      success: true,
      message:
        "Richiesta registrata! (Configura le variabili SMTP per l'invio dell'email reale).",
    });
  } catch (error: any) {
    console.error("Errore nell'invio dell'email:", error);
    return NextResponse.json(
      {
        error:
          "Si è verificato un errore durante l'invio dell'email. Verifica le credenziali SMTP.",
      },
      { status: 500 }
    );
  }
}
