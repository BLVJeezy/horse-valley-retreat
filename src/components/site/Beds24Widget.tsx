import { useEffect, useId, useRef } from "react";

// jQuery + jQueryUI zijn vereist door bookWidget.min.js (zie Beds24-documentatie).
// We laden alle scripts één keer, ongeacht hoe vaak dit component gemount wordt.
const JQUERY_SRC = "https://code.jquery.com/jquery-3.7.1.min.js";
const JQUERY_UI_SRC = "https://code.jquery.com/ui/1.13.2/jquery-ui.min.js";
const BEDS24_WIDGET_SRC = "https://media.xmlcal.com/widget/1.01/js/bookWidget.min.js";

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
 * Embed van de Beds24 "Booking Box" widget voor Horsey Vally (propid 348364).
 * Toont live beschikbaarheid + prijzen uit Beds24 en stuurt de boeking rechtstreeks
 * naar Beds24 (die op zijn beurt Airbnb/Booking.com blokkeert en de betaling via
 * de gekoppelde Stripe-gateway afhandelt).
 */
export function Beds24Widget({ propId = 348364 }: { propId?: number }) {
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
