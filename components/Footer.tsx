"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  const reopenCookieSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("reopen-cookie-banner"));
    }
  };

  return (
    <footer className="border-t border-cmyk-key bg-[#141414] text-paper-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
          
          {/* Col 1: Brand & Tagline */}
          <div>
            <Link href="/#hero" className="inline-block border border-white/20 bg-paper-white p-2 shadow-sm">
              <div className="relative h-14 w-44">
                <Image
                  src="/assets/logo-resta.jpg"
                  alt="Nuova Tipolitografia Resta"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="mt-4 text-xs leading-relaxed text-gray-400">
              Tradizione e innovazione nella stampa a Bari. Soluzioni offset, digitali, abbigliamento personalizzato e allestimenti visivi.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.facebook.com/nuovatipolitografiaresta/?locale=it_IT"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center border border-white/20 bg-black text-white transition hover:border-cmyk-cyan hover:text-cmyk-cyan"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/tipografiaresta/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center border border-white/20 bg-black text-white transition hover:border-cmyk-magenta hover:text-cmyk-magenta"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-paper-white">
              Link Rapidi
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-gray-400">
              <li>
                <Link href="/#hero" className="transition hover:text-cmyk-cyan">Home Page</Link>
              </li>
              <li>
                <Link href="/#chi-siamo" className="transition hover:text-cmyk-cyan">Chi Siamo & La Storia</Link>
              </li>
              <li>
                <Link href="/#servizi" className="transition hover:text-cmyk-cyan">Servizi di Stampa</Link>
              </li>
              <li>
                <Link href="/#portfolio" className="transition hover:text-cmyk-cyan">Lavori Recenti (Instagram)</Link>
              </li>
              <li>
                <Link href="/#preventivo" className="transition hover:text-cmyk-cyan">Richiedi Preventivo Online</Link>
              </li>
              <li>
                <Link href="/#contatti" className="transition hover:text-cmyk-cyan">Dove Siamo & Contatti</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Note Legali Societarie & Privacy */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-paper-white">
              Dati Societari & Privacy
            </h4>
            <div className="mt-4 space-y-1.5 text-xs text-gray-400">
              <p className="font-semibold text-white">Nuova Tipolitografia Resta S.n.c.</p>
              <p>di Sardone Giuseppe e Claudio</p>
              <p>Via Michele Garruba 68, 70122 Bari (BA)</p>
              <p>Partita IVA: <span className="font-mono text-white">04759440722</span></p>
              <p>Codice Fiscale: <span className="font-mono text-white">04759440722</span></p>
              <p>Iscrizione REA: <span className="font-mono text-white">BA-335716</span></p>
              <p>PEC: <span className="font-mono text-white">Tipografiaresta@pec.it</span></p>
            </div>
            
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-4 text-xs text-gray-300">
              <Link
                href="/privacy-policy"
                className="font-medium underline decoration-gray-500 underline-offset-4 transition hover:text-cmyk-cyan hover:decoration-cmyk-cyan"
              >
                Privacy Policy (GDPR)
              </Link>
              <Link
                href="/cookie-policy"
                className="font-medium underline decoration-gray-500 underline-offset-4 transition hover:text-cmyk-cyan hover:decoration-cmyk-cyan"
              >
                Cookie Policy
              </Link>
              <button
                type="button"
                onClick={reopenCookieSettings}
                className="text-left font-medium text-cmyk-yellow underline decoration-cmyk-yellow/50 underline-offset-4 transition hover:text-white"
              >
                Preferenze Cookie
              </button>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar with CMYK Dots */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-gray-400 sm:flex-row">
          <p>© 2026 Nuova Tipolitografia Resta S.n.c. Tutti i diritti riservati. P.IVA 04759440722. Bari, Italia.</p>
          
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-cmyk-cyan" title="Cyan" />
            <span className="h-3 w-3 rounded-full bg-cmyk-magenta" title="Magenta" />
            <span className="h-3 w-3 rounded-full bg-cmyk-yellow" title="Yellow" />
            <span className="h-3 w-3 rounded-full bg-white" title="Key (White on dark)" />
          </div>
        </div>

      </div>
    </footer>
  );
}
