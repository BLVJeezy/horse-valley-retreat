import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export function PropertyComingSoon({ name }: { name: string }) {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Nav mode="light" />
      <div className="flex-1 grid place-items-center px-6 text-center py-32">
        <div>
          <span className="text-accent text-[10px] font-medium uppercase tracking-[0.25em]">
            Binnenkort
          </span>
          <h1 className="font-display text-4xl md:text-6xl mt-3 mb-4">{name}</h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base leading-relaxed">
            Deze woning is nog niet beschikbaar om te boeken. Kom binnenkort terug.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
