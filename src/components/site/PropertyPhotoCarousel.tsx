import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { horseVallyPhotos } from "@/lib/photos-horse-valley";
import { kleinLauwPhotos } from "@/lib/photos-klein-lauw";
import { openBookingModal } from "@/lib/bookingModal";
import type { Beds24PropertyKey } from "@/components/site/Beds24Widget";
import type { Photo } from "@/lib/photos";

function photosFor(slug: string): Photo[] {
  if (slug === "klein-lauw") return kleinLauwPhotos;
  return horseVallyPhotos;
}

function SingleCarousel({ photos, label }: { photos: Photo[]; label: string }) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {photos.slice(0, 12).map((photo, i) => (
          <CarouselItem key={i}>
            <img
              src={photo.url}
              alt={photo.alt}
              className="w-full aspect-[4/3] object-cover rounded-2xl"
              loading="lazy"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious aria-label={`Vorige foto — ${label}`} className="left-3" />
      <CarouselNext aria-label={`Volgende foto — ${label}`} className="right-3" />
    </Carousel>
  );
}

/**
 * Toont een fotocarrousel van de momenteel gekozen woning (uit de BookingWidget-
 * selector erboven) met daaronder een "Boek [naam]"-knop die de globale
 * boekingsmodal opent. Vervangt de vroegere directe weergave van de Beds24-widget.
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
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 text-center">
              Horsey Vally
            </p>
            <SingleCarousel photos={horseVallyPhotos} label="Horsey Vally" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 text-center">
              Klein Lauw
            </p>
            <SingleCarousel photos={kleinLauwPhotos} label="Klein Lauw" />
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <SingleCarousel photos={photosFor(slug)} label={label ?? slug} />
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
