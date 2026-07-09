// Imports external iCal feeds (Airbnb, Booking.com, Launchpad, ...) into
// public.availability_blocks. Runs on a schedule (see cron config in README)
// and can also be triggered manually by an admin from the dashboard.
//
// Safe to re-run: each external event is upserted on (source, external_uid),
// and any block that disappeared from a feed (cancelled/changed reservation)
// is removed for that source before re-inserting the current set.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { parseIcs } from "../_shared/ics.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// Shared secret so this public (verify_jwt = false) endpoint can't be triggered
// or hammered by randoms. Set via `supabase secrets set ICAL_SYNC_SECRET=...`
// and pass it as `?secret=...` or an `x-sync-secret` header from the cron job / admin button.
const SYNC_SECRET = Deno.env.get("ICAL_SYNC_SECRET");

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (SYNC_SECRET) {
    const url = new URL(req.url);
    const provided = req.headers.get("x-sync-secret") ?? url.searchParams.get("secret");
    if (provided !== SYNC_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: feeds, error: feedsError } = await supabase
    .from("ical_feeds")
    .select("id, source, label, ical_url, is_active")
    .eq("is_active", true);

  if (feedsError) {
    return new Response(JSON.stringify({ error: feedsError.message }), { status: 500 });
  }

  const results: Record<string, unknown>[] = [];

  for (const feed of feeds ?? []) {
    try {
      const res = await fetch(feed.ical_url, {
        headers: { "User-Agent": "HorseValleyRetreat-Sync/1.0" },
      });
      if (!res.ok) throw new Error(`Fetch failed: HTTP ${res.status}`);

      const raw = await res.text();
      const events = parseIcs(raw);

      // Replace the current set of blocks for this source in one go, so
      // reservations that were cancelled on the source platform disappear here too.
      const { error: deleteError } = await supabase
        .from("availability_blocks")
        .delete()
        .eq("source", feed.source);
      if (deleteError) throw new Error(deleteError.message);

      if (events.length > 0) {
        const rows = events.map((ev) => ({
          start_date: ev.startDate,
          end_date: ev.endDate,
          source: feed.source,
          external_uid: ev.uid,
          guest_name: ev.summary ?? null,
          status: "confirmed",
        }));
        const { error: insertError } = await supabase.from("availability_blocks").insert(rows);
        if (insertError) throw new Error(insertError.message);
      }

      await supabase
        .from("ical_feeds")
        .update({
          last_synced_at: new Date().toISOString(),
          last_sync_status: "ok",
          last_sync_error: null,
        })
        .eq("id", feed.id);

      results.push({ feed: feed.label, source: feed.source, events: events.length, status: "ok" });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await supabase
        .from("ical_feeds")
        .update({
          last_synced_at: new Date().toISOString(),
          last_sync_status: "error",
          last_sync_error: message,
        })
        .eq("id", feed.id);

      results.push({ feed: feed.label, source: feed.source, status: "error", error: message });
    }
  }

  return new Response(JSON.stringify({ synced: results }), {
    headers: { "Content-Type": "application/json" },
  });
});
