"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, Printer } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "Chi Siamo", href: "#chi-siamo" },
    { label: "Servizi", href: "#servizi" },
    { label: "Lavori Recenti", href: "#portfolio" },
    { label: "Contatti", href: "#contatti" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cmyk-key/20 bg-paper-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Logo Brand */}
        <Link href="#hero" className="flex items-center gap-3 transition hover:opacity-90">
          <div className="relative h-12 w-28 sm:h-14 sm:w-36 md:h-16 md:w-44">
            <Image
              src="/assets/logo-resta.jpg"
              alt="Nuova Tipolitografia Resta"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold tracking-wide text-cmyk-key transition hover:text-cmyk-magenta"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="#preventivo"
            className="inline-flex items-center gap-2 border border-cmyk-key bg-cmyk-cyan px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-hard-sm transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-cmyk-yellow hover:shadow-hard active:translate-x-0 active:translate-y-0"
          >
            <Printer className="h-4 w-4" />
            <span>Richiedi Preventivo</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center border border-cmyk-key bg-paper-cream text-cmyk-key shadow-hard-sm transition md:hidden"
          aria-label="Apri menu di navigazione"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-cmyk-key/20 bg-paper-white px-6 py-6 md:hidden">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-cmyk-key transition hover:text-cmyk-magenta"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="#preventivo"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 border border-cmyk-key bg-cmyk-cyan py-3 text-xs font-bold uppercase tracking-wider text-black shadow-hard-sm"
              >
                <Printer className="h-4 w-4" />
                <span>Richiedi Preventivo Online</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
