"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CalendarDays, X, ArrowRight, MessageCircle } from "lucide-react";

/**
 * Banner temporaneo per la prenotazione dei calendari.
 * Per rimuoverlo, basta rimuovere o commentare <CalendarAlert /> in app/page.tsx
 */
export default function CalendarAlert() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative z-[60] border-b-2 border-cmyk-key bg-cmyk-yellow text-black shadow-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-2.5 sm:flex-row sm:px-6 lg:px-8">
        
        {/* Left: Icon & Message */}
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-cmyk-key bg-black text-cmyk-yellow shadow-hard-sm">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="rounded bg-black px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-cmyk-yellow">
                Aperte le Prenotazioni
              </span>
              <span className="font-serif text-sm font-black text-cmyk-key sm:text-base">
                Calendari Personalizzati per la tua Azienda!
              </span>
            </div>
            <p className="text-xs text-cmyk-key/90">
              Da parete, da tavolo, olandesi e trittici con logo e grafica su misura. Blocca subito il tuo ordine per garantire tempi rapidi di stampa.
            </p>
          </div>
        </div>

        {/* Right: Actions & Close */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:flex-nowrap">
          {/* Quick WhatsApp Action */}
          <a
            href="https://wa.me/390805212367?text=Ciao,%20vorrei%20informazioni%20e%20un%20preventivo%20per%20i%20calendari%20personalizzati!"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 border border-cmyk-key bg-[#25d366] px-3.5 py-1.5 text-xs font-bold text-white shadow-hard-sm transition hover:bg-[#1ebd5b] active:translate-x-0"
          >
            <MessageCircle className="h-3.5 w-3.5 fill-white" />
            <span>Prenota su WhatsApp</span>
          </a>

          {/* Form Link */}
          <Link
            href="#preventivo"
            className="inline-flex items-center gap-1 border border-cmyk-key bg-black px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-hard-sm transition hover:bg-cmyk-magenta active:translate-x-0"
          >
            <span>Preventivo</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Dismiss button */}
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Chiudi avviso calendari"
            className="ml-1 flex h-8 w-8 items-center justify-center rounded border border-cmyk-key/30 bg-white/70 text-cmyk-key transition hover:bg-white hover:text-black"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
