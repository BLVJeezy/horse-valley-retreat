-- The `properties` table itself (with address/description/contact_email/
-- price_per_night columns and RLS) was already created by the Lovable-
-- generated migration 20260709125554_aa28319a.... This migration only adds
-- what that one didn't: the Klein Lauw row, and starter descriptive copy.
--
-- Guarded with WHERE clauses so re-running this never overwrites content an
-- admin has since edited via /admin/locaties.

INSERT INTO public.properties (slug, name, is_live, mirror_photos, contact_email)
VALUES ('klein-lauw', 'Klein Lauw', false, true, 'hallo@horsevally.be')
ON CONFLICT (slug) DO NOTHING;

UPDATE public.properties
SET mirror_photos = true
WHERE slug = 'klein-lauw' AND mirror_photos IS DISTINCT FROM true;

UPDATE public.properties SET
  address = 'Tongeren-Borgloon, Belgisch Limburg',
  description = 'We bouwden dit huis met een simpel idee. Kom binnen, doe je jas uit, en vergeet even wat er op de kalender staat. De kinderen op de trampoline, jullie met een glas wijn onder de pergola.'
WHERE slug = 'horse-vally' AND address IS NULL AND description IS NULL;

UPDATE public.properties SET
  address = 'Tongeren-Borgloon, Belgisch Limburg',
  description = 'Dezelfde rust als Horse Vally, in spiegelbeeld. Ideaal voor wie met twee gezinnen samen weg wil, elk in hun eigen huis, naast elkaar.'
WHERE slug = 'klein-lauw' AND address IS NULL AND description IS NULL;
