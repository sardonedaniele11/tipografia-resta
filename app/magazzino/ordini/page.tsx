"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  AlertTriangle,
  Truck,
  Check,
  Copy,
  ExternalLink,
  MessageSquare,
  Package,
  RefreshCw,
} from "lucide-react";
import { WarehouseItem, getItemStatus } from "@/lib/warehouse/types";

export default function ReorderPage() {
  const [items, setItems] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedSupplier, setCopiedSupplier] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/warehouse/items");
      const data = await res.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Filtra solo gli articoli critici o in allarme
  const reorderItems = items.filter((it) => {
    const st = getItemStatus(it);
    return st === "CRITICAL" || st === "WARNING";
  });

  // Raggruppa per fornitore
  const groupedBySupplier = reorderItems.reduce((acc, item) => {
    const supp = item.supplier || "Fornitore non specificato";
    if (!acc[supp]) acc[supp] = [];
    acc[supp].push(item);
    return acc;
  }, {} as Record<string, WarehouseItem[]>);

  // Copia distinta fornitore negli appunti
  const handleCopyOrder = (supplier: string, list: WarehouseItem[]) => {
    const text = `Spettabile ${supplier},\ncon la presente Nuova Tipolitografia Resta richiede preventivo/ordine per i seguenti materiali:\n\n` +
      list.map((it) => {
        const toOrder = Math.max(1, it.optimalStock - it.quantity);
        return `• ${it.name} (${it.code}) - Quantità: ${toOrder} ${it.unit} [Giacenza attuale: ${it.quantity}]`;
      }).join("\n") +
      `\n\nConsegna presso: Via Michele Garruba 68, 70122 Bari (BA).\nGrazie, Nuova Tipolitografia Resta`;

    navigator.clipboard.writeText(text);
    setCopiedSupplier(supplier);
    setTimeout(() => setCopiedSupplier(null), 3000);
  };

  // Invia tramite WhatsApp
  const handleWhatsApp = (supplier: string, list: WarehouseItem[]) => {
    const text = `Buongiorno ${supplier}, da Nuova Tipolitografia Resta avremmo bisogno di riordinare:\n` +
      list.map((it) => {
        const toOrder = Math.max(1, it.optimalStock - it.quantity);
        return `- ${it.name}: ${toOrder} ${it.unit}`;
      }).join("\n") +
      `\nConsegna a Bari, Via Michele Garruba 68. Mi date conferma tempi di consegna? Grazie!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-mono text-[11px] font-bold uppercase mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>Alert Sottoscorta Intelligente</span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#111111]">
            Distinta Riordino Fornitori
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Elenco automatico dei prodotti sotto il livello di scorta minima o in esaurimento, raggruppati per fornitore per velocizzare gli ordini via email o WhatsApp.
          </p>
        </div>

        <button
          onClick={fetchItems}
          className="self-start sm:self-auto px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Aggiorna</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-sm text-gray-500">
          Analisi fabbisogni e fornitori in corso...
        </div>
      ) : reorderItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-emerald-200 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-3">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-800">
            Tutte le scorte sono a livello ottimale!
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            Nessun articolo risulta in allarme o sottoscorta critica in questo momento.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedBySupplier).map(([supplier, list]) => {
            const hasCritical = list.some((it) => getItemStatus(it) === "CRITICAL");

            return (
              <div
                key={supplier}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
                  hasCritical ? "border-red-300" : "border-gray-200"
                }`}
              >
                {/* Header Fornitore */}
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded bg-[#111111] text-white flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">{supplier}</h3>
                      <p className="text-[11px] text-gray-500">
                        {list.length} materiali da ordinare
                      </p>
                    </div>
                  </div>

                  {/* Azioni Rapide Ordine */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyOrder(supplier, list)}
                      className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 transition shadow-sm"
                    >
                      {copiedSupplier === supplier ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Distinta Copiata!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copia per Email</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleWhatsApp(supplier, list)}
                      className="px-3 py-1.5 bg-[#25d366] text-white rounded text-xs font-bold hover:bg-[#128c7e] flex items-center gap-1.5 transition shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Invia WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* Tabella Articoli Fornitore */}
                <div className="divide-y divide-gray-100">
                  {list.map((item) => {
                    const status = getItemStatus(item);
                    const isCrit = status === "CRITICAL";
                    const recommendedOrder = Math.max(1, item.optimalStock - item.quantity);

                    return (
                      <div
                        key={item.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            {isCrit ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 uppercase">
                                🔴 Critico
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 uppercase">
                                🟡 In Esaurimento
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-gray-400">
                              {item.code}
                            </span>
                          </div>
                          <div className="font-bold text-sm text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-gray-500 font-mono">
                            Ubicazione: {item.location} {item.notes ? `• ${item.notes}` : ""}
                          </div>
                        </div>

                        {/* Valori Giacenza e Riordino Consigliato */}
                        <div className="flex items-center gap-6 self-end sm:self-center text-right">
                          <div>
                            <span className="text-[10px] text-gray-400 uppercase font-mono block">
                              Giacenza
                            </span>
                            <span className="font-serif font-black text-sm text-red-700">
                              {item.quantity} {item.unit}
                            </span>
                          </div>

                          <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
                            <span className="text-[10px] text-emerald-800 uppercase font-bold block">
                              Consigliato
                            </span>
                            <span className="font-serif font-black text-sm text-emerald-900">
                              +{recommendedOrder} {item.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
