ALTER TABLE public.properties
  ADD COLUMN address TEXT,
  ADD COLUMN description TEXT,
  ADD COLUMN contact_email TEXT NOT NULL DEFAULT 'hallo@horsevally.be',
  ADD COLUMN price_per_night NUMERIC(10,2);

COMMENT ON COLUMN public.properties.price_per_night IS
  'Optional per-property override. When NULL, the site falls back to settings.base_price_per_night.';

UPDATE public.properties SET
  address = 'Tongeren-Borgloon, Belgisch Limburg',
  description = 'We bouwden dit huis met een simpel idee. Kom binnen, doe je jas uit, en vergeet even wat er op de kalender staat. De kinderen op de trampoline, jullie met een glas wijn onder de pergola.'
WHERE slug = 'horse-vally';

UPDATE public.properties SET
  address = 'Tongeren-Borgloon, Belgisch Limburg',
  description = 'Dezelfde rust als Horse Vally, in spiegelbeeld. Ideaal voor wie met twee gezinnen samen weg wil, elk in hun eigen huis, naast elkaar.'
WHERE slug = 'klein-lauw';
