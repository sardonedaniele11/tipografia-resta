"use client";

import React, { useState } from "react";
import {
  Calculator,
  Sparkles,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Package,
  Printer,
  Shirt,
  Heart,
  BookOpen,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function JobCalculatorPage() {
  const [jobType, setJobType] = useState<string>("editoriale");
  const [jobName, setJobName] = useState<string>("Catalogo Aziendale 32 pag. A4");
  const [runQuantity, setRunQuantity] = useState<number>(1000);
  const [pagesCount, setPagesCount] = useState<number>(32);
  const [paperGrammage, setPaperGrammage] = useState<number>(170);
  const [finishing, setFinishing] = useState<string[]>(["soft-touch"]);

  const [calculating, setCalculating] = useState<boolean>(false);
  const [calcResult, setCalcResult] = useState<any>(null);
  const [deductSuccessMessage, setDeductSuccessMessage] = useState<string | null>(null);
  const [deducting, setDeducting] = useState<boolean>(false);

  // Esecuzione calcolo
  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCalculating(true);
    setCalcResult(null);
    setDeductSuccessMessage(null);

    try {
      const res = await fetch("/api/warehouse/ai-job-estimator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculationInput: {
            jobType,
            jobName,
            runQuantity,
            pagesCount,
            paperGrammage,
            finishing,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setCalcResult(data.result);
      }
    } catch (err) {
      console.error("Errore calcolo commessa:", err);
    } finally {
      setCalculating(false);
    }
  };

  // Scarico effettivo materiali dal magazzino
  const handleDeductStock = async () => {
    if (!calcResult) return;
    setDeducting(true);

    try {
      const res = await fetch("/api/warehouse/ai-job-estimator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculationInput: {
            jobType,
            jobName,
            runQuantity,
            pagesCount,
            paperGrammage,
            finishing,
          },
          deductStock: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDeductSuccessMessage(
          `Materiali per la commessa "${jobName}" scaricati con successo dalle giacenze!`
        );
        handleCalculate(); // Ricarica stato disponibilità
      }
    } catch (err) {
      alert("Errore durante lo scarico materiali.");
    } finally {
      setDeducting(false);
    }
  };

  const toggleFinishing = (fin: string) => {
    setFinishing((prev) =>
      prev.includes(fin) ? prev.filter((f) => f !== fin) : [...prev, fin]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intestazione */}
      <div className="border-b border-gray-200 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00e5ff]/20 text-[#006064] font-mono text-[11px] font-bold uppercase mb-1">
          <Calculator className="w-3.5 h-3.5" />
          <span>Simulatore Fabbisogno & Sfridi Tipografici</span>
        </div>
        <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#111111]">
          Calcola Fabbisogno Commessa
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Configura una lavorazione reale di Tipografia Resta: l'algoritmo calcola rese macchina, sfrido di avviamento e verifica istantaneamente se il magazzino copre il lavoro.
        </p>
      </div>

      {/* Messaggio scarico avvenuto */}
      {deductSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-800 text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{deductSuccessMessage}</span>
          </div>
          <Link
            href="/magazzino"
            className="px-4 py-1.5 bg-emerald-700 text-white rounded text-xs font-bold hover:bg-emerald-800 transition"
          >
            Vedi Giacenze
          </Link>
        </div>
      )}

      {/* Form Configurazione Commessa */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <form onSubmit={handleCalculate} className="space-y-5">
          {/* Selezione Servizio */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
              Tipo di Lavorazione (dal vostro catalogo)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "editoriale", label: "Cataloghi & Libri", icon: BookOpen },
                { id: "commerciale", label: "Pieghevoli & Flyer", icon: Printer },
                { id: "indumenti", label: "T-Shirt / DTF", icon: Shirt },
                { id: "cerimonia", label: "Partecipazioni Nozze", icon: Heart },
              ].map((serv) => {
                const Icon = serv.icon;
                const isSel = jobType === serv.id;
                return (
                  <button
                    key={serv.id}
                    type="button"
                    onClick={() => {
                      setJobType(serv.id);
                      if (serv.id === "indumenti") {
                        setJobName("Fornitura 50 T-Shirt Nere con stampa DTF");
                        setRunQuantity(50);
                      } else if (serv.id === "cerimonia") {
                        setJobName("Partecipazioni Amalfi Nozze");
                        setRunQuantity(120);
                      } else if (serv.id === "commerciale") {
                        setJobName("Pieghevoli A4 a 3 ante 170g");
                        setRunQuantity(2500);
                        setPagesCount(6);
                      } else {
                        setJobName("Catalogo Aziendale 32 pag. A4");
                        setRunQuantity(1000);
                        setPagesCount(32);
                      }
                    }}
                    className={`p-3 rounded-lg border text-left flex flex-col gap-1.5 transition ${
                      isSel
                        ? "bg-[#111111] text-white border-[#111111] shadow-sm"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-bold">{serv.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dati Generali Commessa */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Descrizione / Titolo Lavoro *
              </label>
              <input
                type="text"
                required
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-[#111111] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Tiratura / Copie Richieste *
              </label>
              <input
                type="number"
                min="1"
                required
                value={runQuantity}
                onChange={(e) => setRunQuantity(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono font-bold focus:border-[#111111] focus:outline-none"
              />
            </div>
          </div>

          {/* Dati Carta e Pagine */}
          {(jobType === "editoriale" || jobType === "commerciale") && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Numero Pagine Totali
                </label>
                <input
                  type="number"
                  min="2"
                  step="2"
                  value={pagesCount}
                  onChange={(e) => setPagesCount(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Grammatura Carta Interno
                </label>
                <select
                  value={paperGrammage}
                  onChange={(e) => setPaperGrammage(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-[#111111] focus:outline-none bg-white"
                >
                  <option value={130}>Patinata Opaca 130g</option>
                  <option value={150}>Patinata Lucida 150g</option>
                  <option value={170}>Patinata Opaca 170g</option>
                  <option value={80}>Usomano Naturale 80g</option>
                  <option value={120}>Usomano Naturale 120g</option>
                  <option value={300}>Cartoncino 300g</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Nobilitazioni Previste
                </label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {[
                    { id: "soft-touch", label: "Soft-Touch" },
                    { id: "lamina-oro", label: "Foil Oro" },
                    { id: "uv-lucido", label: "UV Registro" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => toggleFinishing(f.id)}
                      className={`text-[10px] px-2.5 py-1 rounded font-bold border transition ${
                        finishing.includes(f.id)
                          ? "bg-[#ff007f] text-white border-[#ff007f]"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={calculating}
              className="px-6 py-2.5 bg-[#111111] text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-[#00e5ff] hover:text-black transition flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {calculating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Calcolo matematico rese in corso...</span>
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4" />
                  <span>Calcola Fabbisogno e Verifica Magazzino</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Risultato del Calcolo e Verifica Magazzino */}
      {calcResult && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-4">
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                Risultato Stima Tecnica
              </span>
              <h3 className="font-serif font-bold text-xl text-gray-900">
                {calcResult.jobName} ({runQuantity} copie)
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block">Sfrido Avviamento Macchina</span>
              <span className="font-mono font-bold text-sm text-[#ff007f]">
                +{calcResult.wastePercentage}% ({calcResult.wasteSheets} fogli di scarto previsti)
              </span>
            </div>
          </div>

          {/* Cruscotto Numerico */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">
                Fogli Macchina Netti
              </span>
              <span className="text-xl font-serif font-black text-gray-900">
                {calcResult.sheetsNeeded.toLocaleString("it-IT")}
              </span>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">
                Sfrido & Avviamento
              </span>
              <span className="text-xl font-serif font-black text-[#ff007f]">
                +{calcResult.wasteSheets}
              </span>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">
                Totale Fogli Lordi
              </span>
              <span className="text-xl font-serif font-black text-gray-900">
                {calcResult.totalGrossSheets.toLocaleString("it-IT")}
              </span>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-[10px] uppercase font-bold text-blue-800 block">
                Fabbisogno Scatole/Pacchi
              </span>
              <span className="text-xl font-serif font-black text-blue-900">
                {calcResult.packsNeeded} {calcResult.primaryMaterial?.unit || "pacchi"}
              </span>
            </div>
          </div>

          {/* VERIFICA DISPONIBILITA' MAGAZZINO (SEMAFORO) */}
          {calcResult.primaryMaterial && (
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                calcResult.primaryMaterial.isAvailable
                  ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                  : "bg-red-50 border-red-300 text-red-900"
              }`}
            >
              <div className="flex items-start gap-3">
                {calcResult.primaryMaterial.isAvailable ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    {calcResult.primaryMaterial.isAvailable
                      ? "✓ Materiale disponibile in magazzino per questa commessa"
                      : "⚠️ ATTENZIONE: Scorta insufficiente a magazzino!"}
                  </div>
                  <p className="text-xs mt-0.5 opacity-90">
                    Articolo: <strong>{calcResult.primaryMaterial.name}</strong> | Giacenza
                    attuale: <strong>{calcResult.primaryMaterial.currentStock} {calcResult.primaryMaterial.unit}</strong> | Fabbisogno: <strong>{calcResult.primaryMaterial.requiredQuantity} {calcResult.primaryMaterial.unit}</strong>
                  </p>
                  {!calcResult.primaryMaterial.isAvailable && (
                    <p className="text-xs font-bold text-red-700 mt-1">
                      Mancano {calcResult.primaryMaterial.missingQuantity} {calcResult.primaryMaterial.unit} per poter completare il lavoro. Ti consigliamo di emettere un ordine a fornitore.
                    </p>
                  )}
                </div>
              </div>

              {/* Tasto Scarica Magazzino */}
              {calcResult.primaryMaterial.isAvailable && (
                <button
                  onClick={handleDeductStock}
                  disabled={deducting}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow transition whitespace-nowrap self-start sm:self-auto disabled:opacity-50"
                >
                  {deducting
                    ? "Aggiornamento giacenze..."
                    : "Scarica materiali per questo lavoro"}
                </button>
              )}
            </div>
          )}

          {/* Materiali Secondari e Consumabili */}
          {calcResult.secondaryMaterials && calcResult.secondaryMaterials.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2">
                Altri Consumabili Necessari per la Commessa
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {calcResult.secondaryMaterials.map((sec: any, i: number) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-xs text-gray-800 block">
                        {sec.name}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Stimato: {sec.required}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        sec.isAvailable
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {sec.availableDescription}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consigli Tecnici Reparto Macchine */}
          {calcResult.technicalAdvice && calcResult.technicalAdvice.length > 0 && (
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-lg text-xs space-y-1">
              <span className="font-bold text-amber-900 block font-mono text-[10px] uppercase tracking-wider">
                Note Tecniche per il Reparto Stampa:
              </span>
              {calcResult.technicalAdvice.map((note: string, idx: number) => (
                <p key={idx} className="text-amber-800">
                  • {note}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
