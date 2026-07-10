-- Automatic iCal sync, every 3 hours. Non-technical admin should never have
-- to remember to click "Nu synchroniseren" manually — this makes it happen
-- on its own. The manual button in /admin/kalendersync still works too, as
-- an instant fallback (e.g. right after adding a new calendar link).

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Re-runnable: drop any existing job with this name before (re)scheduling,
-- so this migration can safely be applied more than once.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'ical-sync-every-3h') THEN
    PERFORM cron.unschedule('ical-sync-every-3h');
  END IF;
END $$;

SELECT cron.schedule(
  'ical-sync-every-3h',
  '0 */3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://hoaginjyaachoickqkno.supabase.co/functions/v1/ical-sync',
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  $$
);

-- Note: the ical-sync edge function only enforces the optional
-- ICAL_SYNC_SECRET header check when that secret is actually set (see
-- supabase/functions/ical-sync/index.ts). This cron job does not send that
-- header, so as long as no ICAL_SYNC_SECRET is configured, the scheduled
-- sync keeps working out of the box. If a secret is added later for extra
-- safety, this cron job's http_post call needs the matching x-sync-secret
-- header added too, or the scheduled sync will start failing with 401s.
