ALTER TABLE public.seasonal_rates ADD COLUMN IF NOT EXISTS property_slug text;
CREATE INDEX IF NOT EXISTS seasonal_rates_property_slug_idx ON public.seasonal_rates (property_slug);