import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Public: returns every blocked date range (from any source) so the site's
// calendar can grey out unavailable days. No sensitive info beyond the ranges.
export const getAvailabilityBlocks = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("availability_blocks")
    .select("start_date, end_date")
    .eq("status", "confirmed");
  if (error) throw new Error(error.message);
  return data;
});

// Public: submit a booking request from the BookingWidget. This does NOT
// block the calendar immediately — the owner confirms it manually (see
// confirmBookingRequest in admin.functions.ts), which is what keeps this
// safe against the few-hours sync delay from Airbnb/Booking.com.
export const submitBookingRequest = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        start_date: z.string(),
        end_date: z.string(),
        guests: z.number().int().min(1).max(20),
        guest_name: z.string().trim().min(1).max(120),
        guest_email: z.string().trim().email(),
        guest_phone: z.string().trim().max(40).optional(),
        message: z.string().trim().max(2000).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Reject requests that overlap an existing confirmed block, so people
    // can't submit a request for dates that are already taken (on any source).
    const { data: overlapping, error: overlapError } = await supabaseAdmin
      .from("availability_blocks")
      .select("id")
      .eq("status", "confirmed")
      .lt("start_date", data.end_date)
      .gt("end_date", data.start_date)
      .limit(1);
    if (overlapError) throw new Error(overlapError.message);
    if (overlapping && overlapping.length > 0) {
      throw new Error("Deze data zijn helaas niet meer beschikbaar.");
    }

    const { error } = await supabaseAdmin.from("booking_requests").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
