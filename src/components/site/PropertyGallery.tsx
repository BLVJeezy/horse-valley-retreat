import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { galleryOrder } from "@/lib/photos";

export interface PropertyGalleryProps {
  name: string;
  mirror?: boolean;
}

export function PropertyGallery({ name, mirror }: PropertyGalleryProps) {
  const flip = mirror ? "[transform:scaleX(-1)]" : "";

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav mode="light" />
      <div className="pt-28 md:pt-32 pb-16 px-6 max-w-6xl mx-auto">
        <span className="text-accent text-[10px] font-medium uppercase tracking-[0.25em]">
          Galerij
        </span>
        <h1 className="font-display text-4xl md:text-6xl mt-3 mb-4 text-balance">
          Een rondleiding, in beeld
        </h1>
        <p className="text-muted-foreground max-w-xl text-sm md:text-base leading-relaxed">
          Alle foto's zijn van {name} — geen stock, geen bewerkte beelden. Enkele ruimtes
          volgen nog zodra Leslie de laatste stylingdetails afwerkt.
        </p>
      </div>

      <div className="px-4 md:px-12 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[280px] md:auto-rows-[360px] gap-3 md:gap-4">
          {galleryOrder.map((p, i) => {
            const wide = i % 5 === 0;
            return (
              <div
                key={p.url}
                className={`overflow-hidden rounded-2xl ${wide ? "md:col-span-2" : ""}`}
              >
                <img
                  src={p.url}
                  alt={p.alt}
                  loading={i < 3 ? "eager" : "lazy"}
                  className={`w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700 ${flip}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
