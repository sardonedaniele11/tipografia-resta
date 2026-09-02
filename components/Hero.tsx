import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden border-b border-cmyk-key/10 bg-paper-white py-12 md:py-20">
      {/* Decorative Technical Grid overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7">
            {/* Technical Badge */}
            <div className="mb-6 inline-flex items-center gap-3 border border-cmyk-key/30 bg-paper-cream px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-cmyk-key">
              <span className="font-bold text-cmyk-magenta">BARI</span>
              <span className="h-3 w-px bg-cmyk-key/30" />
              <span>STAMPA OFFSET & DIGITALE</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl font-black leading-tight text-cmyk-key sm:text-5xl md:text-6xl">
              Nuova Tipolitografia <br />
              <span className="font-serif italic font-normal text-cmyk-magenta">Resta a Bari</span>
            </h1>

            {/* Custom Description with WhatsApp Link */}
            <p className="mt-6 text-base leading-relaxed text-cmyk-key/85 sm:text-lg">
              <strong className="text-black">Eccellenza nella stampa a tutto tondo.</strong>
              <br className="hidden sm:inline" />
              {" "}Non solo carta! Realizziamo stampa offset e digitale, abbigliamento e magliette personalizzate, vetrofanie per negozi e adesivi pubblicitari per auto e furgoni. Dai valore alla tua comunicazione aziendale con soluzioni su misura e materiali di alta qualità. Scrivici su{" "}
              <Link
                href="#contacts-whatsapp"
                className="font-bold text-[#25d366] underline decoration-2 underline-offset-4 transition hover:text-[#128c7e]"
              >
                WhatsApp
              </Link>
              {" "}o richiedi un preventivo gratuito!
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="#servizi"
                className="inline-flex items-center gap-2 border border-cmyk-key bg-cmyk-key px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-paper-white shadow-hard transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-cmyk-magenta hover:shadow-hard-magenta active:translate-x-0 active:translate-y-0"
              >
                <span>Scopri i Servizi</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#preventivo"
                className="inline-flex items-center gap-2 border border-cmyk-key bg-cmyk-yellow px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-hard transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-cmyk-cyan hover:shadow-hard-cyan active:translate-x-0 active:translate-y-0"
              >
                <span>Preventivo Online</span>
              </Link>
            </div>

            {/* CMYK Color Bars Graphic */}
            <div className="mt-10 flex h-2.5 max-w-xs gap-1">
              <div className="h-full flex-1 bg-cmyk-cyan" title="Cyan" />
              <div className="h-full flex-1 bg-cmyk-magenta" title="Magenta" />
              <div className="h-full flex-1 bg-cmyk-yellow" title="Yellow" />
              <div className="h-full flex-1 bg-cmyk-key" title="Key (Black)" />
            </div>
          </div>

          {/* Right Hero Visual / Registration Proof Frame */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md border border-cmyk-key bg-paper-white p-4 shadow-hard-lg sm:p-6">
              
              {/* Rotating Registration Mark in background */}
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 opacity-20 [animation:spin_25s_linear_infinite]">
                <svg viewBox="0 0 100 100" className="h-full w-full text-cmyk-key" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="50" cy="50" r="35" />
                  <line x1="10" y1="50" x2="90" y2="50" />
                  <line x1="50" y1="10" x2="50" y2="90" />
                  <circle cx="50" cy="50" r="18" strokeDasharray="3 3" />
                  <circle cx="50" cy="50" r="6" fill="currentColor" />
                </svg>
              </div>

              {/* Real Logo Banner Photo */}
              <div className="group relative overflow-hidden border border-cmyk-key bg-paper-white p-2 shadow-hard-sm transition hover:scale-[1.01]">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src="/assets/logo-completo.jpg"
                    alt="Nuova Tipolitografia Resta - Elaborazioni grafiche e stampati di ogni genere"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Technical Caption underneath */}
              <div className="mt-4 flex items-center justify-between border-t border-cmyk-key/20 pt-3 text-[11px] font-mono text-cmyk-key/70">
                <span>STAMPA & COMUNICAZIONE</span>
                <span className="font-bold text-cmyk-magenta">BARI</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
