import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Courier_Prime } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nuova Tipolitografia Resta - Stampa di Qualità a Bari",
  description:
    "Nuova Tipolitografia Resta a Bari unisce la tradizione della stampa tipografica e offset alle moderne tecnologie digitali. Abbigliamento personalizzato, vetrofanie, libri, cataloghi, partecipazioni ed etichette.",
  keywords: [
    "Tipografia Bari",
    "Stampa Offset Bari",
    "Stampa Digitale",
    "Abbigliamento personalizzato",
    "Vetrofanie Bari",
    "Partecipazioni nozze",
    "Tipolitografia Resta",
  ],
  authors: [{ name: "Nuova Tipolitografia Resta" }],
  openGraph: {
    title: "Nuova Tipolitografia Resta - Stampa a Bari",
    description:
      "Eccellenza nella stampa a tutto tondo. Stampa offset, digitale, abbigliamento, vetrofanie e allestimenti a Bari.",
    type: "website",
    locale: "it_IT",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${playfair.variable} ${plusJakarta.variable} ${courierPrime.variable}`}
    >
      <body className="min-h-screen bg-paper-white text-cmyk-key antialiased selection:bg-cmyk-cyan selection:text-black">
        {/* Decorative Technical Crop Marks */}
        <div className="crop-mark crop-top-left" aria-hidden="true" />
        <div className="crop-mark crop-top-right" aria-hidden="true" />
        <div className="crop-mark crop-bottom-left" aria-hidden="true" />
        <div className="crop-mark crop-bottom-right" aria-hidden="true" />

        {children}
      </body>
    </html>
  );
}
