# Horse Vally — Directe boekingssite

Voor ik begin te bouwen, hieronder de voorgestelde structuur en de info die ik nog van jullie nodig heb. Zodra jullie akkoord geven en de open punten aanvullen, start ik met fase 1 (design + statische content in NL, daarna FR/EN, daarna boekingslogica, daarna admin + betalingen).

## Voorgestelde sitemap

**Publieke site (NL / FR / EN — taalwissel in header)**

1. `/` — Home
   - Hero (foto buitenkant of tuinlounge) + korte pitch + datepicker "Check beschikbaarheid"
   - Intro "Puur genieten" (warme, korte tekst — host-persoonlijk)
   - Highlights (4–6 iconen: 8 gasten, tuin met trampoline, bbq-lounge, dichtbij Tongeren, gratis parkeren, volledig uitgeruste keuken)
   - Fotogalerij-preview → link naar `/galerij`
   - Voorzieningen (accuraat, met "wel / niet inbegrepen" transparant)
   - Locatie & omgeving (regio Tongeren-Borgloon — géén exact adres)
   - Activiteiten in de buurt (Tongeren, fietsen, wandelen)
   - "Nieuw op de markt" + persoonlijke noot van Leslie (i.p.v. nep-reviews)
   - Boekingsblok (kalender + prijs + CTA)
   - Veelgestelde vragen + huisregels & annuleringsbeleid samenvatting
   - Contact / vraag stellen

2. `/galerij` — Volledige fotogalerij, gegroepeerd (Buiten · Tuin · Woonkamer · Keuken · Slaapkamers · Badkamers · Speelplezier)

3. `/boeken` — Boekingsflow
   - Stap 1: data + aantal gasten → prijs realtime
   - Stap 2: gegevens (naam, e-mail, telefoon, opmerkingen)
   - Stap 3: betaling (aanbetaling of volledig, via Mollie)
   - Bevestigingspagina + mail via Resend

4. `/huisregels` — Volledige huisregels + annuleringsvoorwaarden

5. `/contact` — Formulier + antwoordtermijn

6. `/legal/privacy` en `/legal/voorwaarden`

**Admin (beveiligd, /admin — enkel Leslie & Jason)**

- Login (wachtwoord + Supabase auth)
- Kalender: data blokkeren/vrijgeven
- Tarieven: basisprijs per nacht + optionele seizoensprijzen
- Promo: nieuwe-host-korting aan/uit + percentage
- Aanbetaling: percentage of "volledig verplicht"
- Boekingen: lijst met naam, data, status, bedrag, betaalstatus

## Technische aanpak (kort)

- Design: warm-landelijk-modern op basis van de foto's — baksteen, hout, groen, neutraal met één accentkleur (voorstel: warm oker of zacht terracotta). Custom, geen generieke template-look.
- Adres: opgeslagen als env var / admin-veld, alleen zichtbaar in bevestigingsmail — nooit publiek op de site.
- Mollie-integratie: gestructureerd zodat API-key later via Vercel env vars toegevoegd wordt zonder codewijziging.
- Kalender: Supabase als bron van waarheid; na geslaagde Mollie-webhook worden data direct geblokkeerd (voorkomt dubbele boekingen).
- SEO: per taal unieke title/description, `LodgingBusiness` / `VacationRental` schema, sitemap met hreflang.

## Open vragen — nodig vóór livegang

1. **Verwarming & warm water** — de originele listing zei "niet inbegrepen". Kan Leslie bevestigen dat de woning wél centrale verwarming en warm water heeft? (99% zeker een invulfout, maar ik wil dit niet fout op de site zetten.)
2. **CO-melder** — aanwezig ja/nee? (Voor transparantie in de voorzieningenlijst.)
3. **Exact adres** — apart aanleveren (mag via privé kanaal). Enkel voor kalenderlogica en bevestigingsmail, niet publiek.
4. **Definitieve prijslijst**
   - Basistarief per nacht (laag/mid/hoog seizoen?)
   - Schoonmaakkosten / servicekosten?
   - Minimum aantal nachten (bv. 2 in weekend, 1 doordeweeks)?
   - Nieuwe-host-kortingspercentage + einddatum promo?
5. **Aanbetaling** — voorkeur bij livegang: 30%, 50%, of volledig?
6. **Mollie-account** — status? (Ik zet de integratie klaar; API-key voegen jullie toe zodra account actief is.)
7. **Foto's in hoge resolutie** — de 10 aangeleverde foto's zijn goed, maar kunnen we deze aanvullen met:
   - Overzichtsfoto tuin (breed, met trampoline + lounge in één beeld)
   - Alle 4 slaapkamers (ik zie er nu 1)
   - Beide badkamers
   - Living/zithoek apart
   - Spelhoek (tafelvoetbal, pingpong, biljart)
8. **Domeinnaam** — is er al een domein gekozen (bv. horsevally.be)?
9. **Contact-e-mail voor bevestigingsmails** (afzender via Resend, bv. hallo@horsevally.be)
10. **Talen bij launch** — NL volledig af bij v1, of meteen NL+FR+EN samen live?

## Voorstel van aanpak in fases

- **Fase 1** — Design system + home + galerij + statische content (NL), placeholders waar foto's ontbreken
- **Fase 2** — FR + EN vertaling, SEO/schema/sitemap
- **Fase 3** — Supabase-kalender + boekingsflow (nog zonder echte betaling — test-mode)
- **Fase 4** — Mollie live + Resend bevestigingsmails
- **Fase 5** — Admin-dashboard

Laat me weten of de sitemap zo klopt, welke aanpassingen jullie willen, en beantwoord de open vragen — dan start ik met fase 1.
