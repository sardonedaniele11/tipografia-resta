import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Nuova Tipolitografia Resta - Bari",
  description:
    "Informativa completa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR) di Nuova Tipolitografia Resta S.n.c. a Bari.",
};

export default function PrivacyPolicyPage() {
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
              <ShieldCheck className="h-4 w-4" />
              <span>REGOLAMENTO UE 2016/679 (GDPR)</span>
            </div>
            <h1 className="mt-3 font-serif text-3xl font-extrabold text-cmyk-key sm:text-4xl md:text-5xl">
              Informativa sul Trattamento dei Dati Personali
            </h1>
            <p className="mt-3 text-sm text-cmyk-key/70">
              Ultimo aggiornamento: <strong>Novembre 2026</strong>
            </p>
          </div>

          {/* Legal Document Content */}
          <div className="mt-8 space-y-8 text-sm leading-relaxed text-cmyk-key/85 sm:text-base">
            
            <section className="rounded border border-cmyk-key/15 bg-paper-cream/30 p-5">
              <p>
                Gentile Utente, in conformità agli articoli 13 e 14 del <strong>Regolamento (UE) 2016/679 (GDPR)</strong> e alla normativa nazionale vigente in materia di protezione dei dati personali (D.Lgs. 196/2003 e s.m.i.), la società <strong>Nuova Tipolitografia Resta S.n.c.</strong>, in qualità di Titolare del trattamento, La informa su come vengono raccolti, utilizzati, conservati e protetti i Suoi dati personali attraverso il presente sito web (<strong>tipografiaresta.com</strong>).
              </p>
            </section>

            {/* 1. Titolare del Trattamento */}
            <section>
              <h2 className="font-serif text-xl font-bold text-cmyk-key sm:text-2xl">
                1. Titolare del Trattamento
              </h2>
              <div className="mt-3 space-y-1 rounded border border-cmyk-key bg-paper-white p-4 text-sm shadow-hard-sm">
                <p><strong>Ragione Sociale:</strong> Nuova Tipolitografia Resta S.n.c. di Sardone Giuseppe e Claudio</p>
                <p><strong>Sede Legale e Operativa:</strong> Via Michele Garruba 68, 70122 Bari (BA), Italia</p>
                <p><strong>Partita IVA & Codice Fiscale:</strong> 04759440722</p>
                <p><strong>Iscrizione REA:</strong> BA-335716</p>
                <p><strong>Email di contatto:</strong> <a href="mailto:tipografiaresta@gmail.com" className="font-semibold text-cmyk-magenta underline">tipografiaresta@gmail.com</a></p>
                <p><strong>Posta Elettronica Certificata (PEC):</strong> <a href="mailto:Tipografiaresta@pec.it" className="font-semibold text-cmyk-magenta underline">Tipografiaresta@pec.it</a></p>
                <p><strong>Telefono:</strong> 080 5212367</p>
              </div>
            </section>

            {/* 2. Categorie di Dati Personali Trattati */}
            <section>
              <h2 className="font-serif text-xl font-bold text-cmyk-key sm:text-2xl">
                2. Categorie di Dati Personali Trattati
              </h2>
              <p className="mt-2">
                Durante l'utilizzo di questo sito web, il Titolare può raccogliere e trattare le seguenti categorie di dati:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-2">
                <li>
                  <strong>Dati forniti volontariamente dall'utente:</strong> nome, cognome, ragione sociale o nome dell'azienda, indirizzo email, recapito telefonico, dettagli specifici sul lavoro di stampa richiesto (quantità, formato, tipo di carta, nobilitazione) e gli eventuali file o bozze grafiche allegati tramite il preventivatore online o inviati via email/WhatsApp.
                </li>
                <li>
                  <strong>Dati di navigazione e tecnici:</strong> indirizzi IP, identificativi tecnici di sessione, browser utilizzato, data e orario della richiesta, parametri relativi al sistema operativo impiegato dall'utente. Tali dati vengono acquisiti automaticamente dai sistemi informatici per il corretto funzionamento delle trasmissioni via Internet e per motivi di sicurezza informatica.
                </li>
              </ul>
            </section>

            {/* 3. Finalità del Trattamento e Basi Giuridiche */}
            <section>
              <h2 className="font-serif text-xl font-bold text-cmyk-key sm:text-2xl">
                3. Finalità del Trattamento e Basi Giuridiche
              </h2>
              <div className="mt-4 space-y-4">
                <div className="border-l-4 border-cmyk-cyan pl-4">
                  <h3 className="font-bold text-cmyk-key">A. Gestione delle richieste di preventivo e contatti precontrattuali</h3>
                  <p className="mt-1 text-xs text-cmyk-key/80 sm:text-sm">
                    <strong>Finalità:</strong> Rispondere alle richieste formulate dall'utente tramite il form online, calcolare la quotazione economica ed esaminare la fattibilità tecnica dei file di stampa inviati.<br />
                    <strong>Base Giuridica:</strong> Esecuzione di misure precontrattuali o contrattuali adottate su richiesta dell'interessato (art. 6, par. 1, lett. b GDPR). Il conferimento dei dati è facoltativo ma necessario per ricevere il preventivo.
                  </p>
                </div>

                <div className="border-l-4 border-cmyk-magenta pl-4">
                  <h3 className="font-bold text-cmyk-key">B. Adempimento di obblighi di legge, contabili e fiscali</h3>
                  <p className="mt-1 text-xs text-cmyk-key/80 sm:text-sm">
                    <strong>Finalità:</strong> Adempiere a obblighi previsti dalla legge, da regolamenti o dalla normativa comunitaria (es. fatturazione, contabilità e adempimenti tributari in caso di conferma dell'ordine).<br />
                    <strong>Base Giuridica:</strong> Adempimento di un obbligo legale al quale è soggetto il Titolare del trattamento (art. 6, par. 1, lett. c GDPR).
                  </p>
                </div>

                <div className="border-l-4 border-cmyk-yellow pl-4">
                  <h3 className="font-bold text-cmyk-key">C. Sicurezza informatica e prevenzione di abusi/antispam</h3>
                  <p className="mt-1 text-xs text-cmyk-key/80 sm:text-sm">
                    <strong>Finalità:</strong> Garantire la sicurezza delle reti e delle informazioni, prevenire attacchi informatici e bloccare tentativi di spam o intrusioni dannose.<br />
                    <strong>Base Giuridica:</strong> Legittimo interesse del Titolare a tutelare i propri sistemi e garantire il corretto funzionamento del sito (art. 6, par. 1, lett. f GDPR).
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Modalità di Trattamento e Misure di Sicurezza */}
            <section>
              <h2 className="font-serif text-xl font-bold text-cmyk-key sm:text-2xl">
                4. Modalità di Trattamento e Sicurezza dei Dati
              </h2>
              <p className="mt-2">
                Il trattamento dei dati personali è effettuato mediante strumenti informatici, telematici e manuali, con logiche strettamente correlate alle finalità indicate e con modalità atte a garantire la sicurezza, l'integrità e la riservatezza dei dati stessi.
              </p>
              <p className="mt-2">
                Il sito adotta connessioni crittografate con certificato <strong>SSL/TLS (HTTPS)</strong> per proteggere la trasmissione dei dati e prevenire intercettazioni o accessi non autorizzati da parte di terzi.
              </p>
            </section>

            {/* 5. Destinatari e Comunicazione dei Dati */}
            <section>
              <h2 className="font-serif text-xl font-bold text-cmyk-key sm:text-2xl">
                5. Destinatari e Trasferimento dei Dati
              </h2>
              <p className="mt-2">
                I dati raccolti non sono mai venduti, ceduti né diffusi a terzi a scopo commerciale. Possono essere trattati esclusivamente da:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Personale autorizzato e debitamente istruito di Nuova Tipolitografia Resta;</li>
                <li>Fornitori di servizi tecnici e informatici operanti come Responsabili del trattamento (es. fornitore di hosting Vercel Inc., gestori del servizio di posta elettronica SMTP);</li>
                <li>Consulenti contabili, legali o fiscali e autorità pubbliche qualora richiesto per adempiere a un obbligo di legge.</li>
              </ul>
            </section>

            {/* 6. Periodo di Conservazione dei Dati */}
            <section>
              <h2 className="font-serif text-xl font-bold text-cmyk-key sm:text-2xl">
                6. Periodo di Conservazione dei Dati
              </h2>
              <p className="mt-2">
                I dati personali saranno conservati per il tempo strettamente necessario a conseguire gli scopi per cui sono stati raccolti:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li><strong>Richieste di preventivo non seguite da ordine:</strong> i dati e i file allegati vengono conservati per un periodo massimo di 12 mesi per consentire eventuali riscontri o richiami, trascorsi i quali vengono cancellati;</li>
                <li><strong>Ordini confermati e documenti fiscali:</strong> i dati anagrafici e di fatturazione vengono conservati per 10 anni in conformità a quanto prescritto dall'art. 2220 del Codice Civile e dalla disciplina fiscale.</li>
              </ul>
            </section>

            {/* 7. Diritti dell'Interessato (Artt. 15-22 GDPR) */}
            <section>
              <h2 className="font-serif text-xl font-bold text-cmyk-key sm:text-2xl">
                7. Diritti dell'Interessato (Artt. 15-22 GDPR)
              </h2>
              <p className="mt-2">
                In qualità di interessato, il GDPR Le garantisce l'esercizio dei seguenti diritti:
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="border border-cmyk-key/20 bg-paper-white p-3 shadow-sm">
                  <strong>Accesso (art. 15):</strong> conferma dell'esistenza di dati personali che La riguardano e copia degli stessi.
                </div>
                <div className="border border-cmyk-key/20 bg-paper-white p-3 shadow-sm">
                  <strong>Rettifica (art. 16):</strong> aggiornamento o correzione dei dati inesatti o incompleti.
                </div>
                <div className="border border-cmyk-key/20 bg-paper-white p-3 shadow-sm">
                  <strong>Cancellazione / Oblio (art. 17):</strong> cancellazione dei dati non più necessari o trattati illecitamente.
                </div>
                <div className="border border-cmyk-key/20 bg-paper-white p-3 shadow-sm">
                  <strong>Limitazione (art. 18):</strong> contrassegno dei dati per limitarne il futuro trattamento in specifici casi.
                </div>
                <div className="border border-cmyk-key/20 bg-paper-white p-3 shadow-sm">
                  <strong>Portabilità (art. 20):</strong> ricezione dei dati in formato strutturato, di uso comune e leggibile da dispositivo automatico.
                </div>
                <div className="border border-cmyk-key/20 bg-paper-white p-3 shadow-sm">
                  <strong>Opposizione (art. 21):</strong> opposizione in qualsiasi momento al trattamento per motivi connessi alla Sua situazione particolare.
                </div>
              </div>
            </section>

            {/* 8. Come Esercitare i Diritti */}
            <section className="border border-cmyk-key bg-paper-cream/60 p-6 shadow-hard">
              <h2 className="font-serif text-xl font-bold text-cmyk-key">
                8. Come Esercitare i Propri Diritti
              </h2>
              <p className="mt-2">
                Per esercitare uno qualsiasi dei diritti sopra descritti o per qualsiasi richiesta di chiarimento sul trattamento dei Suoi dati personali, può rivolgersi gratuitamente al Titolare del trattamento scrivendo a:
              </p>
              <div className="mt-4 flex flex-col gap-2 font-mono text-xs sm:text-sm">
                <p>📧 Email: <a href="mailto:tipografiaresta@gmail.com" className="font-bold underline">tipografiaresta@gmail.com</a></p>
                <p>📬 PEC: <a href="mailto:Tipografiaresta@pec.it" className="font-bold underline">Tipografiaresta@pec.it</a></p>
                <p>📍 Posta ordinaria: Nuova Tipolitografia Resta S.n.c., Via Michele Garruba 68, 70122 Bari (BA)</p>
              </div>
              <p className="mt-4 text-xs text-cmyk-key/80">
                Qualora ritenga che il trattamento violi le disposizioni del GDPR, ha inoltre il diritto di proporre reclamo all'<strong>Autorità Garante per la Protezione dei Dati Personali</strong> (Piazza Venezia n. 11, 00187 Roma - <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="font-bold underline">www.garanteprivacy.it</a>).
              </p>
            </section>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
