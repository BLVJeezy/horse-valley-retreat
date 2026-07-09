
-- availability_blocks: add missing columns
ALTER TABLE public.availability_blocks
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'confirmed',
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'website',
  ADD COLUMN IF NOT EXISTS guest_name text;

-- properties
CREATE TABLE IF NOT EXISTS public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  is_live boolean NOT NULL DEFAULT true,
  mirror_photos boolean NOT NULL DEFAULT false,
  address text,
  description text,
  contact_email text,
  price_per_night numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.properties TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Admins manage properties" ON public.properties FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.properties (slug, name, is_live, contact_email)
VALUES ('horse-vally', 'Horse Vally', true, 'hallo@horsevally.be')
ON CONFLICT (slug) DO NOTHING;

-- ical_feeds
CREATE TABLE IF NOT EXISTS public.ical_feeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  label text NOT NULL,
  ical_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  last_synced_at timestamptz,
  last_sync_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ical_feeds TO authenticated;
GRANT ALL ON public.ical_feeds TO service_role;
ALTER TABLE public.ical_feeds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage ical_feeds" ON public.ical_feeds FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- booking_requests
CREATE TABLE IF NOT EXISTS public.booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date date NOT NULL,
  end_date date NOT NULL,
  guests integer NOT NULL,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text,
  message text,
  status text NOT NULL DEFAULT 'pending',
  availability_block_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.booking_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_requests TO authenticated;
GRANT ALL ON public.booking_requests TO service_role;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit booking requests" ON public.booking_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read booking_requests" ON public.booking_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update booking_requests" ON public.booking_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
