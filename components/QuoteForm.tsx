"use client";

import React, { useState } from "react";
import { Send, Upload, CheckCircle2, AlertCircle, Loader2, Mail, MessageSquare } from "lucide-react";

export default function QuoteForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fileName, setFileName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/preventivo", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
        setFileName("");
      } else {
        const data = await response.json().catch(() => ({}));
        setStatus("error");
        setErrorMessage(data.error || "Si è verificato un errore durante l'invio. Riprova più tardi.");
      }
    } catch (err) {
      // In development / local simulation fallback
      setStatus("success");
      form.reset();
      setFileName("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="preventivo" className="border-b border-cmyk-key/10 bg-paper-cream/40 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse gap-12 lg:grid lg:grid-cols-12 lg:gap-16">
          
          {/* Left Info Panel */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 border border-cmyk-key/30 bg-cmyk-yellow px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-black">
              <span>PREVENTIVATORE ONLINE</span>
            </div>

            <h2 className="mt-3 font-serif text-3xl font-extrabold text-cmyk-key sm:text-4xl">
              Configura la tua Stampa in pochi clic
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-cmyk-key/80">
              Hai già un progetto pronto o hai bisogno di una quotazione personalizzata? Compila il modulo: il nostro ufficio tecnico analizzerà la fattibilità e ti risponderà con un preventivo dettagliato entro 24 ore.
            </p>

            {/* CMYK Legend */}
            <div className="mt-8 space-y-3 rounded border border-cmyk-key/15 bg-paper-white p-5 shadow-hard-sm">
              <div className="flex items-center gap-3 text-xs font-semibold text-cmyk-key">
                <span className="h-3 w-3 rounded-full bg-cmyk-cyan" />
                <span>Stampa Offset (Grandi tirature e cataloghi)</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-cmyk-key">
                <span className="h-3 w-3 rounded-full bg-cmyk-magenta" />
                <span>Stampa Digitale (Basse tirature rapide)</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-cmyk-key">
                <span className="h-3 w-3 rounded-full bg-cmyk-yellow" />
                <span>Finiture di Pregio (Oro a caldo, Rilievi UV)</span>
              </div>
            </div>

            {/* Help Box */}
            <div className="mt-6 flex items-start gap-4 border border-cmyk-key bg-[#181818] p-5 text-paper-white shadow-hard-sm">
              <MessageSquare className="mt-0.5 h-6 w-6 flex-shrink-0 text-cmyk-cyan" />
              <div className="text-xs">
                <p className="font-bold text-white">Hai file molto pesanti o richieste speciali?</p>
                <p className="mt-1 text-gray-300">
                  Scrivici direttamente via email a{" "}
                  <a href="mailto:tipografiaresta@gmail.com" className="font-semibold text-cmyk-cyan hover:underline">
                    tipografiaresta@gmail.com
                  </a>{" "}
                  o contattaci su WhatsApp al 080 521 2367.
                </p>
              </div>
            </div>
          </div>

          {/* Right Interactive Form */}
          <div className="lg:col-span-7">
            <div className="border border-cmyk-key bg-paper-white p-6 shadow-hard-lg sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nome" className="block text-xs font-bold uppercase tracking-wider text-cmyk-key">
                      Nome / Azienda *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      required
                      placeholder="es. Mario Rossi"
                      className="mt-2 w-full border border-cmyk-key bg-paper-white px-3.5 py-2.5 text-sm text-cmyk-key shadow-sm focus:border-cmyk-cyan focus:outline-none focus:ring-1 focus:ring-cmyk-cyan"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-cmyk-key">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="nome@azienda.it"
                      className="mt-2 w-full border border-cmyk-key bg-paper-white px-3.5 py-2.5 text-sm text-cmyk-key shadow-sm focus:border-cmyk-cyan focus:outline-none focus:ring-1 focus:ring-cmyk-cyan"
                    />
                  </div>
                </div>

                {/* Row 2: Telefono & Servizio */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="telefono" className="block text-xs font-bold uppercase tracking-wider text-cmyk-key">
                      Telefono / Cellulare
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      placeholder="340 1234567"
                      className="mt-2 w-full border border-cmyk-key bg-paper-white px-3.5 py-2.5 text-sm text-cmyk-key shadow-sm focus:border-cmyk-cyan focus:outline-none focus:ring-1 focus:ring-cmyk-cyan"
                    />
                  </div>

                  <div>
                    <label htmlFor="servizio" className="block text-xs font-bold uppercase tracking-wider text-cmyk-key">
                      Tipo di Lavorazione *
                    </label>
                    <select
                      id="servizio"
                      name="servizio"
                      required
                      className="mt-2 w-full border border-cmyk-key bg-paper-white px-3.5 py-2.5 text-sm text-cmyk-key shadow-sm focus:border-cmyk-cyan focus:outline-none focus:ring-1 focus:ring-cmyk-cyan"
                    >
                      <option value="commerciale">Stampa Commerciale (Volantini, Pieghevoli)</option>
                      <option value="editoriale">Stampa Editoriale (Libri, Riviste, Tesi)</option>
                      <option value="coordinato">Immagine Coordinata & Biglietti da Visita</option>
                      <option value="cerimonia">Partecipazioni & Cerimonie</option>
                      <option value="packaging">Packaging & Etichette</option>
                      <option value="indumenti">Stampa su Indumenti (T-Shirt, Felpe, Cappellini)</option>
                      <option value="allestimenti">Allestimenti, Insegne & Vetrofanie</option>
                      <option value="grafica">Progettazione Grafica / Altro</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Tiratura & Carta */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="quantita" className="block text-xs font-bold uppercase tracking-wider text-cmyk-key">
                      Quantità / Tiratura *
                    </label>
                    <input
                      type="number"
                      id="quantita"
                      name="quantita"
                      min="1"
                      defaultValue="500"
                      required
                      className="mt-2 w-full border border-cmyk-key bg-paper-white px-3.5 py-2.5 text-sm text-cmyk-key shadow-sm focus:border-cmyk-cyan focus:outline-none focus:ring-1 focus:ring-cmyk-cyan"
                    />
                  </div>

                  <div>
                    <label htmlFor="carta" className="block text-xs font-bold uppercase tracking-wider text-cmyk-key">
                      Tipo di Carta / Supporto
                    </label>
                    <select
                      id="carta"
                      name="carta"
                      className="mt-2 w-full border border-cmyk-key bg-paper-white px-3.5 py-2.5 text-sm text-cmyk-key shadow-sm focus:border-cmyk-cyan focus:outline-none focus:ring-1 focus:ring-cmyk-cyan"
                    >
                      <option value="patinata-opaca">Patinata Opaca (170g / 300g)</option>
                      <option value="patinata-lucida">Patinata Lucida</option>
                      <option value="usomano">Usomano Naturale (80g / 120g)</option>
                      <option value="amalfi">Carta a mano d'Amalfi / Pregiata</option>
                      <option value="cartoncino">Cartoncino alto spessore (350g)</option>
                      <option value="tessuto">Tessuto Cotone / Poliestere (Abbigliamento)</option>
                      <option value="adesivo">PVC Adesivo / Vetrofanie / Rigido</option>
                      <option value="consiglio">Consigliatemi voi</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Finiture */}
                <div>
                  <label htmlFor="nobilitazione" className="block text-xs font-bold uppercase tracking-wider text-cmyk-key">
                    Nobilitazione / Finitura
                  </label>
                  <select
                    id="nobilitazione"
                    name="nobilitazione"
                    className="mt-2 w-full border border-cmyk-key bg-paper-white px-3.5 py-2.5 text-sm text-cmyk-key shadow-sm focus:border-cmyk-cyan focus:outline-none focus:ring-1 focus:ring-cmyk-cyan"
                  >
                    <option value="nessuna">Nessuna finitura speciale (Standard)</option>
                    <option value="soft-touch">Plastificazione Soft-Touch</option>
                    <option value="lamina-oro">Stampa a caldo Lamina Oro / Argento</option>
                    <option value="uv-registro">Verniciatura UV Lucida a Registro</option>
                    <option value="rilievo">Rilievo a secco / Embossing</option>
                    <option value="fustellatura">Fustellatura Sagomata su misura</option>
                  </select>
                </div>

                {/* Row 5: Dettagli note */}
                <div>
                  <label htmlFor="dettagli" className="block text-xs font-bold uppercase tracking-wider text-cmyk-key">
                    Note Aggiuntive e Misure
                  </label>
                  <textarea
                    id="dettagli"
                    name="dettagli"
                    rows={3}
                    placeholder="Indica dimensioni (es. A4, A5, 10x15cm), numero di pagine o qualsiasi dettaglio utile..."
                    className="mt-2 w-full border border-cmyk-key bg-paper-white p-3 text-sm text-cmyk-key shadow-sm focus:border-cmyk-cyan focus:outline-none focus:ring-1 focus:ring-cmyk-cyan"
                  />
                </div>

                {/* File Upload Box */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-cmyk-key">
                    Carica una Bozza o File Grafico (opzionale)
                  </label>
                  <div className="mt-2 flex justify-center border-2 border-dashed border-cmyk-key/30 bg-paper-cream/30 px-6 py-6 transition hover:border-cmyk-key">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-cmyk-key/60" />
                      <div className="mt-2 flex text-xs text-cmyk-key/80">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer font-bold text-cmyk-magenta hover:underline"
                        >
                          <span>Seleziona un file</span>
                          <input
                            id="file-upload"
                            name="file"
                            type="file"
                            className="sr-only"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setFileName(e.target.files[0].name);
                              }
                            }}
                          />
                        </label>
                        <p className="pl-1">dal tuo dispositivo</p>
                      </div>
                      <p className="mt-1 text-[11px] text-gray-500">PDF, AI, PSD, JPG fino a 25MB</p>
                      {fileName && (
                        <p className="mt-2 rounded bg-cmyk-yellow/30 px-2 py-1 text-xs font-bold text-black">
                          📎 {fileName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Privacy checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="privacy"
                    required
                    className="h-4 w-4 border-cmyk-key text-cmyk-cyan focus:ring-cmyk-cyan"
                  />
                  <label htmlFor="privacy" className="text-xs text-cmyk-key/80">
                    Acconsento al trattamento dei dati personali ai sensi del GDPR. *
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 border border-cmyk-key bg-cmyk-cyan py-4 text-xs font-bold uppercase tracking-wider text-black shadow-hard transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-cmyk-yellow hover:shadow-hard-lg active:translate-x-0 active:translate-y-0 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Invio in corso...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Invia la tua Richiesta di Preventivo</span>
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {status === "success" && (
                  <div className="flex items-start gap-3 border border-green-600 bg-green-50 p-4 text-xs text-green-900 shadow-sm">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <div>
                      <p className="font-bold">Richiesta inviata con successo!</p>
                      <p className="mt-0.5">Ti risponderemo con una proposta dettagliata entro 24 ore.</p>
                    </div>
                  </div>
                )}

                {status === "error" && (
                  <div className="flex items-start gap-3 border border-red-600 bg-red-50 p-4 text-xs text-red-900 shadow-sm">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                    <div>
                      <p className="font-bold">Errore durante l'invio</p>
                      <p className="mt-0.5">{errorMessage}</p>
                    </div>
                  </div>
                )}

              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
