import { GoogleGenAI } from "@google/genai";
import {
  DdtScanResult,
  JobCalculationInput,
  JobCalculationResult,
  WarehouseItem,
} from "./types";
import { getItems } from "./db";

// Inizializzazione sicura del client Gemini
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Analizza l'immagine o il testo di una bolla/DDT fornitore (OCR multimodale con Gemini)
 */
export async function analyzeDdtDocument(
  imageBase64?: string,
  mimeType?: string,
  rawText?: string
): Promise<DdtScanResult> {
  const currentItems = await getItems();
  const gemini = getGeminiClient();

  // Se Gemini è configurato ed è presente un'immagine o testo reale
  if (gemini && (imageBase64 || rawText)) {
    try {
      const itemsCatalogShort = currentItems
        .map(
          (it) =>
            `- ID: "${it.id}", Codice: "${it.code}", Nome: "${it.name}", Categoria: "${it.category}", Unità: "${it.unit}"`
        )
        .join("\n");

      const prompt = `Sei un esperto contabile e magazziniere per "Nuova Tipolitografia Resta" a Bari.
Analizza il seguente Documento di Trasporto (DDT) o Fattura accompagnatoria di consegna materiali tipografici.
Estrai in formato JSON rigoroso:
1. "supplierName": Nome del fornitore (es. Fedrigoni, Burgo, Antalis, Plotterfilms, 2Stamp, Kurz, ecc.)
2. "documentNumber": Numero del DDT/bolla se presente
3. "documentDate": Data del documento
4. "items": Array di articoli estratti con:
   - "rawDescription": Descrizione testuale originale come appare sulla bolla
   - "quantity": Quantità numerica consegnata
   - "unit": Unità di misura (es. pacchi, risme, fogli, rotoli, pezzi, kg, flaconi)
   - "matchedItemId": Se l'articolo corrisponde chiaramente a uno di quelli già presenti nel nostro catalogo (vedi catalogo sotto), inserisci il suo ID esatto, altrimenti lascia null
   - "matchedItemName": Nome dell'articolo corrispondente o null
   - "categoryGuess": Categoria stimata tra: "offset_digitale", "editoria_legatoria", "immagine_coordinata", "cerimonie", "dtf_abbigliamento", "allestimenti_vetrofanie", "consumabili_tecnici"
   - "confidence": Numero tra 0.0 e 1.0 che indica la certezza del riconoscimento
   - "notes": Eventuali note tecniche estratte (es. grammatura, formato, lotto)

Catalogo articoli esistenti in tipografia:
${itemsCatalogShort}

Rispondi ESCLUSIVAMENTE con il blocco JSON valido senza commenti markdown aggiuntivi.`;

      const contents: any[] = [];
      if (imageBase64 && mimeType) {
        contents.push({
          inlineData: {
            data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
            mimeType: mimeType || "image/jpeg",
          },
        });
      }
      contents.push(prompt + (rawText ? `\n\nTesto trascritto della bolla:\n${rawText}` : ""));

      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
      });

      const textResponse = response.text || "";
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          supplierName: parsed.supplierName || "Fornitore Tipografico",
          documentNumber: parsed.documentNumber || "DDT-" + Math.floor(Math.random() * 90000 + 10000),
          documentDate: parsed.documentDate || new Date().toISOString().split("T")[0],
          rawTextPreview: textResponse.slice(0, 300),
          items: (parsed.items || []).map((it: any) => ({
            rawDescription: it.rawDescription || "Articolo consegnato",
            matchedItemId: it.matchedItemId || undefined,
            matchedItemName: it.matchedItemName || undefined,
            quantity: Number(it.quantity) || 1,
            unit: it.unit || "pacchi",
            suggestedAction: it.matchedItemId ? "MATCHED" : "NEW_ITEM",
            confidence: it.confidence || 0.9,
            categoryGuess: it.categoryGuess || "offset_digitale",
            notes: it.notes,
          })),
        };
      }
    } catch (err) {
      console.error("Errore chiamata Gemini Vision per DDT:", err);
    }
  }

  // Fallback simulato realistico per Tipografia Resta (consente di testare subito senza apiKey obbligatoria)
  return {
    supplierName: "Burgo Distribuzione SpA",
    documentNumber: "DDT-2026/04819",
    documentDate: new Date().toISOString().split("T")[0],
    rawTextPreview: "Ricevuto scarico merce pallet con n. 10 pacchi Patinata Opaca 170g 70x100 e n. 5 pacchi 300g",
    items: [
      {
        rawDescription: "CARTA PATINATA OPACA GR.170 70X100 PACCHI DA 250 FF",
        matchedItemId: "resta-pap-002",
        matchedItemName: "Patinata Opaca 170g 70x100",
        quantity: 10,
        unit: "pacchi (250ff)",
        suggestedAction: "MATCHED",
        confidence: 0.98,
        categoryGuess: "offset_digitale",
        notes: "Riconosciuto pacco standard Burgo da 250 fogli stesi.",
      },
      {
        rawDescription: "CARTA PATINATA OPACA GR.300 70X100 PACCHI DA 125 FF",
        matchedItemId: "resta-pap-003",
        matchedItemName: "Patinata Opaca 300g 70x100",
        quantity: 5,
        unit: "pacchi (125ff)",
        suggestedAction: "MATCHED",
        confidence: 0.95,
        categoryGuess: "offset_digitale",
        notes: "Cartoncino copertine.",
      },
      {
        rawDescription: "BOBINA FILM LAMINAZIONE SOFT-TOUCH 330MM X 500M",
        matchedItemId: "resta-ed-003",
        matchedItemName: "Bobina Plastificazione Soft-Touch 330mm x 500m",
        quantity: 2,
        unit: "rotoli",
        suggestedAction: "MATCHED",
        confidence: 0.92,
        categoryGuess: "editoria_legatoria",
        notes: "Risolve la sottoscorta critica della legatoria.",
      },
    ],
  };
}

