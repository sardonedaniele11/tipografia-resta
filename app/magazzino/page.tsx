"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  WarehouseItem,
  WarehouseCategory,
  StockStatus,
  WAREHOUSE_CATEGORIES,
  getItemStatus,
} from "@/lib/warehouse/types";
import {
  Search,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  SlidersHorizontal,
  Package,
  Layers,
  MapPin,
  Truck,
  Sparkles,
  ArrowUpDown,
  Filter,
} from "lucide-react";

export default function WarehouseDashboard() {
  const [items, setItems] = useState<WarehouseItem[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<WarehouseCategory | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<StockStatus | "all">("all");

  // Stato Modale Aggiornamento / Scarico Rapido
  const [activeItemForAdjust, setActiveItemForAdjust] = useState<WarehouseItem | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>("");
  const [operatorName, setOperatorName] = useState<string>("Operatore");
  const [isSubmittingAdjust, setIsSubmittingAdjust] = useState<boolean>(false);

  // Stato Modale Nuovo Articolo
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState<boolean>(false);
  const [newItemForm, setNewItemForm] = useState({
    name: "",
    code: "",
    category: "offset_digitale" as WarehouseCategory,
    subcategory: "",
    unit: "pacchi (250ff)",
    quantity: 10,
    minStockAlert: 5,
    optimalStock: 20,
    supplier: "",
    location: "",
    unitCost: 0,
    notes: "",
  });

  // Caricamento dati magazzino
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/warehouse/items?summary=true");
      const data = await res.json();
      if (data.success) {
        setItems(data.items);
        setSummary(data.summary);
      }
    } catch (e) {
      console.error("Errore caricamento magazzino:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Modifica rapida delta (+1 / -1) direttamente da card/tabella
  const handleQuickDelta = async (
    item: WarehouseItem,
    delta: number,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    if (item.quantity + delta < 0) return;

    try {
      const res = await fetch(`/api/warehouse/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          delta,
          reason: delta < 0 ? "Scarico rapido operatore" : "Carico rapido operatore",
          operator: "Reparto Macchine",
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Aggiorna stato locale ottimistico
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? data.item : it))
        );
        // Ricarica riepilogo contatori
        loadData();
      }
    } catch (err) {
      console.error("Errore modifica rapida:", err);
    }
  };

  // Conferma modale di scarico/carico dettagliato
  const handleSubmitDetailedAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItemForAdjust) return;

    setIsSubmittingAdjust(true);
    try {
      const res = await fetch(`/api/warehouse/items/${activeItemForAdjust.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          delta: adjustDelta,
          reason: adjustReason || (adjustDelta < 0 ? "Scarico commessa" : "Carico merce"),
          operator: operatorName || "Operatore",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveItemForAdjust(null);
        setAdjustDelta(0);
        setAdjustReason("");
        loadData();
      }
    } catch (err) {
      console.error("Errore salvataggio rettifica:", err);
    } finally {
      setIsSubmittingAdjust(false);
    }
  };

  // Creazione nuovo articolo
  const handleCreateNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/warehouse/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItemForm),
      });
      const data = await res.json();
      if (data.success) {
        setIsNewItemModalOpen(false);
        setNewItemForm({
          name: "",
          code: "",
          category: "offset_digitale",
          subcategory: "",
          unit: "pacchi (250ff)",
          quantity: 10,
          minStockAlert: 5,
          optimalStock: 20,
          supplier: "",
          location: "",
          unitCost: 0,
          notes: "",
        });
        loadData();
      }
    } catch (err) {
      console.error("Errore creazione articolo:", err);
    }
  };

  // Reset catalogo
  const handleResetCatalog = async () => {
    if (confirm("Vuoi ripristinare il catalogo iniziale con tutti gli articoli di Tipografia Resta?")) {
      await fetch("/api/warehouse/reset", { method: "POST" });
      loadData();
    }
  };

  // Filtro articoli in memoria
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Filtro ricerca
      if (search.trim()) {
        const term = search.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(term) ||
          item.code.toLowerCase().includes(term) ||
          item.supplier.toLowerCase().includes(term) ||
          item.subcategory.toLowerCase().includes(term) ||
          item.location.toLowerCase().includes(term);
        if (!matches) return false;
      }

      // Filtro categoria
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }

      // Filtro stato allerta
      if (selectedStatus !== "all") {
        const st = getItemStatus(item);
        if (st !== selectedStatus) return false;
      }

      return true;
    });
  }, [items, search, selectedCategory, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* 1. TOP METRICHE CRUSCOTTO */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Totale Articoli */}
        <div
          onClick={() => setSelectedStatus("all")}
          className={`p-4 rounded-xl border bg-white shadow-sm cursor-pointer transition hover:border-[#111111] ${
            selectedStatus === "all" ? "ring-2 ring-[#111111]" : ""
          }`}
        >
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Totale Articoli</span>
            <Package className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-black text-[#111111]">
            {summary?.totalItemsCount || items.length}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Giacenze registrate</p>
        </div>

        {/* Sottoscorta Critica (Rosso) */}
        <div
          onClick={() => setSelectedStatus(selectedStatus === "CRITICAL" ? "all" : "CRITICAL")}
          className={`p-4 rounded-xl border bg-red-50 border-red-200 shadow-sm cursor-pointer transition hover:border-red-500 ${
            selectedStatus === "CRITICAL" ? "ring-2 ring-red-600" : ""
          }`}
        >
          <div className="flex items-center justify-between text-red-700 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              Critico
            </span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-black text-red-700">
            {summary?.criticalCount ?? 0}
          </div>
          <p className="text-[11px] text-red-600 mt-1 font-semibold">
            Rischio fermo macchina
          </p>
        </div>

        {/* In Esaurimento (Giallo) */}
        <div
          onClick={() => setSelectedStatus(selectedStatus === "WARNING" ? "all" : "WARNING")}
          className={`p-4 rounded-xl border bg-amber-50 border-amber-200 shadow-sm cursor-pointer transition hover:border-amber-500 ${
            selectedStatus === "WARNING" ? "ring-2 ring-amber-600" : ""
          }`}
        >
          <div className="flex items-center justify-between text-amber-800 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Attenzione</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-black text-amber-800">
            {summary?.warningCount ?? 0}
          </div>
          <p className="text-[11px] text-amber-700 mt-1">Da riordinare a breve</p>
        </div>

        {/* Valore Totale Stimato */}
        <div className="p-4 rounded-xl border bg-white shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Valore Merce</span>
            <span className="font-mono text-xs font-bold text-emerald-600">€</span>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-black text-[#111111]">
            €{summary?.totalEstimatedValue ? summary.totalEstimatedValue.toLocaleString("it-IT") : "0"}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Costo medio a terra</p>
        </div>
      </div>

      {/* 2. BARRA AZIONI E RICERCA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Input Ricerca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca carta (es. 170g, 70x100), t-shirt, fornitore o codice..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#111111] shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-black font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Bottoni Azione Desktop */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewItemModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#111111] text-white text-xs font-bold rounded-lg hover:bg-[#ff007f] transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nuovo Articolo</span>
          </button>
          <button
            onClick={handleResetCatalog}
            title="Ripristina articoli predefiniti Tipografia Resta"
            className="p-2.5 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-black transition shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. FILTRI REPARTO (HORIZONTAL TOUCH SCROLL) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`whitespace-nowrap px-3.5 py-1.5 rounded-full font-bold transition border ${
            selectedCategory === "all"
              ? "bg-[#111111] text-white border-[#111111]"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          Tutti ({items.length})
        </button>

        {WAREHOUSE_CATEGORIES.map((cat) => {
          const count = items.filter((it) => it.category === cat.id).length;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full font-bold transition border flex items-center gap-1.5 ${
                isSelected
                  ? "bg-[#111111] text-white border-[#111111]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. LISTA ARTICOLI (MOBILE CARDS + DESKTOP TABLE) */}
      {loading ? (
        <div className="py-20 text-center text-gray-500 font-mono text-sm">
          Caricamento scorte di magazzino in corso...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-700">Nessun materiale trovato</h3>
          <p className="text-xs text-gray-500 mt-1">
            Modifica i filtri di ricerca o la categoria selezionata.
          </p>
        </div>
      ) : (
        <>
          {/* VISTA MOBILE: SCHEDE A BOTTONI GRANDI DA OFFICINA */}
          <div className="md:hidden space-y-3">
            {filteredItems.map((item) => {
              const status = getItemStatus(item);
              const isCritical = status === "CRITICAL";
              const isWarning = status === "WARNING";

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border p-4 shadow-sm transition ${
                    isCritical
                      ? "border-red-300 bg-red-50/30"
                      : isWarning
                      ? "border-amber-300"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        {isCritical && (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200 uppercase tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                            Sottoscorta
                          </span>
                        )}
                        {isWarning && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wide">
                            In Esaurimento
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-gray-500">
                          {item.code}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#111111] mt-1">
                        {item.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <Truck className="w-3 h-3" /> {item.supplier}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {item.location}
                        </span>
                      </div>
                    </div>

                    {/* Bottone dettagli / causale */}
                    <button
                      onClick={() => {
                        setActiveItemForAdjust(item);
                        setAdjustDelta(0);
                      }}
                      className="p-1.5 text-gray-400 hover:text-black rounded border border-gray-200 bg-white"
                      title="Apri dettaglio rettifica"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Barra Giacenza e Pulsanti Enormi per il Reparto Macchine */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black font-serif text-[#111111]">
                          {item.quantity}
                        </span>
                        <span className="text-xs text-gray-600 font-medium">
                          {item.unit}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        Minimo allerta: {item.minStockAlert} | Ottimale: {item.optimalStock}
                      </p>
                    </div>

                    {/* Tasti + e - formato touch per smartphone */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleQuickDelta(item, -1, e)}
                        disabled={item.quantity <= 0}
                        className="w-11 h-11 rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 border border-gray-300 flex items-center justify-center text-[#111111] font-bold text-lg disabled:opacity-30 active:scale-95 transition"
                        title="Scarica 1 unità"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => handleQuickDelta(item, 1, e)}
                        className="w-11 h-11 rounded-lg bg-[#111111] hover:bg-[#ff007f] active:bg-black border border-[#111111] flex items-center justify-center text-white font-bold text-lg active:scale-95 transition"
                        title="Carica 1 unità"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* VISTA DESKTOP: TABELLA COMPLETA GESTIONALE */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#111111] text-white uppercase text-[10px] tracking-wider font-mono">
                  <tr>
                    <th className="py-3 px-4">Stato</th>
                    <th className="py-3 px-4">Articolo / Supporto</th>
                    <th className="py-3 px-4">Reparto</th>
                    <th className="py-3 px-4">Fornitore & Ubicazione</th>
                    <th className="py-3 px-4 text-center">Giacenza</th>
                    <th className="py-3 px-4">Livello Scorte</th>
                    <th className="py-3 px-4 text-right">Azioni Rapide</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItems.map((item) => {
                    const status = getItemStatus(item);
                    const isCritical = status === "CRITICAL";
                    const isWarning = status === "WARNING";
                    const percentage = Math.min(
                      100,
                      Math.round((item.quantity / item.optimalStock) * 100)
                    );

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-gray-50/80 transition ${
                          isCritical
                            ? "bg-red-50/40"
                            : isWarning
                            ? "bg-amber-50/30"
                            : ""
                        }`}
                      >
                        {/* Stato Semaforico */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {isCritical ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                              Sottoscorta
                            </span>
                          ) : isWarning ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                              In Esaurimento
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              Ottimale
                            </span>
                          )}
                        </td>

                        {/* Nome & Codice */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-gray-900 text-sm">
                            {item.name}
                          </div>
                          <div className="text-[11px] font-mono text-gray-500">
                            {item.code} {item.notes ? `• ${item.notes}` : ""}
                          </div>
                        </td>

                        {/* Reparto */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-gray-600">
                          <span className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                            {item.subcategory}
                          </span>
                        </td>

                        {/* Fornitore & Posizione */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-800">
                            {item.supplier}
                          </div>
                          <div className="text-[11px] text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {item.location}
                          </div>
                        </td>

                        {/* Quantità */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className="font-serif font-extrabold text-base text-[#111111]">
                            {item.quantity}
                          </span>{" "}
                          <span className="text-[11px] text-gray-500">
                            {item.unit}
                          </span>
                        </td>

                        {/* Barra Livello */}
                        <td className="py-3.5 px-4 w-40">
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full ${
                                isCritical
                                  ? "bg-red-600"
                                  : isWarning
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-[9px] text-gray-400 mt-1 font-mono">
                            <span>Allerta: {item.minStockAlert}</span>
                            <span>Target: {item.optimalStock}</span>
                          </div>
                        </td>

                        {/* Azioni Rapide */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={(e) => handleQuickDelta(item, -1, e)}
                              disabled={item.quantity <= 0}
                              className="w-7 h-7 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 disabled:opacity-30"
                              title="Scarica 1 unità"
                            >
                              -
                            </button>
                            <button
                              onClick={(e) => handleQuickDelta(item, 1, e)}
                              className="w-7 h-7 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700"
                              title="Carica 1 unità"
                            >
                              +
                            </button>
                            <button
                              onClick={() => {
                                setActiveItemForAdjust(item);
                                setAdjustDelta(0);
                              }}
                              className="ml-1 px-2 py-1 rounded bg-gray-100 hover:bg-[#111111] hover:text-white text-gray-700 text-[11px] font-bold transition"
                            >
                              Rettifica
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* MODALE RETTIFICA DETTAGLIATA / SCARICO COMMESSA */}
      {activeItemForAdjust && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-300 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-serif font-bold text-lg text-[#111111]">
              Movimenta Articolo
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{activeItemForAdjust.name}</p>

            <form onSubmit={handleSubmitDetailedAdjust} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Giacenza Attuale:{" "}
                  <span className="text-[#111111] font-extrabold text-sm">
                    {activeItemForAdjust.quantity} {activeItemForAdjust.unit}
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Variazione Quantità (+ per carico, - per scarico)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustDelta((d) => d - 1)}
                    className="w-10 h-10 rounded border border-gray-300 font-bold hover:bg-gray-100 text-base"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={adjustDelta}
                    onChange={(e) => setAdjustDelta(Number(e.target.value))}
                    className="flex-1 text-center font-mono font-bold text-lg border border-gray-300 rounded py-2 focus:border-[#111111] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustDelta((d) => d + 1)}
                    className="w-10 h-10 rounded border border-gray-300 font-bold hover:bg-gray-100 text-base"
                  >
                    +
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 text-center">
                  Nuova giacenza risulterà:{" "}
                  <strong className="text-[#111111]">
                    {Math.max(0, activeItemForAdjust.quantity + adjustDelta)}{" "}
                    {activeItemForAdjust.unit}
                  </strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Causale Movimento
                </label>
                <input
                  type="text"
                  required
                  placeholder="es. Commessa n. 1042 / Arrivo corriere / Scarto"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Operatore
                </label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveItemForAdjust(null)}
                  className="px-4 py-2 border border-gray-300 rounded text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdjust || adjustDelta === 0}
                  className="px-4 py-2 bg-[#111111] text-white rounded text-xs font-bold hover:bg-[#ff007f] disabled:opacity-40 transition"
                >
                  {isSubmittingAdjust ? "Salvataggio..." : "Registra Movimento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE CREAZIONE NUOVO ARTICOLO */}
      {isNewItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-gray-300 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-lg text-[#111111]">
              Aggiungi Nuovo Articolo a Magazzino
            </h3>
            <p className="text-xs text-gray-500">
              Inserisci i dettagli tecnici del supporto o consumabile
            </p>

            <form onSubmit={handleCreateNewItem} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Nome Materiale / Supporto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="es. Carta Perlata 300g 70x100"
                  value={newItemForm.name}
                  onChange={(e) =>
                    setNewItemForm({ ...newItemForm, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Reparto *
                  </label>
                  <select
                    value={newItemForm.category}
                    onChange={(e) =>
                      setNewItemForm({
                        ...newItemForm,
                        category: e.target.value as WarehouseCategory,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-[#111111] focus:outline-none bg-white"
                  >
                    {WAREHOUSE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Sottocategoria
                  </label>
                  <input
                    type="text"
                    placeholder="es. Carte Speciali, DTF, Inchiostri"
                    value={newItemForm.subcategory}
                    onChange={(e) =>
                      setNewItemForm({ ...newItemForm, subcategory: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-[#111111] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Giacenza Iniziale
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newItemForm.quantity}
                    onChange={(e) =>
                      setNewItemForm({
                        ...newItemForm,
                        quantity: Number(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Soglia Allerta Minima
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newItemForm.minStockAlert}
                    onChange={(e) =>
                      setNewItemForm({
                        ...newItemForm,
                        minStockAlert: Number(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Unità Misura
                  </label>
                  <input
                    type="text"
                    placeholder="es. pacchi (250ff), rotoli, pz"
                    value={newItemForm.unit}
                    onChange={(e) =>
                      setNewItemForm({ ...newItemForm, unit: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-[#111111] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Fornitore Principale
                  </label>
                  <input
                    type="text"
                    placeholder="es. Fedrigoni, Burgo, APA"
                    value={newItemForm.supplier}
                    onChange={(e) =>
                      setNewItemForm({ ...newItemForm, supplier: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Ubicazione Officina
                  </label>
                  <input
                    type="text"
                    placeholder="es. Bancale 4, Scaffale C1"
                    value={newItemForm.location}
                    onChange={(e) =>
                      setNewItemForm({ ...newItemForm, location: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-[#111111] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#111111] text-white rounded text-xs font-bold hover:bg-[#ff007f] transition"
                >
                  Crea Articolo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
