import React from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink, Navigation } from "lucide-react";

export default function Contacts() {
  return (
    <section id="contatti" className="border-b border-cmyk-key/10 bg-paper-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Left Contacts Details */}
          <div className="lg:col-span-6">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-cmyk-magenta">
              // DOVE SIAMO & CONTATTI
            </span>
            <h2 className="mt-2 font-serif text-3xl font-extrabold text-cmyk-key sm:text-4xl md:text-5xl">
              Vieni a Trovarci in Tipografia
            </h2>
            <p className="mt-4 text-base leading-relaxed text-cmyk-key/80">
              Il profumo della carta e dell'inchiostro ti aspetta. Vieni a toccare con mano i nostri campioni e a definire insieme ogni dettaglio della tua stampa.
            </p>

            <div className="mt-8 space-y-6">
              
              {/* Indirizzo */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-cmyk-key bg-paper-cream text-cmyk-key shadow-hard-sm">
                  <MapPin className="h-5 w-5 text-cmyk-magenta" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-cmyk-key">Indirizzo</h4>
                  <p className="text-sm text-cmyk-key/80">Via Michele Garruba 68, 70122 Bari (BA)</p>
                </div>
              </div>

              {/* Telefono */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-cmyk-key bg-paper-cream text-cmyk-key shadow-hard-sm">
                  <Phone className="h-5 w-5 text-cmyk-cyan" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-cmyk-key">Telefono</h4>
                  <p className="text-sm">
                    <a href="tel:0805212367" className="font-semibold text-cmyk-key hover:text-cmyk-magenta hover:underline">
                      080 521 2367
                    </a>
                  </p>
                </div>
              </div>

              {/* WhatsApp Card (Anchor target for homepage link) */}
              <div id="contacts-whatsapp" className="flex items-start gap-4 scroll-mt-28">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-cmyk-key bg-[#25d366]/10 text-[#25d366] shadow-hard-sm">
                  <MessageCircle className="h-5 w-5 fill-[#25d366] text-[#25d366]" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-cmyk-key">WhatsApp Rapido</h4>
                  <p className="text-sm text-cmyk-key/80">
                    Scansiona il QR Code o{" "}
                    <a
                      href="https://wa.me/390805212367"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#25d366] underline hover:text-[#128c7e]"
                    >
                      clicca qui per chattare
                    </a>
                    .
                  </p>
                  
                  {/* QR Code Graphic */}
                  <div className="mt-3 inline-block border border-cmyk-key bg-paper-white p-2 shadow-hard-sm">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https%3A%2F%2Fwa.me%2F390805212367"
                      alt="QR Code WhatsApp Tipografia Resta"
                      className="h-28 w-28"
                    />
                  </div>
                </div>
              </div>

              {/* Email & PEC */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-cmyk-key bg-paper-cream text-cmyk-key shadow-hard-sm">
                  <Mail className="h-5 w-5 text-cmyk-yellow" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-cmyk-key">Email & PEC</h4>
                  <p className="text-sm text-cmyk-key/80">
                    Email:{" "}
                    <a href="mailto:tipografiaresta@gmail.com" className="font-semibold text-cmyk-key hover:text-cmyk-magenta hover:underline">
                      tipografiaresta@gmail.com
                    </a>
                  </p>
                  <p className="text-sm text-cmyk-key/80">
                    PEC:{" "}
                    <a href="mailto:Tipografiaresta@pec.it" className="font-semibold text-cmyk-key hover:text-cmyk-magenta hover:underline">
                      Tipografiaresta@pec.it
                    </a>
                  </p>
                </div>
              </div>

              {/* Orari */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-cmyk-key bg-paper-cream text-cmyk-key shadow-hard-sm">
                  <Clock className="h-5 w-5 text-cmyk-key" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-cmyk-key">Orari di Apertura</h4>
                  <p className="text-xs text-cmyk-key/80 sm:text-sm">
                    Lunedì – Venerdì: 08:30 - 13:00 | 15:30 - 19:00 <br />
                    Sabato: 09:00 - 12:30 | Domenica: Chiuso
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Map Component */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden border border-cmyk-key bg-[#1e1e1e] p-6 text-paper-white shadow-hard-lg">
              
              {/* Map Graphic View */}
              <div className="relative h-[260px] w-full border border-white/20 bg-[#121212] sm:h-[320px]">
                {/* Simulated Street Grid */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
                
                {/* Street Lines */}
                <div className="absolute left-0 top-1/2 h-4 w-full -translate-y-1/2 bg-gray-700/40" />
                <div className="absolute left-1/3 top-0 h-full w-4 bg-gray-700/40" />
                <div className="absolute right-1/4 top-0 h-full w-3 bg-gray-700/30" />

                {/* Street Names */}
                <span className="absolute left-4 top-1/2 -translate-y-6 font-mono text-[10px] uppercase tracking-wider text-gray-400">
                  Via Michele Garruba
                </span>
                <span className="absolute right-8 top-1/4 font-mono text-[10px] uppercase tracking-wider text-gray-400">
                  Corso Cavour
                </span>

                {/* Center Map Pin */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="relative mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 border-cmyk-magenta bg-cmyk-magenta text-white shadow-lg animate-bounce">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="mt-1.5 whitespace-nowrap rounded border border-cmyk-magenta bg-black/90 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                    Tipografia Resta
                  </div>
                </div>
              </div>

              {/* Navigation Link */}
              <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="text-xs text-gray-300">
                  <p className="font-bold text-white">Facile da raggiungere nel centro di Bari</p>
                  <p className="text-[11px] text-gray-400">A pochi passi da Università Ateneo e Stazione Centrale</p>
                </div>
                <a
                  href="https://maps.google.com/?q=Via+Michele+Garruba+68+Bari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white bg-cmyk-magenta px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-hard-sm transition hover:bg-cmyk-cyan hover:text-black"
                >
                  <Navigation className="h-4 w-4" />
                  <span>Apri Google Maps</span>
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
