import { useEffect, useId, useRef, useState } from "react";

// jQuery + jQueryUI zijn vereist door bookWidget.min.js (zie Beds24-documentatie).
// We laden alle scripts één keer, ongeacht hoe vaak dit component gemount wordt.
const JQUERY_SRC = "https://code.jquery.com/jquery-3.7.1.min.js";
const JQUERY_UI_SRC = "https://code.jquery.com/ui/1.13.2/jquery-ui.min.js";
const BEDS24_WIDGET_SRC = "https://media.xmlcal.com/widget/1.01/js/bookWidget.min.js";

// Property ID's zoals aangemaakt in Beds24 (Settings > Properties)
export const BEDS24_PROPERTY_IDS = {
  "horse-vally": 348364,
  "klein-lauw": 348657,
  beide: 348658, // Multi Booking Page (Klein Lauw + Horsey Valley)
} as const;

export type Beds24PropertyKey = keyof typeof BEDS24_PROPERTY_IDS;

const propertyOptions: { key: Beds24PropertyKey; label: string }[] = [
  { key: "horse-vally", label: "Horsey Vally" },
  { key: "klein-lauw", label: "Klein Lauw" },
  { key: "beide", label: "Beide" },
];

function loadScriptOnce(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
      } else {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => reject(new Error(`Kon script niet laden: ${src}`)));
      }
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Kon script niet laden: ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Eén Beds24 "Booking Box" widget voor één specifiek propId. Toont live
 * beschikbaarheid + prijzen en stuurt de volledige boeking (gegevens + betaling)
 * rechtstreeks naar Beds24, dat op zijn beurt Airbnb/Booking.com blokkeert en de
 * betaling via de gekoppelde Stripe-gateway afhandelt.
 */
export function SingleBeds24Widget({ propId }: { propId: number }) {
  const reactId = useId().replace(/[:]/g, "");
  const containerId = `bookWidget-${propId}-${reactId}`;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await loadScriptOnce(JQUERY_SRC);
        await loadScriptOnce(JQUERY_UI_SRC);
        await loadScriptOnce(BEDS24_WIDGET_SRC);
      } catch (err) {
        console.error(err);
        return;
      }
      if (cancelled || !containerRef.current) return;

      // @ts-expect-error -- jQuery wordt globaal geladen door de scripts hierboven
      const jq = window.jQuery;
      if (!jq) return;

      // Voorkom dubbele init als hetzelfde element opnieuw gemount wordt
      containerRef.current.innerHTML = "";

      jq(containerRef.current).bookWidget({
        propid: propId,
        availableColor: "#fdfcfb",
        availableBackgroundColor: "#7a8d80",
        backgroundColor: "#fdfcfb",
        borderColor: "#2c2c2c",
        color: "#2c2c2c",
        buttonBackgroundColor: "#7a8d80",
        buttonColor: "#fdfcfb",
        dateFormat: "dd.mm.y",
        dateSelection: 1,
        defaultNightsAdvance: 2,
        defaultNumAdult: 4,
        formAction: "https://beds24.com/booking.php",
        maxAdult: 8,
        peopleSelection: 2,
        unavailableColor: "#f0efed",
        unavailableBackgroundColor: "#f0efed",
        weekFirstDay: 1,
        widgetLang: "nl",
        widgetType: "BookingBox",
        width: "100%",
      });
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [propId, containerId]);

  return <div ref={containerRef} id={containerId} className="beds24-widget" />;
}

/**
 * Volledige Beds24-boekingswidget met woning-selector (Horsey Vally / Klein Lauw /
 * Beide). Het volledige boekingsproces — gegevens, betaling — loopt via Beds24,
 * niet via de eigen /boeken-pagina.
 */
export function Beds24Widget({
  defaultProperty = "horse-vally",
}: {
  defaultProperty?: Beds24PropertyKey;
}) {
  const [active, setActive] = useState<Beds24PropertyKey>(defaultProperty);
  const propId = BEDS24_PROPERTY_IDS[active];

  return (
    <div className="w-full">
      <div className="flex justify-center gap-2 mb-8">
        {propertyOptions.map((opt) => {
          const isActive = opt.key === active;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => setActive(opt.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors border ${
                isActive
                  ? "bg-accent text-background border-accent"
                  : "bg-transparent text-foreground border-foreground/15 hover:bg-black/[0.03]"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* key forceert een schone remount bij het wisselen van woning */}
      <SingleBeds24Widget key={propId} propId={propId} />
    </div>
  );
}
