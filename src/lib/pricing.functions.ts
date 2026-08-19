import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type QuoteSegment = {
  label: string;
  nights: number;
  price_per_night: number;
  subtotal: number;
};

export type Quote = {
  nights: number;
  stayTotal: number;
  avgPerNight: number;
  segments: QuoteSegment[];
  minNights: number;
};

function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

export const getQuote = createServerFn({ method: "GET" })
  .inputValidator((d) =>
    z
      .object({
        slug: z.string(),
        start: z.string(),
        end: z.string(),
      })
      .parse(d),
  )
  .handler(async ({ data }): Promise<Quote> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const slugs = data.slug === "beide" ? ["horse-vally", "klein-lauw"] : [data.slug];

    const [{ data: props }, { data: settings }, { data: rates }] = await Promise.all([
      supabaseAdmin.from("properties").select("slug, price_per_night").in("slug", slugs),
      supabaseAdmin.from("settings").select("base_price_per_night, default_min_nights").eq("id", 1).maybeSingle(),
      supabaseAdmin
        .from("seasonal_rates")
        .select("name, start_date, end_date, price_per_night, min_nights, property_slug")
        .order("start_date"),
    ]);

    const basePrice = Number(settings?.base_price_per_night ?? 0);
    const baseMin = Number(settings?.default_min_nights ?? 1);

    const propBase = (slug: string) => {
      const p = props?.find((x) => x.slug === slug);
      const v = Number(p?.price_per_night ?? 0);
      return v > 0 ? v : basePrice;
    };

    const start = new Date(`${data.start}T00:00:00Z`);
    const end = new Date(`${data.end}T00:00:00Z`);
    const nights = Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000));

    let minNights = baseMin;
    const segments: QuoteSegment[] = [];
    let stayTotal = 0;

    for (let i = 0; i < nights; i++) {
      const day = new Date(start.getTime() + i * 86400000);
      const iso = toISO(day);

      let label = "Basistarief";
      let nightTotal = 0;

      for (const slug of slugs) {
        // seizoen dat geldt voor deze woning (of voor alle woningen) en deze datum
        const season = rates?.find(
          (r) =>
            (!r.property_slug || r.property_slug === slug) &&
            iso >= r.start_date &&
            iso <= r.end_date,
        );
        if (season) {
          nightTotal += Number(season.price_per_night);
          label = season.name;
          if (season.min_nights && season.min_nights > minNights) minNights = season.min_nights;
        } else {
          nightTotal += propBase(slug);
        }
      }

      stayTotal += nightTotal;
      const last = segments[segments.length - 1];
      if (last && last.label === label && last.price_per_night === nightTotal) {
        last.nights += 1;
        last.subtotal += nightTotal;
      } else {
        segments.push({ label, nights: 1, price_per_night: nightTotal, subtotal: nightTotal });
      }
    }

    stayTotal = Math.round(stayTotal * 100) / 100;

    return {
      nights,
      stayTotal,
      avgPerNight: nights ? Math.round((stayTotal / nights) * 100) / 100 : 0,
      segments,
      minNights,
    };
  });