/**
 * Calcola il fabbisogno materiali per una commessa tipografica reale
 */
export async function calculateJobMaterials(
  input: JobCalculationInput
): Promise<JobCalculationResult> {
  const currentItems = await getItems();

  const runQty = Math.max(1, Number(input.runQuantity) || 500);
  const pages = Number(input.pagesCount) || 1;
  const jobType = input.jobType || "commerciale";

  let sheetsNeeded = 0;
  let wastePercentage = 7; // media tipografica avviamento + sfrido
  let primaryItemId: string | undefined;
  let secondaryList: Array<{
    name: string;
    required: string;
    availableDescription: string;
    isAvailable: boolean;
  }> = [];
  const technicalAdvice: string[] = [];

  // Logica specialistica in base al tipo di lavorazione
  if (jobType === "commerciale" || jobType === "editoriale") {
    // Es. Volantini, Cataloghi, Pieghevoli
    // Un foglio steso 70x100 contiene: 8 fogli A4 per facciata = 16 pagine A4 a giro e volta
    const pagesPerSheet = 16;
    const signatures = Math.ceil(pages / pagesPerSheet);
    
    // Per cataloghi multipagina
    if (pages > 4) {
      sheetsNeeded = Math.ceil((runQty * pages) / pagesPerSheet);
      wastePercentage = runQty < 1000 ? 12 : runQty < 5000 ? 7 : 4;
      technicalAdvice.push(
        `Imposizione a 16esimi su formato macchina 70x100 cm: necessarie ${signatures} segnature distinte.`
      );
      technicalAdvice.push(
        `Sfrido avviamento calcolato al ${wastePercentage}% per registro piega e brossura.`
      );

      // Materiali legatoria
      const purGlue = currentItems.find((it) => it.id === "resta-ed-001");
      const softTouch = currentItems.find((it) => it.id === "resta-ed-003");

      secondaryList.push({
        name: "Colla PUR per Brossura",
        required: `${(runQty * 0.002).toFixed(1)} Kg`,
        availableDescription: purGlue ? `${purGlue.quantity} ${purGlue.unit}` : "Non tracciato",
        isAvailable: purGlue ? purGlue.quantity >= 1 : true,
      });

      if (input.finishing?.includes("soft-touch") || input.finishing?.includes("plastificazione")) {
        secondaryList.push({
          name: "Bobina Plastificazione Soft-Touch",
          required: `${Math.ceil(runQty * 0.32)} metri lineari`,
          availableDescription: softTouch ? `${softTouch.quantity} rotoli` : "In esaurimento",
          isAvailable: softTouch ? softTouch.quantity >= 1 : false,
        });
      }
    } else {
      // Pieghevole o volantino singolo (es. A4 aperto o 3 ante)
      // Su 70x100 resa 8 o 9 pezzi per foglio
      const yieldPerSheet = 8;
      sheetsNeeded = Math.ceil(runQty / yieldPerSheet);
      wastePercentage = runQty < 500 ? 15 : 6;
      technicalAdvice.push(
        `Resa calcolata: 8 copie per foglio macchina 70x100 cm con sormonto taglio e crocini.`
      );
    }

    // Ricerca carta nel magazzino
    const targetGrammage = input.paperGrammage || 170;
    const foundPaper = currentItems.find(
      (it) =>
        it.category === "offset_digitale" &&
        it.name.includes(`${targetGrammage}g`)
    ) || currentItems.find((it) => it.id === "resta-pap-002");

    if (foundPaper) {
      primaryItemId = foundPaper.id;
    }
  } else if (jobType === "indumenti") {
    // Stampa DTF su T-shirt o Felpe
    sheetsNeeded = runQty; // 1 maglia a capo
    wastePercentage = 3; // scarto per posizionamento e prova di colla

    // Ricerca capi neutri
    const foundShirt = currentItems.find(
      (it) => it.id === "resta-dtf-002" // T-shirt L Nera
    );
    if (foundShirt) primaryItemId = foundShirt.id;

    // Consumo film DTF (es. grafica A4 fronte = 30cm di film a maglia)
    const metersDtf = Math.ceil((runQty * 0.35) * 1.05);
    const dtfRoll = currentItems.find((it) => it.id === "resta-dtf-006");
    const dtfInkWhite = currentItems.find((it) => it.id === "resta-dtf-008");

    secondaryList.push({
      name: "Film DTF in Bobina (60cm)",
      required: `${metersDtf} metri lineari`,
      availableDescription: dtfRoll ? `${dtfRoll.quantity} bobine da 100m` : "Verifica magazzino",
      isAvailable: dtfRoll ? dtfRoll.quantity * 100 >= metersDtf : true,
    });

    secondaryList.push({
      name: "Inchiostro DTF Bianco Textile",
      required: `${(runQty * 12).toFixed(0)} ml stimati`,
      availableDescription: dtfInkWhite ? `${dtfInkWhite.quantity} flaconi` : "Sottoscorta!",
      isAvailable: dtfInkWhite ? dtfInkWhite.quantity >= 1 : false,
    });

    technicalAdvice.push(`Consumo film stimato su layout ottimizzato a 2 pose su larghezza 60cm.`);
    technicalAdvice.push(`Applicazione consigliata: 155°C per 15 sec su termopressa pneumatica.`);
  } else if (jobType === "cerimonia") {
    // Partecipazioni nozze
    sheetsNeeded = Math.ceil(runQty * 1.08); // 8% scarto per calligrafia e stampa a mano
    wastePercentage = 8;
    const foundAmalfi = currentItems.find((it) => it.id === "resta-cer-001");
    if (foundAmalfi) primaryItemId = foundAmalfi.id;

    const ceralacca = currentItems.find((it) => it.id === "resta-cer-003");
    const sticksNeeded = Math.ceil(runQty / 10);
    secondaryList.push({
      name: "Ceralacca Rosso Borgogna",
      required: `${sticksNeeded} stecche flessibili`,
      availableDescription: ceralacca ? `${ceralacca.quantity} stecche` : "0",
      isAvailable: ceralacca ? ceralacca.quantity >= sticksNeeded : false,
    });

    technicalAdvice.push(`Carta con bordi intonsi: alimentazione manuale su stampante per preservare le fibre.`);
  } else {
    sheetsNeeded = runQty;
    primaryItemId = currentItems[0]?.id;
  }

  const wasteSheets = Math.ceil((sheetsNeeded * wastePercentage) / 100);
  const totalGrossSheets = sheetsNeeded + wasteSheets;

  let primaryMaterialResult = undefined;
  if (primaryItemId) {
    const item = currentItems.find((it) => it.id === primaryItemId);
    if (item) {
      // Pacchi necessari (se pacco da 250 fogli)
      const sheetsPerPack = item.unit.includes("125") ? 125 : item.unit.includes("500") ? 500 : 250;
      const packsNeeded = item.unit.includes("pacch") ? Math.ceil(totalGrossSheets / sheetsPerPack) : totalGrossSheets;
      const isAvailable = item.quantity >= packsNeeded;

      primaryMaterialResult = {
        id: item.id,
        name: item.name,
        unit: item.unit,
        currentStock: item.quantity,
        requiredQuantity: packsNeeded,
        isAvailable,
        missingQuantity: isAvailable ? 0 : packsNeeded - item.quantity,
      };
    }
  }

  return {
    jobName: input.jobName || "Commessa di Stampa",
    sheetsNeeded,
    wastePercentage,
    wasteSheets,
    totalGrossSheets,
    packsNeeded: primaryMaterialResult?.requiredQuantity || Math.ceil(totalGrossSheets / 250),
    primaryMaterial: primaryMaterialResult,
    secondaryMaterials: secondaryList,
    technicalAdvice,
  };
}

