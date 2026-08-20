import { useState } from "react";
import { X, Expand } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { horseVallyPhotos, horseVallyCategories } from "@/lib/photos-horse-valley";
import { kleinLauwPhotos, kleinLauwCategories } from "@/lib/photos-klein-lauw";
import { dronePhotos } from "@/lib/photos-drone";
import { openBookingModal } from "@/lib/bookingModal";
import type { Beds24PropertyKey } from "@/components/site/Beds24Widget";
import type { Photo } from "@/lib/photos";

function Lightbox({
  photo,
  label,
  onClose,
}: {
  photo: { url: string; alt: string };
  label: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Sluiten"
        className="absolute top-5 right-5 text-white/80 hover:text-white"
        onClick={onClose}
      >
        <X size={26} />
      </button>
      <figure className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.url}
          alt={photo.alt}
          className="w-full max-h-[80vh] object-contain rounded-xl"
        />
        <figcaption className="text-white/70 text-[10px] uppercase tracking-[0.2em] mt-4 text-center">
          {label}
        </figcaption>
      </figure>
    </div>
  );
}


function photosFor(slug: string): Photo[] {
  if (slug === "klein-lauw") return kleinLauwPhotos;
  return horseVallyPhotos;
}

function categoriesFor(slug: string): readonly string[] {
  if (slug === "klein-lauw") return kleinLauwCategories;
  return horseVallyCategories;
}

function CategoryFilter({
  categories,
  active,
  onChange,
}: {
  categories: readonly string[];
  active: string;
  onChange: (category: string) => void;
}) {
  const options = ["Alle", ...categories];
  return (
    <div className="flex flex-wrap justify-center gap-1.5 mb-4">
      {options.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              isActive
                ? "bg-accent text-background border-accent"
                : "bg-transparent text-foreground/70 border-foreground/15 hover:bg-black/[0.03]"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

function SingleCarousel({ photos, label }: { photos: { url: string; alt: string }[]; label: string }) {
  const [lightbox, setLightbox] = useState<{ url: string; alt: string } | null>(null);

  return (
    <>
      <Carousel className="w-full" opts={{ align: "start" }}>
        <CarouselContent className="-ml-3">
          {photos.slice(0, 15).map((photo, i) => (
            <CarouselItem key={i} className="pl-3 basis-1/2 sm:basis-1/3 lg:basis-1/3">
              <button
                type="button"
                onClick={() => setLightbox(photo)}
                className="group relative block w-full overflow-hidden rounded-2xl bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={`Open ${photo.alt}`}
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100 scale-90 group-hover:scale-100">
                    <Expand size={16} strokeWidth={2.5} />
                  </span>
                </span>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious aria-label={`Vorige foto's — ${label}`} className="left-1 sm:-left-4" />
        <CarouselNext aria-label={`Volgende foto's — ${label}`} className="right-1 sm:-right-4" />
      </Carousel>

      {lightbox && (
        <Lightbox photo={lightbox} label={label} onClose={() => setLightbox(null)} />
      )}
    </>
  );
}

function PropertyCarouselWithFilter({ slug, label }: { slug: string; label: string }) {
  const [category, setCategory] = useState("Alle");
  const categories = categoriesFor(slug);
  const allPhotos = photosFor(slug);
  const filtered = category === "Alle" ? allPhotos : allPhotos.filter((p) => p.category === category);

  return (
    <div>
      <CategoryFilter categories={categories} active={category} onChange={setCategory} />
      <SingleCarousel key={category} photos={filtered} label={label} />
    </div>
  );
}

/**
 * Toont een fotocarrousel (3 foto's tegelijk op desktop) met categoriefilter
 * (Buiten & tuin, Woonkamer, Keuken & eetkamer, ...) van de momenteel gekozen
 * woning, met daaronder een "Boek [naam]"-knop die de globale boekingsmodal opent.
 */
export function PropertyPhotoCarousel({
  slug,
  label,
}: {
  slug: string;
  label?: string;
}) {
  const isBoth = slug === "beide";

  return (
    <div className="w-full">
      {isBoth ? (
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 text-center">
            Dronefoto's
          </p>
          <SingleCarousel photos={dronePhotos} label="Drone" />
        </div>
      ) : (
        <div className="mb-8">
          <PropertyCarouselWithFilter slug={slug} label={label ?? slug} />
        </div>
      )}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => openBookingModal(slug as Beds24PropertyKey)}
          className="inline-flex items-center justify-center bg-foreground text-background px-8 py-3.5 rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          Boek {label ?? slug}
        </button>
      </div>
    </div>
  );
}

