
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Settings (singleton row, id = 1)
CREATE TABLE public.settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  base_price_per_night NUMERIC(10,2) NOT NULL DEFAULT 250,
  cleaning_fee NUMERIC(10,2) NOT NULL DEFAULT 75,
  tourist_tax_per_person_per_night NUMERIC(10,2) NOT NULL DEFAULT 2.50,
  security_deposit NUMERIC(10,2) NOT NULL DEFAULT 500,
  default_min_nights INT NOT NULL DEFAULT 2,
  currency TEXT NOT NULL DEFAULT 'EUR',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO public.settings (id) VALUES (1);

GRANT SELECT ON public.settings TO anon, authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings readable by all" ON public.settings
  FOR SELECT USING (true);
CREATE POLICY "admins update settings" ON public.settings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seasonal rates
CREATE TABLE public.seasonal_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price_per_night NUMERIC(10,2) NOT NULL,
  min_nights INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);

GRANT SELECT ON public.seasonal_rates TO anon, authenticated;
GRANT ALL ON public.seasonal_rates TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.seasonal_rates TO authenticated;
ALTER TABLE public.seasonal_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "seasonal readable" ON public.seasonal_rates FOR SELECT USING (true);
CREATE POLICY "admin insert seasonal" ON public.seasonal_rates
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update seasonal" ON public.seasonal_rates
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete seasonal" ON public.seasonal_rates
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Availability blocks
CREATE TABLE public.availability_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);

GRANT SELECT ON public.availability_blocks TO anon, authenticated;
GRANT ALL ON public.availability_blocks TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.availability_blocks TO authenticated;
ALTER TABLE public.availability_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blocks readable" ON public.availability_blocks FOR SELECT USING (true);
CREATE POLICY "admin insert blocks" ON public.availability_blocks
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete blocks" ON public.availability_blocks
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
