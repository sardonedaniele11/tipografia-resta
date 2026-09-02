import React from "react";
import {
  BookOpen,
  FileText,
  CreditCard,
  Heart,
  Package,
  PenTool,
  Shirt,
  Store,
  CheckCircle2,
} from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: BookOpen,
      title: "Stampa Editoriale",
      description:
        "Libri d'arte, cataloghi aziendali, monografie, riviste e rilegatura tesi di laurea con copertine rigide, brossura fresata o cucita a filo refe.",
      features: [
        "Brossura cucita filo refe e fresata",
        "Copertine nobilitate e plastificate",
        "Campionari di carte editoriali",
      ],
      color: "bg-cmyk-cyan",
    },
    {
      icon: FileText,
      title: "Stampa Commerciale",
      description:
        "Volantini, pieghevoli, depliant, opuscoli, calendari da parete/tavolo e menù per la ristorazione con verniciatura protettiva.",
      features: [
        "Formati standard e fustellature sagomate",
        "Stampa ad altissima risoluzione",
        "Consegne rapide a Bari e provincia",
      ],
      color: "bg-cmyk-magenta",
    },
    {
      icon: CreditCard,
      title: "Immagine Coordinata",
      description:
        "Biglietti da visita di pregio, carta intestata, buste da lettera personalizzate, cartelline portadocumenti e blocchi per appunti.",
      features: [
        "Stampa a caldo in oro e argento",
        "Rilievi a secco e verniciatura UV",
        "Carte speciali martellate e vergate",
      ],
      color: "bg-cmyk-yellow",
    },
    {
      icon: Heart,
      title: "Partecipazioni & Cerimonie",
      description:
        "Coordinati nuziali completi, partecipazioni in carta a mano d'Amalfi, libretti messa, menu, segnaposto, tableau e sigilli in ceralacca.",
      features: [
        "Carta Amalfi e cotone 100%",
        "Taglio a mano e bordi intonsi",
        "Consulenza calligrafica e bozze",
      ],
      color: "bg-cmyk-cyan",
    },
    {
      icon: Package,
      title: "Packaging & Etichette",
      description:
        "Scatole personalizzate, astucci di cartoncino, shoppers di carta con logo ed etichette adesive in bobina o foglio per olio, vino e conserve.",
      features: [
        "Fustellatura digitale e meccanica",
        "Etichette resistenti a olio e umidità",
        "Piccoli lotti per produttori locali",
      ],
      color: "bg-cmyk-magenta",
    },
    {
      icon: PenTool,
      title: "Progettazione Grafica",
      description:
        "Il nostro reparto creativo si occupa di progettazione grafica, impaginazione, restyling loghi e ottimizzazione dei file per la stampa industriale.",
      features: [
        "Controllo e correzione bozze",
        "Progettazione mockup e prototipi",
        "Verifica tecnica file PDF per stampa",
      ],
      color: "bg-cmyk-yellow",
    },
    {
      icon: Shirt,
      title: "Stampa su Indumenti",
      description:
        "Personalizzazione di abbigliamento promozionale, sportivo e da lavoro. Stampiamo t-shirt, felpe, cappellini e divise con tecniche DTF e serigrafia.",
      features: [
        "Stampa DTF ad alta definizione",
        "Resistenza ai lavaggi garantita",
        "Nessun minimo d'ordine richiesto",
      ],
      color: "bg-cmyk-cyan",
    },
    {
      icon: Store,
      title: "Allestimenti & Insegne",
      description:
        "Comunicazione visiva per negozi e aziende: insegne esterne, targhe in plexiglass/alluminio, sabbiatura vetri e allestimenti completi per fiere ed eventi.",
      features: [
        "Sabbiatura vetri e vetrofanie negozi",
        "Targhe e insegne personalizzate",
        "Allestimento stand per eventi a Bari",
      ],
      color: "bg-cmyk-magenta",
    },
  ];

  return (
    <section id="servizi" className="border-b border-cmyk-key/10 bg-paper-cream/50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-cmyk-magenta">
            // COSA FACCIAMO
          </span>
          <h2 className="mt-2 font-serif text-3xl font-extrabold text-cmyk-key sm:text-4xl md:text-5xl">
            Soluzioni di Stampa Professionali
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-cmyk-key/75">
            Dalla carta tradizionale ai grandi formati e all'abbigliamento personalizzato: copriamo ogni esigenza di stampa per privati, professionisti e aziende.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group flex flex-col justify-between border border-cmyk-key bg-paper-white p-6 shadow-hard transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-lg"
              >
                <div>
                  {/* Service Icon */}
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center border border-cmyk-key ${service.color} text-black shadow-hard-sm`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Service Title */}
                  <h3 className="font-serif text-xl font-bold text-cmyk-key">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-xs leading-relaxed text-cmyk-key/75">
                    {service.description}
                  </p>
                </div>

                {/* Features list */}
                <div className="mt-6 border-t border-cmyk-key/10 pt-4">
                  <ul className="space-y-2">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-[11px] font-medium text-cmyk-key/80">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-cmyk-magenta" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
