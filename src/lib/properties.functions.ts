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

// Public: minimal list of all properties, used to render the "choose your
// house" switcher in the hero. Deliberately excludes internal-only fields.
export const listPublicProperties = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("properties")
    .select("slug, name, is_live")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
});
