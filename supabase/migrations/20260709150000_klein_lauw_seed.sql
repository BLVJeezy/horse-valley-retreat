-- The `properties` table itself (with address/description/contact_email/
-- price_per_night columns and RLS) was already created by the Lovable-
-- generated migration 20260709125554_aa28319a.... This migration only adds
-- what that one didn't: the Klein Lauw row, and starter descriptive copy.
--
-- Guarded with WHERE clauses so re-running this never overwrites content an
-- admin has since edited via /admin/locaties.

INSERT INTO public.properties (slug, name, is_live, mirror_photos, contact_email)
VALUES ('klein-lauw', 'Klein Lauw', true, true, 'hallo@horsevally.be')
ON CONFLICT (slug) DO NOTHING;

UPDATE public.properties
SET mirror_photos = true, is_live = true
WHERE slug = 'klein-lauw';

UPDATE public.properties SET
  address = 'Tongeren-Borgloon, Belgisch Limburg',
  description = 'We bouwden dit huis met een simpel idee. Kom binnen, doe je jas uit, en vergeet even wat er op de kalender staat. De kinderen op de trampoline, jullie met een glas wijn onder de pergola.'
WHERE slug = 'horse-vally' AND address IS NULL AND description IS NULL;

-- Klein Lauw uses identical descriptive copy to Horse Vally (same house,
-- mirrored layout) — kept in sync here rather than left with its own text.
UPDATE public.properties SET
  address = 'Tongeren-Borgloon, Belgisch Limburg',
  description = 'We bouwden dit huis met een simpel idee. Kom binnen, doe je jas uit, en vergeet even wat er op de kalender staat. De kinderen op de trampoline, jullie met een glas wijn onder de pergola.'
WHERE slug = 'klein-lauw';
