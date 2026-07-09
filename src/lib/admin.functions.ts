import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function ensureAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin only");
}

// SETTINGS
export const updateSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        base_price_per_night: z.number().nonnegative(),
        cleaning_fee: z.number().nonnegative(),
        tourist_tax_per_person_per_night: z.number().nonnegative(),
        security_deposit: z.number().nonnegative(),
        default_min_nights: z.number().int().min(1).max(30),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase
      .from("settings")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// SEASONAL RATES
export const createSeasonalRate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        name: z.string().trim().min(1).max(80),
        start_date: z.string(),
        end_date: z.string(),
        price_per_night: z.number().nonnegative(),
        min_nights: z.number().int().min(1).max(30).nullable().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("seasonal_rates").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteSeasonalRate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("seasonal_rates").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// AVAILABILITY BLOCKS
export const createBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ start_date: z.string(), end_date: z.string() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("availability_blocks").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("availability_blocks").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// PROPERTIES (locaties): live/offline toggle
export const listProperties = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { data, error } = await context.supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  });

export const setPropertyLive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid(), is_live: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase
      .from("properties")
      .update({ is_live: data.is_live, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updatePropertyDetails = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        id: z.string().uuid(),
        name: z.string().trim().min(1).max(80),
        address: z.string().trim().max(200).nullable().optional(),
        description: z.string().trim().max(2000).nullable().optional(),
        contact_email: z.string().trim().email(),
        price_per_night: z.number().nonnegative().nullable().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { id, ...rest } = data;
    const { error } = await context.supabase
      .from("properties")
      .update({ ...rest, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ICAL FEEDS (Airbnb / Booking.com / Launchpad sync config)
export const listIcalFeeds = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { data, error } = await context.supabase
      .from("ical_feeds")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  });

export const createIcalFeed = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        source: z.enum(["airbnb", "booking", "launchpad", "other"]),
        label: z.string().trim().min(1).max(80),
        ical_url: z.string().trim().url(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("ical_feeds").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateIcalFeed = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        id: z.string().uuid(),
        label: z.string().trim().min(1).max(80).optional(),
        ical_url: z.string().trim().url().optional(),
        is_active: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { id, ...rest } = data;
    const { error } = await context.supabase
      .from("ical_feeds")
      .update({ ...rest, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteIcalFeed = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("ical_feeds").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Manually trigger the ical-sync edge function from the admin dashboard
// (in addition to whatever cron schedule is configured).
export const triggerIcalSync = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const syncSecret = process.env.ICAL_SYNC_SECRET;
    if (!supabaseUrl || !serviceKey) throw new Error("Supabase server config ontbreekt");

    const res = await fetch(`${supabaseUrl}/functions/v1/ical-sync`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        ...(syncSecret ? { "x-sync-secret": syncSecret } : {}),
      },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.error ?? `Sync mislukt (HTTP ${res.status})`);
    return body;
  });

// BOOKING REQUESTS (from the public BookingWidget)
export const listBookingRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { data, error } = await context.supabase
      .from("booking_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const confirmBookingRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { data: req, error: reqError } = await context.supabase
      .from("booking_requests")
      .select("*")
      .eq("id", data.id)
      .single();
    if (reqError) throw new Error(reqError.message);
    if (req.status !== "pending") throw new Error("Aanvraag is niet meer pending");

    const { data: block, error: blockError } = await context.supabase
      .from("availability_blocks")
      .insert({
        start_date: req.start_date,
        end_date: req.end_date,
        source: "website",
        guest_name: req.guest_name,
        status: "confirmed",
      })
      .select("id")
      .single();
    if (blockError) throw new Error(blockError.message);

    const { error: updateError } = await context.supabase
      .from("booking_requests")
      .update({ status: "confirmed", availability_block_id: block.id, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (updateError) throw new Error(updateError.message);

    return { ok: true };
  });

export const declineBookingRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase
      .from("booking_requests")
      .update({ status: "declined", updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
