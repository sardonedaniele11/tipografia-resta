"use client";

import React, { useState, useEffect } from "react";
import {
  History,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw,
  User,
  Calendar,
  Package,
  RefreshCw,
} from "lucide-react";
import { StockMovement } from "@/lib/warehouse/types";

export default function MovementsPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<"ALL" | "IN" | "OUT" | "ADJUST">("ALL");

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/warehouse/movements?limit=100");
      const data = await res.json();
      if (data.success) {
        setMovements(data.movements || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  const filtered = movements.filter((m) => {
    if (filterType === "ALL") return true;
    return m.type === filterType;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intestazione */}
      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-mono text-[11px] font-bold uppercase mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Registro di Magazzino</span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#111111]">
            Storico Cronologico Movimenti
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Tracciabilità completa di tutti i carichi merce, scarichi commesse e rettifiche con data, causale e operatore.
          </p>
        </div>

        <button
          onClick={fetchMovements}
          className="self-start sm:self-auto px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Aggiorna</span>
        </button>
      </div>

      {/* Filtri Tipo Movimento */}
      <div className="flex items-center gap-2 text-xs">
        {[
          { id: "ALL", label: "Tutti i movimenti" },
          { id: "IN", label: "Solo Entrate (Carichi)" },
          { id: "OUT", label: "Solo Uscite (Commesse)" },
          { id: "ADJUST", label: "Rettifiche Inventario" },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilterType(btn.id as any)}
            className={`px-3.5 py-1.5 rounded-full font-bold border transition ${
              filterType === btn.id
                ? "bg-[#111111] text-white border-[#111111]"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Lista Movimenti */}
      {loading ? (
        <div className="py-20 text-center font-mono text-sm text-gray-500">
          Caricamento storico in corso...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-700">Nessun movimento registrato</h3>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200 shadow-sm overflow-hidden">
          {filtered.map((mov) => {
            const isEntry = mov.type === "IN";
            const isExit = mov.type === "OUT";
            const dateFormatted = new Date(mov.timestamp).toLocaleString("it-IT", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={mov.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 transition"
              >
                <div className="flex items-start gap-3">
                  {/* Icona Tipo */}
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold flex-shrink-0 mt-0.5 ${
                      isEntry
                        ? "bg-emerald-100 text-emerald-800"
                        : isExit
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {isEntry ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : isExit ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <RotateCcw className="w-5 h-5" />
                    )}
                  </div>

                  {/* Dettagli Movimento */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          isEntry
                            ? "bg-emerald-100 text-emerald-800"
                            : isExit
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {isEntry ? "Carico" : isExit ? "Scarico" : "Rettifica"}
                      </span>
                      <span className="text-[11px] font-mono text-gray-400">
                        {dateFormatted}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-gray-900">
                      {mov.itemName}
                    </div>

                    <div className="text-xs text-gray-600 flex flex-wrap items-center gap-3">
                      <span>Causale: <strong>{mov.reason}</strong></span>
                      <span className="text-gray-400">•</span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <User className="w-3 h-3" /> {mov.operator}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Variazione Numerica */}
                <div className="text-right self-end sm:self-center">
                  <div
                    className={`font-serif font-black text-lg ${
                      isEntry
                        ? "text-emerald-700"
                        : isExit
                        ? "text-red-700"
                        : "text-blue-700"
                    }`}
                  >
                    {isEntry ? `+${mov.quantity}` : isExit ? `-${mov.quantity}` : mov.quantity}
                  </div>
                  <div className="text-[10px] font-mono text-gray-400">
                    Giacenza: {mov.previousQuantity} → {mov.newQuantity}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
