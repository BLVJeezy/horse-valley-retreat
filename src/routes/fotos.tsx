import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import {
  horseVallyPhotos,
  horseVallyCategories,
  type HousePhoto,
} from "@/lib/photos-horse-valley";

export const Route = createFileRoute("/fotos")({
  head: () => ({
    meta: [
      { title: "Fotogalerij — Horse Vally & Klein Lauw" },
      {
        name: "description",
        content:
          "Alle foto's van onze vakantiewoningen in Tongeren-Borgloon, per woning gesorteerd: Horse Vally (binnen, buiten, slaapkamers, badkamers) en Klein Lauw.",
      },
      { property: "og:title", content: "Fotogalerij — Horse Vally & Klein Lauw" },
      {
        property: "og:description",
        content: "Bekijk per woning alle foto's: Horse Vally en Klein Lauw in Tongeren-Borgloon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FotosPage,
});

function FotosPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav mode="light" />

      <header className="pt-28 md:pt-32 pb-10 px-6 max-w-6xl mx-auto">
        <span className="text-accent text-[10px] font-medium uppercase tracking-[0.25em]">
          Fotogalerij
        </span>
        <h1 className="font-display text-4xl md:text-6xl mt-3 mb-4 text-balance">
          Twee woningen, in beeld
        </h1>
        <p className="text-muted-foreground max-w-xl text-sm md:text-base leading-relaxed">
          Alle beelden zijn eigen foto's — geen stock. Elke woning heeft haar eigen blok, zodat
          duidelijk is welke foto bij welk huis hoort.
        </p>
      </header>

      <HouseSection
        title="Horse Vally"
        subtitle="Vakantiewoning · Tongeren-Borgloon · 4 sterren"
        photos={horseVallyPhotos}
        categories={[...horseVallyCategories]}
      />

      <section className="px-6 max-w-6xl mx-auto pb-24">
        <div className="border-t border-black/10 pt-16">
          <span className="text-accent text-[10px] font-medium uppercase tracking-[0.25em]">
            Woning 2
          </span>
          <h2 className="font-display text-3xl md:text-4xl mt-3 mb-3">Klein Lauw</h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
            De foto's van Klein Lauw volgen binnenkort. Zodra ze doorgestuurd zijn, verschijnen ze
            hier in een eigen blok met dezelfde indeling.
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl bg-muted/60 border border-black/5 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
              >
                Binnenkort
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function HouseSection({
  title,
  subtitle,
  photos,
  categories,
}: {
  title: string;
  subtitle: string;
  photos: HousePhoto[];
  categories: string[];
}) {
  const [active, setActive] = useState<string>("Alle");
  const [lightbox, setLightbox] = useState<HousePhoto | null>(null);

  const filtered = useMemo(
    () => (active === "Alle" ? photos : photos.filter((p) => p.category === active)),
    [active, photos]
  );

  return (
    <section className="px-6 max-w-6xl mx-auto pb-20">
      <div className="border-t border-black/10 pt-16">
        <span className="text-accent text-[10px] font-medium uppercase tracking-[0.25em]">
          Woning 1
        </span>
        <div className="flex flex-wrap items-end justify-between gap-4 mt-3 mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
            <p className="text-muted-foreground text-xs uppercase tracking-[0.18em] mt-2">
              {subtitle}
            </p>
          </div>
          <p className="text-muted-foreground text-xs">{photos.length} foto's</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {["Alle", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.18em] border transition-colors ${
                active === c
                  ? "bg-foreground text-background border-foreground"
                  : "border-black/15 text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {filtered.map((p, i) => (
            <button
              key={p.url}
              type="button"
              onClick={() => setLightbox(p)}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-muted"
            >
              <img
                src={p.url}
                alt={p.alt}
                loading={i < 6 ? "eager" : "lazy"}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
              />
              <span className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/55 text-white text-[9px] uppercase tracking-[0.16em]">
                {title} · {p.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Sluiten"
            className="absolute top-5 right-5 text-white/80 hover:text-white"
            onClick={() => setLightbox(null)}
          >
            <X size={26} />
          </button>
          <figure className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.url}
              alt={lightbox.alt}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <figcaption className="text-white/70 text-[10px] uppercase tracking-[0.2em] mt-4 text-center">
              {title} · {lightbox.category}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
