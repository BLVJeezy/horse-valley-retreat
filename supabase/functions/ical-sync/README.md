# Kalendersync — setup

Alles is gebouwd. Zodra je de iCal-links van Airbnb / Booking.com / Launchpad hebt, hoef je enkel dit te doen — geen code meer nodig.

## 1. Feeds toevoegen (import: Airbnb/Booking/Launchpad → website)

Log in op `/admin/kalendersync` en voeg elke kalender toe via het formulier:
- **Airbnb**: Kalender → Beschikbaarheid exporteren → kopieer de iCal-link
- **Booking.com**: Extranet → Kalender & prijzen → Kalender synchroniseren → kopieer de iCal-link
- **Launchpad**: afhankelijk van wat dit precies is (zie eerder gesprek) — als het een PMS/channel manager is, zoek naar "iCal export" of "external calendar" in de instellingen

## 2. Automatische sync inschakelen (cron)

De edge function `ical-sync` moet periodiek aangeroepen worden (elke 2-4 uur is prima). Twee opties:

**Optie A — Supabase pg_cron (aanbevolen, alles in de database):**
```sql
select cron.schedule(
  'ical-sync-every-3h',
  '0 */3 * * *',
  $$
  select net.http_post(
    url := 'https://hoaginjyaachoickqkno.supabase.co/functions/v1/ical-sync',
    headers := jsonb_build_object('x-sync-secret', '<ICAL_SYNC_SECRET waarde>')
  );
  $$
);
```
Vereist de `pg_cron` en `pg_net` extensions (aan te zetten in Supabase Dashboard → Database → Extensions).

**Optie B — extern (bv. cron-job.org of GitHub Actions):**
POST naar `https://hoaginjyaachoickqkno.supabase.co/functions/v1/ical-sync` met header `x-sync-secret: <secret>`.

Tot de cron is ingesteld werkt de "Nu synchroniseren"-knop in `/admin/kalendersync` als manuele fallback.

## 3. Secret instellen

```bash
supabase secrets set ICAL_SYNC_SECRET=<genereer een willekeurige string>
```
Diezelfde waarde ook zetten als environment variable `ICAL_SYNC_SECRET` in Vercel (gebruikt door de "Nu synchroniseren"-knop in de admin, via `triggerIcalSync`).

## 4. Export-link doorgeven aan de klant

Geef deze URL door om toe te voegen als "externe kalender" in Airbnb, Booking.com én Launchpad:
```
https://hoaginjyaachoickqkno.supabase.co/functions/v1/ical-export
```
Dit zorgt voor de 2-richting sync: boekingen via de website blokkeren dan ook die andere platformen.

## Hoe het werkt

- **Import**: `ical-sync` haalt elke actieve feed op, parsed de VEVENT-blokken, en zet ze in `availability_blocks` met de juiste `source`. Oude events van die bron worden eerst verwijderd zodat geannuleerde boekingen ook hier verdwijnen.
- **Export**: `ical-export` is een publieke read-only endpoint die alleen `source = 'website'` boekingen teruggeeft als `.ics`.
- **Website-aanvragen**: gaan via `booking_requests` (status `pending`) en blokkeren de kalender pas na handmatige bevestiging in `/admin/kalendersync` — dit compenseert de paar-uur vertraging die inherent is aan iCal-sync.