/**
 * Chatbot assistente magazzino
 */
export async function askWarehouseAssistant(userQuestion: string): Promise<string> {
  const currentItems = await getItems();
  const criticalItems = currentItems.filter((it) => it.quantity <= it.minStockAlert);
  const gemini = getGeminiClient();

  if (gemini) {
    try {
      const summaryContext = currentItems
        .map((it) => `${it.name} (${it.category}): giacenza ${it.quantity} ${it.unit} (minimo ${it.minStockAlert}, fornitore ${it.supplier})`)
        .join("\n");

      const prompt = `Sei l'assistente IA del magazzino di "Nuova Tipolitografia Resta" a Bari.
Rispondi in modo professionale, conciso e pratico per il responsabile di produzione.
Ecco lo stato attuale delle scorte a magazzino:
${summaryContext}

Domanda dell'operatore: "${userQuestion}"
Fornisci una risposta chiara in italiano evidenziando subito urgenze, quantità esatte o consigli sui fornitori da contattare.`;

      const resp = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [prompt],
      });

      if (resp.text) return resp.text;
    } catch (e) {
      console.error("Errore chat Gemini:", e);
    }
  }

  // Risposta euristica locale in assenza di API key
  const q = userQuestion.toLowerCase();
  if (q.includes("ordinare") || q.includes("urgente") || q.includes("sottoscorta") || q.includes("finire")) {
    return `Attualmente in Tipografia Resta abbiamo **${criticalItems.length} articoli in sottoscorta critica**:\n` +
      criticalItems.map((it) => `• **${it.name}**: rimasti solo ${it.quantity} ${it.unit} (Soglia allerta: ${it.minStockAlert}) - Fornitore: ${it.supplier}`).join("\n") +
      `\n\n💡 **Consiglio immediato**: Ti consiglio di inoltrare l'ordine a **Burgo** per la patinata 170g e a **Plotterfilms/DuPont** per l'inchiostro bianco DTF per evitare blocchi alle macchine.`;
  }

  return `Ho controllato il magazzino: sono registrati ${currentItems.length} articoli operativi. I livelli critici riguardano in particolare la *Patinata Opaca 170g 70x100*, la *Bobina Soft-Touch* per le copertine plastificate e l'*Inchiostro Bianco DTF*. Puoi usare la sezione "Ordini Fornitori" per generare la distinta di acquisto.`;
}
