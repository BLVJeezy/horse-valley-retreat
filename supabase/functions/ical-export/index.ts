// Public, unauthenticated endpoint that serves an .ics feed of confirmed
// bookings that originated on the website (source = 'website'). Add this
// URL as an "external calendar" in Airbnb, Booking.com and Launchpad so a
// website booking blocks those platforms too.
//
// URL: https://<project>.supabase.co/functions/v1/ical-export

import { createClient } from "jsr:@supabase/supabase-js@2";
import { buildIcs } from "../_shared/ics.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: blocks, error } = await supabase
    .from("availability_blocks")
    .select("id, start_date, end_date, guest_name")
    .eq("source", "website")
    .eq("status", "confirmed");

  if (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }

  const ics = buildIcs(
    (blocks ?? []).map((b) => ({
      uid: `website-${b.id}@horsevalleyretreat`,
      startDate: b.start_date,
      endDate: b.end_date,
      summary: b.guest_name ? `Verhuurd (${b.guest_name})` : "Verhuurd",
    })),
    "Horse Valley Retreat - Website boekingen",
  );

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="horse-valley-retreat-website.ics"',
      "Cache-Control": "public, max-age=1800",
    },
  });
});
