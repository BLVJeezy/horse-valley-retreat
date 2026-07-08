import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { BookingWidget } from "@/components/site/BookingWidget";
import { photos } from "@/lib/photos";

export const Route = createFileRoute("/")({
  component: Home,
});

const highlights = [
  { label: "Capaciteit", value: "8 gasten, 4 slaapkamers" },
  { label: "Voor de kids", value: "Trampoline in de tuin" },
  { label: "Ontspanning", value: "Overdekte buitenlounge" },
  { label: "Locatie", value: "Vlakbij Tongeren" },
  { label: "Comfort", value: "Gratis privé parking" },
  { label: "Keuken", value: "Volledig uitgerust" },
];

const included = [
  "Volledig uitgeruste keuken",
  "Wifi",
  "Televisie",
  "Wasmachine",
  "Buiteneethoek met barbecue",
  "Gratis parkeren op eigen terrein",
  "Rookmelder, brandblusser en EHBO-doos",
];

const notIncluded = ["Airconditioning", "Droogkast", "Geen beveiligingscamera's buiten"];

const nearby = [
  {
    title: "Tongeren, oudste stad van België",
    body: "Slenter door de Romeinse muren en de antiekmarkt op zondagochtend. Op een boogscheut van het huis.",
  },
  {
    title: "Fietsen door Haspengouw",
    body: "Klik in bij het knooppuntennetwerk en rijd tussen de fruitbomen. In het voorjaar staat het roze en wit.",
  },
  {
    title: "Wandelen in Borgloon",
    body: "De doorkijkkerk 'Reading between the Lines' en het glooiende landschap eromheen. Rustig, weids, mooi.",
  },
];

