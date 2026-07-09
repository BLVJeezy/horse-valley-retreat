import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getPropertyBySlug = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: property, error } = await supabaseAdmin
      .from("properties")
      .select("slug, name, is_live, mirror_photos, address, description, contact_email, price_per_night")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return property;
  });
