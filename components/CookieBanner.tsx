"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Cookie, X } from "lucide-react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Controlla se l'utente ha già espresso una preferenza
    const consent = localStorage.getItem("tipografia_resta_cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }

    // Ascolta un eventuale evento personalizzato per riaprire il banner dal footer
    const handleReopen = () => setShowBanner(true);
    window.addEventListener("reopen-cookie-banner", handleReopen);
    return () => window.removeEventListener("reopen-cookie-banner", handleReopen);
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("tipografia_resta_cookie_consent", "all");
    setShowBanner(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem("tipografia_resta_cookie_consent", "necessary");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <aside
      aria-label="Informativa sui Cookie"
      className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-cmyk-key bg-paper-white/95 p-4 shadow-hard-lg backdrop-blur-md sm:p-5"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        
        {/* Testo informativo */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center border border-cmyk-key bg-cmyk-yellow text-black shadow-hard-sm">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="text-xs text-cmyk-key/85 sm:text-sm">
            <p className="font-bold text-cmyk-key">
              Informativa sulla Privacy e utilizzo dei Cookie
            </p>
            <p className="mt-1 leading-relaxed">
              Questo sito utilizza esclusivamente cookie tecnici necessari al corretto funzionamento della navigazione e per l'invio delle richieste di preventivo. Non utilizziamo cookie di profilazione o tracciamento pubblicitario di terze parti. Per maggiori dettagli, consulta la nostra{" "}
              <Link
                href="/cookie-policy"
                className="font-bold text-cmyk-magenta underline hover:text-black"
              >
                Cookie Policy
              </Link>{" "}
              e la nostra{" "}
              <Link
                href="/privacy-policy"
                className="font-bold text-cmyk-magenta underline hover:text-black"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Pulsanti di scelta */}
        <div className="flex w-full flex-wrap items-center justify-end gap-2 md:w-auto md:flex-nowrap">
          <button
            onClick={handleAcceptNecessary}
            className="flex-1 border border-cmyk-key bg-paper-cream px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-cmyk-key shadow-hard-sm transition hover:bg-gray-200 active:translate-x-0 md:flex-none"
          >
            Solo Necessari
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 border border-cmyk-key bg-cmyk-cyan px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-hard-sm transition hover:bg-cmyk-yellow active:translate-x-0 md:flex-none"
          >
            Accetta Tutti
          </button>
          <button
            onClick={handleAcceptNecessary}
            aria-label="Chiudi informativa cookie"
            className="flex h-9 w-9 items-center justify-center border border-cmyk-key/30 bg-paper-cream text-cmyk-key transition hover:bg-paper-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

      </div>
    </aside>
  );
}