function Home() {
  return (
    <div className="bg-background text-foreground">
      <Nav mode="dark" />

      {/* Hero */}
      <section id="woning" className="relative h-[100svh] w-full flex items-end pb-12 md:pb-16 px-4 md:px-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={photos.exterior.url}
            alt={photos.exterior.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto animate-fade-up">
          <span className="block text-white/80 text-[11px] uppercase tracking-[0.3em] mb-4">
            Tongeren-Borgloon · Belgisch Limburg
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-8 text-balance leading-[0.95] max-w-4xl">
            Puur genieten in Tongeren-Borgloon
          </h1>
          <div className="animate-fade-up-delay">
            <BookingWidget />
          </div>
        </div>
      </section>

      {/* Host Intro */}
      <section className="py-24 md:py-32 px-6 max-w-3xl mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <div className="size-16 rounded-full bg-accent/10 grid place-items-center font-display italic text-accent text-2xl">
            L
          </div>
        </div>
        <p className="font-display text-2xl md:text-4xl leading-snug text-balance italic">
          "We bouwden dit huis met een simpel idee. Kom binnen, doe je jas uit, en vergeet even wat er
          op de kalender staat. De kinderen op de trampoline, jullie met een glas wijn onder de pergola."
        </p>
        <span className="block mt-8 text-[11px] text-muted-foreground uppercase tracking-[0.25em]">
          — LESLIE, UW GASTVROUW / GASTHEER
        </span>
      </section>

      {/* Gallery Mosaic */}
      <section className="px-4 md:px-12 pb-20 md:pb-28">
        <div className="grid grid-cols-12 gap-3 md:gap-4 h-[520px] md:h-[720px]">
          <Link to="/galerij" className="col-span-12 md:col-span-8 h-full overflow-hidden rounded-2xl group">
            <img
              src={photos.dining.url}
              alt={photos.dining.alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </Link>
          <div className="col-span-12 md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4 h-full">
            <Link to="/galerij" className="overflow-hidden rounded-2xl group">
              <img
                src={photos.loungeCovered.url}
                alt={photos.loungeCovered.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </Link>
            <Link to="/galerij" className="overflow-hidden rounded-2xl group">
              <img
                src={photos.gardenTrampoline.url}
                alt={photos.gardenTrampoline.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </Link>
          </div>
        </div>
        <div className="mt-10 md:mt-14 flex justify-center">
          <Link
            to="/galerij"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-foreground text-background text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-foreground/90 transition-colors"
          >
            Bekijk alle foto's
            <span aria-hidden className="text-base leading-none">→</span>
          </Link>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-accent/5 py-20 md:py-24 mt-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-y-10 md:gap-y-12 gap-x-8">
          {highlights.map((h) => (
            <div key={h.label} className="space-y-2">
              <span className="text-accent text-[10px] font-medium uppercase tracking-[0.25em]">
                {h.label}
              </span>
              <p className="font-display text-xl md:text-2xl leading-tight">{h.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Amenities & Trust */}
      <section className="py-24 md:py-28 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 md:gap-20">
        <div>
          <h2 className="font-display text-3xl md:text-4xl mb-10">Eerlijk over ons huis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-foreground/40">
                Wel aanwezig
              </span>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                {included.map((i) => (
                  <li key={i}>· {i}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-foreground/40">
                Niet aanwezig
              </span>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                {notIncluded.map((i) => (
                  <li key={i}>· {i}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white ring-1 ring-black/5 p-8 md:p-10 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-[10px] uppercase tracking-[0.25em] font-bold rounded-full mb-6">
              Nieuw op de markt
            </span>
            <h3 className="font-display text-2xl md:text-3xl mb-4">Boeken zonder reviews?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Horse Vally is pas net open. Er staan dus nog geen sterren op de teller. Wat er wel is:
              een gloednieuw huis, een verzorgde tuin, en een host die tijd maakt voor je vragen. Eerste
              gasten krijgen bovendien een introductiekorting.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="size-10 rounded-full bg-accent/15 grid place-items-center font-display italic text-accent">
              L
            </div>
            <span className="text-xs text-muted-foreground italic">Leslie · gastvrouw</span>
          </div>
        </div>
      </section>

      {/* Omgeving */}
      <section id="omgeving" className="py-24 md:py-28 bg-accent/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <span className="text-accent text-[10px] font-medium uppercase tracking-[0.25em]">
              De omgeving
            </span>
            <h2 className="font-display text-3xl md:text-4xl mt-3">
              Velden, fietspaden en de oudste stad van België
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {nearby.map((n) => (
              <div key={n.title} className="space-y-3">
                <h3 className="font-display text-xl">{n.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{n.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 aspect-[21/9] rounded-2xl bg-white ring-1 ring-border grid place-items-center text-center px-6">
            <div className="space-y-2">
              <span className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Locatie
              </span>
              <p className="font-display text-2xl md:text-3xl">Tongeren-Borgloon, Limburg</p>
              <p className="text-xs text-muted-foreground max-w-md">
                Het exacte adres delen we in de bevestigingsmail na je boeking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Huisregels */}
      <section className="py-24 md:py-28 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <span className="text-accent text-[10px] font-medium uppercase tracking-[0.25em]">
              Praktisch
            </span>
            <h2 className="font-display text-3xl md:text-4xl mt-3 mb-8">Huisregels</h2>
            <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <li>· Check-in vanaf 15:00</li>
              <li>· Maximum 8 gasten</li>
              <li>· Geen feesten of luide muziek na 22:00</li>
              <li>· Roken alleen buiten</li>
            </ul>
          </div>
          <div>
            <span className="text-accent text-[10px] font-medium uppercase tracking-[0.25em]">
              Annuleren
            </span>
            <h2 className="font-display text-3xl md:text-4xl mt-3 mb-8">Rustig geregeld</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Gratis annuleren tot 24 uur voor je aankomst — je krijgt dan het volledige bedrag terug.
              Annuleer je later, dan is terugbetaling niet meer mogelijk.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 md:py-28 bg-foreground text-background">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-accent text-[10px] font-medium uppercase tracking-[0.25em]">
            Vraag stellen
          </span>
          <h2 className="font-display text-3xl md:text-5xl mt-3 mb-6">
            Iets specifieks weten voor je boekt?
          </h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Stuur Leslie een berichtje. Meestal antwoord binnen een paar uur — zeker als het over de
            beschikbaarheid van een specifieke datum gaat.
          </p>
          <a
            href="mailto:hallo@horsevally.be"
            className="inline-block mt-10 bg-background text-foreground px-8 py-4 rounded-lg text-sm font-medium hover:bg-white transition-colors"
          >
            hallo@horsevally.be
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
