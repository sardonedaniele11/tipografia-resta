"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  Camera,
  Calculator,
  ShoppingCart,
  History,
  AlertTriangle,
  ArrowLeft,
  Menu,
  X,
  Sparkles,
  RefreshCw,
  Lock,
} from "lucide-react";
import PinAuth from "./components/PinAuth";

export default function WarehouseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [criticalCount, setCriticalCount] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([
    {
      role: "assistant",
      content:
        "Ciao! Sono l'assistente IA del magazzino di Tipografia Resta. Chiedimi qualsiasi cosa sulle scorte, cosa dobbiamo riordinare o il fabbisogno per un lavoro.",
    },
  ]);

  const navLinks = [
    { href: "/magazzino", label: "Giacenze", icon: Boxes },
    { href: "/magazzino/scanner", label: "Scanner DDT (IA)", icon: Camera },
    { href: "/magazzino/calcola", label: "Calcola Commessa", icon: Calculator },
    {
      href: "/magazzino/ordini",
      label: "Ordini Fornitori",
      icon: ShoppingCart,
      badge: criticalCount > 0 ? criticalCount : undefined,
    },
    { href: "/magazzino/movimenti", label: "Storico", icon: History },
  ];

  // Carica il contatore degli allarmi
  const fetchSummary = async () => {
    try {
      const res = await fetch("/api/warehouse/items?summary=true");
      const data = await res.json();
      if (data.success && data.summary) {
        setCriticalCount(data.summary.criticalCount || 0);
      }
    } catch (e) {
      console.error("Errore fetch summary:", e);
    }
  };

  useEffect(() => {
    // Controllo autenticazione salvata
    const authLocal = localStorage.getItem("resta_warehouse_auth");
    const authSession = sessionStorage.getItem("resta_warehouse_auth");
    if (authLocal === "true" || authSession === "true") {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);

    fetchSummary();
    const interval = setInterval(fetchSummary, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLock = () => {
    localStorage.removeItem("resta_warehouse_auth");
    sessionStorage.removeItem("resta_warehouse_auth");
    setIsAuthenticated(false);
  };

  const handleAskAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuestion.trim() || chatLoading) return;

    const q = chatQuestion;
    setChatQuestion("");
    setChatMessages((prev) => [...prev, { role: "user", content: q }]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/warehouse/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.answer },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Mi dispiace, si è verificato un errore nel consultare il magazzino.",
          },
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Errore di connessione con il servizio IA.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-[#111111]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PinAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#111111] flex flex-col font-sans">
      {/* Top Header Desktop & Tablet */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#111111]/15 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Titolo */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg border border-[#111111]/20 hover:bg-gray-100 transition"
              title="Torna al sito principale"
            >
              <ArrowLeft className="w-4 h-4 text-[#111111]" />
            </Link>
            <Link href="/magazzino" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#111111] text-white flex items-center justify-center font-serif font-black rounded text-base shadow-sm">
                R
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-extrabold text-base tracking-tight text-[#111111]">
                    Nuova Tipolitografia Resta
                  </span>
                  <span className="bg-[#00e5ff]/20 text-[#006064] text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border border-[#00e5ff]/40">
                    Magazzino IA
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 font-mono hidden sm:block">
                  Via Michele Garruba 68, Bari // Reparto Macchine & Scorte
                </p>
              </div>
            </Link>
          </div>

          {/* Navigazione Desktop */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition ${
                    isActive
                      ? "bg-[#111111] text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-[#111111]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-1 bg-[#ff007f] text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full font-black animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Azioni rapide Top Right */}
          <div className="flex items-center gap-2">
            {/* Tasto Assistente IA */}
            <button
              onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#ff007f] bg-[#ff007f]/10 text-[#ff007f] hover:bg-[#ff007f] hover:text-white transition text-xs font-bold shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Assistente IA</span>
            </button>

            {/* Alert badge rapido */}
            {criticalCount > 0 && (
              <Link
                href="/magazzino/ordini"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-red-100 text-red-700 border border-red-300 text-xs font-bold hover:bg-red-200 transition"
              >
                <AlertTriangle className="w-4 h-4 text-red-600 animate-bounce" />
                <span className="hidden sm:inline font-mono">
                  {criticalCount} Sottoscorta
                </span>
              </Link>
            )}

            {/* Tasto Blocca Schermo */}
            <button
              onClick={handleLock}
              title="Blocca e richiedi PIN"
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-600 hover:text-black transition flex items-center justify-center"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Menu Hamburger Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-[#111111]"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Header) */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-bold ${
                    isActive
                      ? "bg-[#111111] text-white"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="bg-[#ff007f] text-white text-xs font-mono px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-1 pb-24 md:pb-12 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar (Fixed for Smartphone in reparto) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-[#111111]/15 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
                isActive
                  ? "text-[#ff007f] font-black"
                  : "text-gray-500 hover:text-[#111111]"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`}
                />
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#ff007f] text-white text-[9px] font-mono px-1 rounded-full font-bold">
                    {link.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">
                {link.label.split(" ")[0]}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Drawer / Pannello Chat Assistente IA */}
      {aiAssistantOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-[#111111]/20 flex flex-col animate-in slide-in-from-right duration-200">
          <div className="p-4 border-b border-gray-200 bg-[#111111] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ff007f] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-serif font-bold">Assistente Magazzino</h3>
                <p className="text-[10px] text-gray-300 font-mono">Tipografia Resta IA</p>
              </div>
            </div>
            <button
              onClick={() => setAiAssistantOpen(false)}
              className="p-1 rounded text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Area Messaggi */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#faf9f6]">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#111111] text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center gap-2 text-xs text-gray-500 italic p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#ff007f]" />
                Sto controllando i registri di magazzino...
              </div>
            )}
          </div>

          {/* Input Chat */}
          <form
            onSubmit={handleAskAssistant}
            className="p-3 border-t border-gray-200 bg-white flex gap-2"
          >
            <input
              type="text"
              value={chatQuestion}
              onChange={(e) => setChatQuestion(e.target.value)}
              placeholder="Chiedi: es. 'Cosa dobbiamo ordinare?'"
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#ff007f]"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="bg-[#111111] text-white px-3 py-2 rounded text-xs font-bold hover:bg-[#ff007f] transition disabled:opacity-50"
            >
              Invia
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
