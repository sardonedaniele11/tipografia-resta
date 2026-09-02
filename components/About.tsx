import React from "react";
import Image from "next/image";

export default function About() {
  const stats = [
    { number: "10k+", label: "Progetti Stampati" },
    { number: "100%", label: "Qualità Garantita" },
    { number: "Offset", label: "& Digitale" },
  ];

  return (
    <section id="chi-siamo" className="border-b border-cmyk-key/10 bg-paper-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Visual Stack with Real Workshop Photo */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto h-[380px] w-full max-w-[460px] sm:h-[420px]">
              
              {/* Large Main Card (Real Workshop Photo) */}
              <div className="absolute left-0 top-0 h-[280px] w-[82%] border border-cmyk-key bg-paper-white p-2 shadow-hard sm:h-[320px]">
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src="/assets/laboratorio-resta.jpg"
                    alt="Il laboratorio e reparto stampa della Tipografia Resta a Bari"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Small Detail Card */}
              <div className="absolute bottom-0 right-0 h-[200px] w-[58%] border border-cmyk-key bg-paper-white p-2 shadow-hard sm:h-[220px]">
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src="/assets/print-details.jpg"
                    alt="Dettaglio campioni di stampa e inchiostri"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Stamp Badge */}
              <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 -rotate-12 flex-col items-center justify-center rounded-full border-4 border-double border-cmyk-magenta bg-paper-white/95 text-cmyk-magenta shadow-lg backdrop-blur-sm">
                <span className="font-mono text-sm font-black tracking-widest">RESTA</span>
                <span className="text-[9px] font-bold tracking-wider">QUALITÀ</span>
              </div>
            </div>
          </div>

          {/* Text Content & Stats */}
          <div className="lg:col-span-6">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-cmyk-magenta">
              // LA STORIA & LA PASSIONE
            </span>
            <h2 className="mt-2 font-serif text-3xl font-extrabold text-cmyk-key sm:text-4xl md:text-5xl">
              Dove la Carta prende Vita
            </h2>

            <p className="mt-6 text-base leading-relaxed text-cmyk-key/80">
              Situata nel cuore pulsante di <strong>Bari</strong>, la <strong>Nuova Tipolitografia Resta</strong> è un punto di riferimento per l'editoria, la grafica commerciale e la comunicazione visiva. Fondata sulla passione per l'inchiostro e la precisione tipografica, la nostra azienda unisce la cura artigianale alle più moderne tecnologie di stampa digitale e grande formato.
            </p>

            <p className="mt-4 text-base leading-relaxed text-cmyk-key/80">
              Ogni progetto viene seguito con attenzione sartoriale: assistiamo i clienti nella scelta della carta ideale, dei supporti speciali, dell'abbigliamento promozionale e delle finiture di pregio per garantire un prodotto finale di assoluto impatto visivo e tattile.
            </p>

            {/* Stats Row */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-cmyk-key/15 pt-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center sm:text-left">
                  <div className="font-serif text-2xl font-black text-cmyk-key sm:text-3xl lg:text-4xl">
                    {stat.number}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-cmyk-key/60 sm:text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
