"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Cookie, Settings, CheckCircle2 } from "lucide-react";

export default function CookiePolicyPage() {
  const triggerCookieSettings = () => {
    window.dispatchEvent(new Event("reopen-cookie-banner"));
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper-white text-cmyk-key">
      <Header />

      <main className="flex-1 py-12 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* Back link */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 border border-cmyk-key bg-paper-cream px-4 py-2 text-xs font-bold uppercase tracking-wider text-cmyk-key shadow-hard-sm transition hover:bg-cmyk-yellow"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Torna alla Home</span>
            </Link>
          </div>

          {/* Page Header */}
          <div className="border-b border-cmyk-key/20 pb-8">
            <div className="inline-flex items-center gap-2 border border-cmyk-key/30 bg-paper-cream px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-cmyk-magenta">
              <Cookie className="h-4 w-4" />
              <span>DIRETTIVA EPPRIVACY & LINEE GUIDA GARANTE 2021</span>
            </div>
            <h1 className="mt-3 font-serif text-3xl font-extrabold text-cmyk-key sm:text-4xl md:text-5xl">
              Cookie Policy
            </h1>
            <p className="mt-3 text-sm text-cmyk-key/70">
              Ultimo aggiornamento: <strong>Novembre 2026</strong>
            </p>
          </div>

          {/* Content */}
          <div className="mt-8 space-y-8 text-sm leading-relaxed text-cmyk-key/85 sm:text-base">
            
            <section className="rounded border border-cmyk-key/15 bg-paper-cream/30 p-5">
              <p>
                La presente Cookie Policy descrive le modalità con cui <strong>Nuova Tipolitografia Resta S.n.c.</strong> (P.IVA 04759440722, Via Michele Garruba 68, 70122 Bari) utilizza i cookie e tecnologie similari sul presente sito web in conformità alla Direttiva 2002/58/CE (ePrivacy), al Regolamento (UE) 2016/679 (GDPR) e alle <strong>Linee Guida del Garante per la Protezione dei Dati Personali del 10 giugno 2021</strong>.
              </p>
            </section>

            {/* 1. Cosa sono i Cookie */}
            <section>
              <h2 className="font-serif text-xl font-bold text-cmyk-key sm:text-2xl">
                1. Cosa sono i Cookie
              </h2>
              <p className="mt-2">
                I cookie sono piccoli file di testo che i siti web visitati dall'utente inviano al suo terminale (computer, tablet, smartphone), dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla successiva visita del medesimo utente. I cookie consentono al sito di riconoscere il dispositivo dell'utente, ricordarne le preferenze e garantirne la fruizione sicura ed efficiente.
              </p>
            </section>

            {/* 2. Tipologie di Cookie Utilizzati */}
            <section>
              <h2 className="font-serif text-xl font-bold text-cmyk-key sm:text-2xl">
                2. Tipologie di Cookie Utilizzati da Questo Sito
              </h2>
              <div className="mt-4 space-y-4">
                
                <div className="border border-cmyk-key bg-paper-white p-5 shadow-hard-sm">
                  <div className="flex items-center gap-2 text-cmyk-cyan">
                    <CheckCircle2 className="h-5 w-5" />
                    <h3 className="font-serif text-lg font-bold text-black">A. Cookie Tecnici Strettamente Necessari (Attivi)</h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-cmyk-key/80 sm:text-sm">
                    Sono essenziali per consentire la navigazione del sito e l'utilizzo delle sue funzionalità di base (ad esempio, mantenere sicura la connessione, consentire l'invio del form di preventivo e memorizzare il consenso prestato sul banner cookie). Ai sensi dell'art. 122 del Codice Privacy e delle Linee Guida del Garante, per l'installazione di tali cookie <strong>non è richiesto il preventivo consenso dell'utente</strong>.
                  </p>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-cmyk-key/20 font-mono text-[11px] uppercase">
                          <th className="py-1.5 pr-4">Nome</th>
                          <th className="py-1.5 pr-4">Fornitore</th>
                          <th className="py-1.5 pr-4">Finalità</th>
                          <th className="py-1.5">Scadenza</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cmyk-key/10">
                        <tr>
                          <td className="py-2 pr-4 font-mono font-bold">tipografia_resta_cookie_consent</td>
                          <td className="py-2 pr-4">Prima parte (Locale)</td>
                          <td className="py-2 pr-4">Memorizza la preferenza espressa dall'utente sul banner informativo.</td>
                          <td className="py-2">12 mesi</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border border-cmyk-key bg-paper-white p-5 shadow-hard-sm">
                  <div className="flex items-center gap-2 text-cmyk-magenta">
                    <CheckCircle2 className="h-5 w-5" />
                    <h3 className="font-serif text-lg font-bold text-black">B. Nessun Cookie di Profilazione o Pubblicitario</h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-cmyk-key/80 sm:text-sm">
                    <strong>Il presente sito NON utilizza cookie di profilazione commerciale o di tracciamento comportamentale</strong> per inviare messaggi pubblicitari personalizzati né condivide i dati di navigazione degli utenti con broker pubblicitari.
                  </p>
                </div>

              </div>
            </section>

            {/* 3. Servizi e Risorse di Terze Parti */}
            <section>
              <h2 className="font-serif text-xl font-bold text-cmyk-key sm:text-2xl">
                3. Risorse e Servizi di Terze Parti
              </h2>
              <p className="mt-2">
                Nel nostro sito sono integrati i seguenti elementi tecnici di terze parti:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-2">
                <li>
                  <strong>Visualizzazione Feed Instagram (Behold.so):</strong> il sito mostra anteprime pubbliche dei recenti lavori pubblicati sul canale Instagram ufficiale tramite il servizio Behold.pictures in modalità di sola visualizzazione, senza tracciamento di profilazione.
                </li>
                <li>
                  <strong>Font di sistema e Google Fonts:</strong> i caratteri tipografici sono ospitati e serviti in modo ottimizzato direttamente dall'infrastruttura del sito (Next.js font optimization), senza trasmettere dati degli utenti ai server di terzi.
                </li>
              </ul>
            </section>

            {/* 4. Come gestire i cookie dal Browser */}
            <section>
              <h2 className="font-serif text-xl font-bold text-cmyk-key sm:text-2xl">
                4. Come Gestire o Disabilitare i Cookie tramite Browser
              </h2>
              <p className="mt-2">
                L'utente può comunque gestire le preferenze relative ai cookie direttamente dalle impostazioni del proprio browser internet, impedendone l'installazione o eliminando i cookie già registrati:
              </p>
              <ul className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 sm:text-sm">
                <li className="rounded border border-cmyk-key/15 bg-paper-cream/40 p-2.5">
                  <strong>Google Chrome:</strong> Menu ➔ Impostazioni ➔ Privacy e sicurezza ➔ Cookie e altri dati dei siti.
                </li>
                <li className="rounded border border-cmyk-key/15 bg-paper-cream/40 p-2.5">
                  <strong>Mozilla Firefox:</strong> Menu ➔ Impostazioni ➔ Privacy e sicurezza ➔ Cookie e dati dei siti web.
                </li>
                <li className="rounded border border-cmyk-key/15 bg-paper-cream/40 p-2.5">
                  <strong>Apple Safari:</strong> Preferenze ➔ Privacy ➔ Blocca tutti i cookie.
                </li>
                <li className="rounded border border-cmyk-key/15 bg-paper-cream/40 p-2.5">
                  <strong>Microsoft Edge:</strong> Impostazioni ➔ Cookie e autorizzazioni sito ➔ Gestisci ed elimina cookie.
                </li>
              </ul>
            </section>

            {/* 5. Modifica delle preferenze sul sito */}
            <section className="border border-cmyk-key bg-paper-cream/60 p-6 shadow-hard">
              <h2 className="font-serif text-xl font-bold text-cmyk-key">
                5. Modifica delle Preferenze sul Sito
              </h2>
              <p className="mt-2 text-xs sm:text-sm">
                Puoi rivedere o modificare la tua scelta sul banner informativo in qualsiasi momento cliccando sul pulsante qui sotto:
              </p>
              <div className="mt-4">
                <button
                  onClick={triggerCookieSettings}
                  className="inline-flex items-center gap-2 border border-cmyk-key bg-cmyk-yellow px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-hard-sm transition hover:bg-cmyk-cyan"
                >
                  <Settings className="h-4 w-4" />
                  <span>Riapri Preferenze Cookie</span>
                </button>
              </div>
            </section>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
