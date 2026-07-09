-- Multiple listings support. For now this only drives visibility (live/offline)
-- and whether a listing's photos should render mirrored (Klein Lauw is the same
-- floor plan as Horse Vally, mirrored). Booking/availability data is NOT yet
-- split per property — see README note in supabase/functions/ical-sync.
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  is_live BOOLEAN NOT NULL DEFAULT false,
  mirror_photos BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.properties TO anon, authenticated;
GRANT ALL ON public.properties TO service_role;
GRANT UPDATE ON public.properties TO authenticated;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "properties readable by all" ON public.properties
  FOR SELECT USING (true);
CREATE POLICY "admins update properties" ON public.properties
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.properties (slug, name, is_live, mirror_photos) VALUES
  ('horse-vally', 'Horse Vally', true, false),
  ('klein-lauw', 'Klein Lauw', false, true);
