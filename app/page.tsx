import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InfoBanner from "@/components/InfoBanner";
import About from "@/components/About";
import Services from "@/components/Services";
import InstagramFeed from "@/components/InstagramFeed";
import QuoteForm from "@/components/QuoteForm";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      <InfoBanner />
      <About />
      <Services />
      <InstagramFeed />
      <QuoteForm />
      <Contacts />
      <Footer />
    </main>
  );
}
