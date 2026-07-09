-- Source tracking for availability blocks (manual / website booking / external ical feed)
CREATE TYPE public.block_source AS ENUM ('manual', 'website', 'airbnb', 'booking', 'launchpad', 'other');

ALTER TABLE public.availability_blocks
  ADD COLUMN source public.block_source NOT NULL DEFAULT 'manual',
  ADD COLUMN external_uid TEXT,
  ADD COLUMN guest_name TEXT,
  ADD COLUMN status TEXT NOT NULL DEFAULT 'confirmed',
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- external_uid uniquely identifies a booking within its source feed (Airbnb/Booking UID from the ICS VEVENT)
-- Only enforced for non-manual/website sources, since manual blocks never have one.
CREATE UNIQUE INDEX availability_blocks_source_external_uid_idx
  ON public.availability_blocks (source, external_uid)
  WHERE external_uid IS NOT NULL;

-- Config table: one row per external calendar to sync (Airbnb, Booking.com, Launchpad, ...)
CREATE TABLE public.ical_feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source public.block_source NOT NULL,
  label TEXT NOT NULL,
  ical_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_synced_at TIMESTAMPTZ,
  last_sync_status TEXT,
  last_sync_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source, ical_url)
);

GRANT SELECT ON public.ical_feeds TO authenticated;
GRANT ALL ON public.ical_feeds TO service_role;
ALTER TABLE public.ical_feeds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins read feeds" ON public.ical_feeds
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins insert feeds" ON public.ical_feeds
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update feeds" ON public.ical_feeds
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete feeds" ON public.ical_feeds
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Pending website booking requests (from the public BookingWidget) land here before the
-- owner confirms them. Confirming a request promotes it into availability_blocks (source = 'website').
CREATE TABLE public.booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guests INT NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | confirmed | declined
  availability_block_id UUID REFERENCES public.availability_blocks(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);

GRANT ALL ON public.booking_requests TO service_role;
GRANT SELECT, UPDATE ON public.booking_requests TO authenticated;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins read requests" ON public.booking_requests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update requests" ON public.booking_requests
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
-- Inserts happen only via the edge function (service_role), never directly from the client,
-- so there is no public INSERT policy here.
