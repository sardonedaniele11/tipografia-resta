"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, MessageCircle, ExternalLink, X, Instagram, RefreshCw } from "lucide-react";

interface BeholdPost {
  id: string;
  caption?: string;
  prunedCaption?: string;
  permalink?: string;
  timestamp?: string;
  likeCount?: number;
  commentsCount?: number;
  mediaType?: string;
  mediaUrl?: string;
  sizes?: {
    small?: { mediaUrl: string };
    medium?: { mediaUrl: string };
    large?: { mediaUrl: string };
    full?: { mediaUrl: string };
  };
}

interface PostItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  likes: number;
  comments: number;
  permalink: string;
  isLive?: boolean;
}

export default function InstagramFeed() {
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [livePosts, setLivePosts] = useState<PostItem[]>([]);
  const [profileStats, setProfileStats] = useState({
    username: "tipografiaresta",
    followers: "417",
    following: "404",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Post di fallback con le foto reali locali
  const fallbackPosts: PostItem[] = [
    {
      id: "fb-1",
      src: "/assets/portfolio-cappellino.jpg",
      alt: "Cappellino personalizzato Eventi Esclusivi",
      title: "Stampa su Indumenti - Cappellino 'Eventi Esclusivi'",
      caption: "Personalizzazione di abbigliamento ed accessori promozionali.",
      likes: 156,
      comments: 18,
      permalink: "https://www.instagram.com/tipografiaresta/",
    },
    {
      id: "fb-2",
      src: "/assets/portfolio-vetrina-cars.jpg",
      alt: "Vetrofania e insegna Old Cars Club Bari",
      title: "Vetrofanie & Insegne - Old Cars Club",
      caption: "Allestimento vetrine e grafica adesiva per attività e club a Bari.",
      likes: 192,
      comments: 25,
      permalink: "https://www.instagram.com/tipografiaresta/",
    },
    {
      id: "fb-3",
      src: "/assets/portfolio-inviti-nastro.jpg",
      alt: "Inviti coordinati con nastro in organza",
      title: "Partecipazioni & Inviti Nuziali con nastro",
      caption: "Coordinati nozze raffinati con carte pregiate e rifiniture artigianali.",
      likes: 204,
      comments: 19,
      permalink: "https://www.instagram.com/tipografiaresta/",
    },
    {
      id: "fb-4",
      src: "/assets/portfolio-sabbiatura-vetri.jpg",
      alt: "Sabbiatura vetri decorativa prima e dopo",
      title: "Sabbiatura Vetri Uffici - Prima & Dopo",
      caption: "Pellicole satinate decorative per privacy ed eleganza negli uffici.",
      likes: 184,
      comments: 22,
      permalink: "https://www.instagram.com/tipografiaresta/",
    },
    {
      id: "fb-5",
      src: "/assets/portfolio-mezcla-legno.jpg",
      alt: "Logo Mezcla Monopoli stampato su legno",
      title: "Stampa UV su Legno - Logo Mezcla Monopoli",
      caption: "Stampa diretta UV su supporti rigidi in legno naturale.",
      likes: 178,
      comments: 16,
      permalink: "https://www.instagram.com/tipografiaresta/",
    },
    {
      id: "fb-6",
      src: "/assets/portfolio-allestimento-fiere.jpg",
      alt: "Allestimento fiere stand sposi",
      title: "Allestimento Stand & Banner Fieristici",
      caption: "Stampa grande formato e allestimento stand per fiere ed eventi.",
      likes: 165,
      comments: 14,
      permalink: "https://www.instagram.com/tipografiaresta/",
    },
    {
      id: "fb-7",
      src: "/assets/portfolio-insegna.jpg",
      alt: "Insegna ingresso ICASA",
      title: "Insegna Ingresso Grande Formato - ICASA",
      caption: "Insegne e pannelli istituzionali resistenti agli agenti atmosferici.",
      likes: 124,
      comments: 8,
      permalink: "https://www.instagram.com/tipografiaresta/",
    },
    {
      id: "fb-8",
      src: "/assets/portfolio-satori-legno.jpg",
      alt: "Grafica SATORI stampata su pannello di legno",
      title: "Stampa Artistica su Pannello in Legno - Satori",
      caption: "Dettaglio di precisione per stampe artistiche su legno.",
      likes: 132,
      comments: 11,
      permalink: "https://www.instagram.com/tipografiaresta/",
    },
    {
      id: "fb-9",
      src: "/assets/portfolio-businesscards.jpg",
      alt: "Biglietti da visita lamina oro",
      title: "Biglietti da Visita Nobilitati in Lamina Oro",
      caption: "Nobilitazione con lamina metallizzata a caldo su cartoncino nero.",
      likes: 98,
      comments: 6,
      permalink: "https://www.instagram.com/tipografiaresta/",
    },
    {
      id: "fb-10",
      src: "/assets/portfolio-targa.jpg",
      alt: "Targa istituzionale su muro",
      title: "Targa Istituzionale Alluminio / Plexiglass",
      caption: "Targhe professionali per studi medici, legali e uffici.",
      likes: 105,
      comments: 5,
      permalink: "https://www.instagram.com/tipografiaresta/",
    },
    {
      id: "fb-11",
      src: "/assets/portfolio-rollup.jpg",
      alt: "Rollup informativo autoportante",
      title: "Roll-up Espositivo e Banner Pubblicitario",
      caption: "Espositori roll-up avvolgibili per eventi e fiere aziendali.",
      likes: 94,
      comments: 3,
      permalink: "https://www.instagram.com/tipografiaresta/",
    },
    {
      id: "fb-12",
      src: "/assets/portfolio-stampa-visione.jpg",
      alt: "Stampa che ti porta oltre, Stampiamo la tua visione",
      title: "In Evidenza: Stampa che ti porta oltre",
      caption: "Stampiamo la tua visione. Idee, stampa e impatto a Bari.",
      likes: 245,
      comments: 31,
      permalink: "https://www.instagram.com/tipografiaresta/",
    },
  ];

  // Caricamento in tempo reale del Feed da Behold.so
  useEffect(() => {
    async function fetchInstagramFeed() {
      try {
        const response = await fetch("https://feeds.behold.so/MrBIspQ1YMnuJrA6uHdg");
        if (!response.ok) throw new Error("Errore nel caricamento del feed");

        const data = await response.json();

        if (data && data.posts && Array.isArray(data.posts)) {
          // Aggiorna le statistiche del profilo in tempo reale
          setProfileStats({
            username: data.username || "tipografiaresta",
            followers: data.followersCount ? `${data.followersCount}` : "417",
            following: data.followsCount ? `${data.followsCount}` : "404",
          });

          // Mappa i post live da Instagram
          const formattedLivePosts: PostItem[] = data.posts.map((post: BeholdPost) => {
            const firstLine = post.prunedCaption?.split("\n")[0] || post.caption?.split("\n")[0] || "Nuovo lavoro Tipografia Resta";
            const imageUrl = post.sizes?.large?.mediaUrl || post.sizes?.medium?.mediaUrl || post.mediaUrl || "";

            return {
              id: post.id,
              src: imageUrl,
              alt: firstLine,
              title: firstLine,
              caption: post.prunedCaption || post.caption || "",
              likes: post.likeCount || 0,
              comments: post.commentsCount || 0,
              permalink: post.permalink || "https://www.instagram.com/tipografiaresta/",
              isLive: true,
            };
          });

          // Se i post live sono meno di 12, completa la griglia con i migliori lavori d'archivio
          if (formattedLivePosts.length < 12) {
            const remainingCount = 12 - formattedLivePosts.length;
            const combined = [...formattedLivePosts, ...fallbackPosts.slice(0, remainingCount)];
            setLivePosts(combined);
          } else {
            setLivePosts(formattedLivePosts.slice(0, 12));
          }
        }
      } catch (error) {
        console.warn("Utilizzo post locali di fallback:", error);
        setLivePosts(fallbackPosts);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInstagramFeed();
  }, []);

  const displayPosts = livePosts.length > 0 ? livePosts : fallbackPosts;

  return (
    <section id="portfolio" className="border-b border-cmyk-key/10 bg-paper-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 border border-cmyk-key/30 bg-paper-cream px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-cmyk-magenta">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#25d366]" />
            <span>LIVE SYNC // RIMANI SEMPRE AGGIORNATO</span>
          </div>
          <h2 className="mt-3 font-serif text-3xl font-extrabold text-cmyk-key sm:text-4xl md:text-5xl">
            Lavori Recenti su Instagram
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-cmyk-key/75">
            Rimani sempre aggiornato sulle nostre ultime realizzazioni di stampa, allestimenti e grafica a Bari seguendo il nostro canale ufficiale.
          </p>
        </div>

        {/* Instagram Profile Simulator Card */}
        <div className="mx-auto mt-10 max-w-3xl border border-cmyk-key bg-paper-white p-6 shadow-hard sm:p-8">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
            {/* Avatar with Gradient border */}
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-2 border-cmyk-magenta bg-white p-1">
              <div className="relative h-full w-full overflow-hidden rounded-full">
                <Image
                  src="/assets/logo-square.jpg"
                  alt="Nuova Tipolitografia Resta"
                  fill
                  className="object-contain bg-white p-1"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                <h3 className="text-xl font-bold text-cmyk-key">@{profileStats.username}</h3>
                <a
                  href="https://www.instagram.com/tipografiaresta/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded bg-[#0095f6] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#1877f2]"
                >
                  <Instagram className="h-3.5 w-3.5" />
                  <span>Segui</span>
                </a>
              </div>

              {/* Stats */}
              <div className="mt-4 flex justify-center gap-6 text-xs text-cmyk-key sm:justify-start sm:text-sm">
                <span><strong>148+</strong> post</span>
                <span><strong>{profileStats.followers}</strong> follower</span>
                <span><strong>{profileStats.following}</strong> seguiti</span>
              </div>

              {/* Bio */}
              <div className="mt-3 text-xs leading-relaxed text-cmyk-key/80 sm:text-sm">
                <p className="font-bold text-black">Nuova Tipolitografia Resta</p>
                <p>Stampa offset, digitale e commerciale a Bari. L'arte della carta e dell'inchiostro. 🖨️✨</p>
                <a
                  href="https://www.instagram.com/tipografiaresta/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block font-semibold text-[#00376b] hover:underline"
                >
                  instagram.com/{profileStats.username}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 12-Post Live Instagram Grid */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {displayPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group relative aspect-square cursor-pointer overflow-hidden border border-cmyk-key bg-paper-cream shadow-hard-sm transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard"
            >
              <img
                src={post.src}
                alt={post.alt}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />

              {/* Live Badge for real Instagram posts */}
              {post.isLive && (
                <div className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm">
                  <Instagram className="h-3.5 w-3.5 text-cmyk-magenta" />
                </div>
              )}

              {/* Hover overlay with likes/comments */}
              <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/65 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Heart className="h-4 w-4 fill-white text-white" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <MessageCircle className="h-4 w-4 fill-white text-white" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <a
            href="https://www.instagram.com/tipografiaresta/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-cmyk-key bg-paper-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-cmyk-key shadow-hard transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-cmyk-cyan active:translate-x-0 active:translate-y-0"
          >
            <Instagram className="h-4 w-4 text-cmyk-magenta" />
            <span>Apri il Profilo Instagram Ufficiale</span>
            <ExternalLink className="h-3.5 w-3.5 text-cmyk-key/60" />
          </a>
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPost && (
        <div
          onClick={() => setSelectedPost(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative mx-auto flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden border border-paper-white bg-paper-white shadow-2xl md:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-square w-full bg-black md:w-3/5">
              <img
                src={selectedPost.src}
                alt={selectedPost.alt}
                className="h-full w-full object-contain"
              />
            </div>

            {/* Modal Details */}
            <div className="flex flex-1 flex-col justify-between overflow-y-auto border-t border-cmyk-key/10 p-6 md:border-l md:border-t-0">
              <div>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border border-cmyk-magenta bg-white p-0.5">
                    <Image src="/assets/logo-square.jpg" alt="Logo" fill className="object-contain" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-cmyk-key">tipografiaresta</h4>
                    <p className="text-[11px] text-gray-500">Bari, Italia</p>
                  </div>
                </div>

                <div className="mt-4 max-h-48 overflow-y-auto pr-1">
                  <p className="whitespace-pre-line text-xs leading-relaxed text-cmyk-key/85">
                    {selectedPost.caption || selectedPost.title}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-cmyk-key/15 pt-4">
                <div className="flex items-center justify-between text-xs text-cmyk-key">
                  <span className="font-semibold">{selectedPost.likes} "Mi piace"</span>
                  <a
                    href={selectedPost.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#0095f6] hover:underline"
                  >
                    <span>Vedi post su Instagram</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
