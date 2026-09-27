"use client";

import React, { useState } from "react";
import {
  Camera,
  Upload,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Plus,
  Truck,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function DdtScannerPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);
  const [applySuccessMessage, setApplySuccessMessage] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [rawTextInput, setRawTextInput] = useState("");
  const [inputMode, setInputMode] = useState<"upload" | "text">("upload");

  // Gestione caricamento file immagine o PDF
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      triggerAnalysis(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  // Esecuzione analisi con IA
  const triggerAnalysis = async (
    base64?: string,
    mimeType?: string,
    rawText?: string
  ) => {
    setAnalyzing(true);
    setScanResult(null);
    setApplySuccessMessage(null);

    try {
      const res = await fetch("/api/warehouse/ai-scan-ddt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: mimeType || "image/jpeg",
          rawText: rawText || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setScanResult(data.data);
      } else {
        alert("Errore nell'analisi del documento: " + (data.error || "Riprova"));
      }
    } catch (err) {
      console.error("Errore chiamata API scanner:", err);
      alert("Si è verificato un errore di connessione.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Prova con DDT d'esempio istantaneo
  const handleLoadDemoDdt = () => {
    triggerAnalysis(undefined, undefined, "DDT Fedrigoni SpA n. 88412 - Consegna 10 pacchi Tintoretto Gesso 250g e 5 pacchi Acquerello Avorio 240g");
  };

  // Modifica quantità estratta
  const handleUpdateItemQty = (index: number, newQty: number) => {
    if (!scanResult) return;
    const updated = { ...scanResult };
    updated.items[index].quantity = Math.max(1, newQty);
    setScanResult(updated);
  };

  // Conferma e Carico effettivo nel magazzino
  const handleApplyToWarehouse = async () => {
    if (!scanResult || !scanResult.items) return;

    setApplying(true);
    try {
      const res = await fetch("/api/warehouse/ai-scan-ddt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applyItems: scanResult.items,
          documentNumber: scanResult.documentNumber,
          supplierName: scanResult.supplierName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setApplySuccessMessage(data.message);
        setScanResult(null);
        setImagePreview(null);
      }
    } catch (err) {
      alert("Errore durante il carico a magazzino.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intestazione */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ff007f]/10 text-[#ff007f] font-mono text-[11px] font-bold uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OCR Multimodale Gemini</span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#111111]">
            Carico con IA da Bolla / DDT
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Scatta una foto con lo smartphone o carica il PDF del DDT del fornitore: l'IA estrae gli articoli e aggiorna le scorte automaticamente.
          </p>
        </div>

        <button
          onClick={handleLoadDemoDdt}
          disabled={analyzing}
          className="self-start sm:self-auto px-3.5 py-2 bg-white border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ff007f]" />
          <span>Prova con DDT di Esempio</span>
        </button>
      </div>

      {/* Messaggio di successo post-carico */}
      {applySuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-800 text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{applySuccessMessage}</span>
          </div>
          <Link
            href="/magazzino"
            className="px-4 py-1.5 bg-emerald-700 text-white rounded text-xs font-bold hover:bg-emerald-800 transition"
          >
            Vedi Giacenze
          </Link>
        </div>
      )}

      {/* Sezione Caricamento / Acquisizione */}
      {!scanResult && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex border-b border-gray-200 pb-3 gap-4">
            <button
              onClick={() => setInputMode("upload")}
              className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition ${
                inputMode === "upload"
                  ? "border-[#111111] text-[#111111]"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              Foto / File DDT
            </button>
            <button
              onClick={() => setInputMode("text")}
              className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition ${
                inputMode === "text"
                  ? "border-[#111111] text-[#111111]"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              Testo o Copia/Incolla
            </button>
          </div>

          {inputMode === "upload" ? (
            <div className="border-2 border-dashed border-gray-300 hover:border-[#111111] rounded-xl p-8 text-center transition bg-gray-50/50">
              <input
                type="file"
                id="ddt-file-input"
                accept="image/*,application/pdf"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="ddt-file-input"
                className="cursor-pointer flex flex-col items-center justify-center gap-3"
              >
                <div className="w-16 h-16 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-[#ff007f]">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-sm font-bold text-[#111111] underline">
                    Scatta foto con la fotocamera o carica documento
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Supporta foto JPG, PNG o PDF di fatture e bolle (Burgo, Fedrigoni, Plotterfilms, ecc.)
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                rows={4}
                value={rawTextInput}
                onChange={(e) => setRawTextInput(e.target.value)}
                placeholder="Incolla qui il testo della bolla o la lista dei materiali ricevuti dal corriere..."
                className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:border-[#111111]"
              />
              <button
                onClick={() => triggerAnalysis(undefined, undefined, rawTextInput)}
                disabled={!rawTextInput.trim() || analyzing}
                className="w-full py-2.5 bg-[#111111] text-white rounded-lg text-xs font-bold hover:bg-[#ff007f] transition disabled:opacity-40"
              >
                Analizza Testo Bolla con IA
              </button>
            </div>
          )}

          {analyzing && (
            <div className="py-8 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#ff007f] animate-spin mx-auto" />
              <p className="text-sm font-bold text-gray-700">
                L'Intelligenza Artificiale sta leggendo la bolla...
              </p>
              <p className="text-xs text-gray-400 font-mono">
                Riconoscimento caratteri, estrazione formati, grammature e matching con il catalogo di Tipografia Resta
              </p>
            </div>
          )}
        </div>
      )}

      {/* Risultato Analisi IA e Tabella di Conferma Carico */}
      {scanResult && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6 animate-in fade-in">
          {/* Header DDT Riconosciuto */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-[#111111] text-white flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                  Fornitore Identificato
                </span>
                <h3 className="font-bold text-base text-gray-900">
                  {scanResult.supplierName}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-gray-400 block text-[10px]">N. DOCUMENTO</span>
                <span className="font-bold text-gray-800">{scanResult.documentNumber}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">DATA</span>
                <span className="font-bold text-gray-800">{scanResult.documentDate}</span>
              </div>
            </div>
          </div>

          {/* Lista Articoli Estratti con IA */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-base text-gray-900">
                Materiali Riconosciuti ({scanResult.items?.length || 0})
              </h4>
              <span className="text-xs text-gray-500">
                Verifica le quantità prima di confermare il carico
              </span>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
              {scanResult.items?.map((item: any, idx: number) => {
                const isMatched = item.suggestedAction === "MATCHED";
                return (
                  <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {isMatched ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                            ✓ Abbinato a Catalogo
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
                            + Nuovo Articolo
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-gray-400">
                          Accuratezza: {Math.round(item.confidence * 100)}%
                        </span>
                      </div>

                      <div className="font-bold text-sm text-gray-900">
                        {isMatched ? item.matchedItemName : item.rawDescription}
                      </div>

                      <div className="text-[11px] text-gray-500 font-mono">
                        Testo bolla: "{item.rawDescription}" {item.notes ? `• ${item.notes}` : ""}
                      </div>
                    </div>

                    {/* Regolazione Quantità Carico */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-xs text-gray-500">Quantità:</span>
                      <div className="flex items-center border border-gray-300 rounded bg-white">
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQty(idx, item.quantity - 1)}
                          className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItemQty(idx, Number(e.target.value))}
                          className="w-14 text-center font-mono font-bold text-sm py-1 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQty(idx, item.quantity + 1)}
                          className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {item.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Azioni di Conferma Carico */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => {
                setScanResult(null);
                setImagePreview(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 w-full sm:w-auto"
            >
              Annulla e Scansiona Altra Bolla
            </button>

            <button
              onClick={handleApplyToWarehouse}
              disabled={applying}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {applying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Caricamento scorte in corso...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Conferma e Carica {scanResult.items?.length} Articoli a Magazzino</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
