import React from "react";
import { BookOpen, Cpu, Palette } from "lucide-react";

export default function InfoBanner() {
  const items = [
    {
      icon: BookOpen,
      title: "Tradizione Artigiana",
      description:
        "La cura del dettaglio tipografico, la scelta di carte pregiate e la legatoria artigianale tramandata con passione.",
      color: "text-cmyk-cyan",
    },
    {
      icon: Cpu,
      title: "Tecnologia Digitale",
      description:
        "Stampa digitale e offset di altissima qualità per piccole e grandi tirature, abbigliamento e materiali rigidi.",
      color: "text-cmyk-magenta",
    },
    {
      icon: Palette,
      title: "Grafica & Consulenza",
      description:
        "Dalla progettazione grafica e bozze all'impaginazione professionale. Diamo forma alle tue idee prima di stampare.",
      color: "text-cmyk-yellow",
    },
  ];

  return (
    <section className="border-b border-cmyk-key bg-[#181818] py-10 text-paper-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-4">
                <div className={`mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center border border-white/20 bg-black ${item.color} shadow-hard-sm`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-paper-white">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-400">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
