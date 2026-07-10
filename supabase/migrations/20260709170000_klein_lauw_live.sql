-- Klein Lauw goes live, with identical descriptive copy to Horse Vally
-- (same house, mirrored layout) as requested. Idempotent / safely re-runnable.

INSERT INTO public.properties (slug, name, is_live, mirror_photos, contact_email)
VALUES ('klein-lauw', 'Klein Lauw', true, true, 'hallo@horsevally.be')
ON CONFLICT (slug) DO UPDATE SET is_live = true, mirror_photos = true;

UPDATE public.properties SET
  address = 'Tongeren-Borgloon, Belgisch Limburg',
  description = 'We bouwden dit huis met een simpel idee. Kom binnen, doe je jas uit, en vergeet even wat er op de kalender staat. De kinderen op de trampoline, jullie met een glas wijn onder de pergola.'
WHERE slug IN ('horse-vally', 'klein-lauw');
