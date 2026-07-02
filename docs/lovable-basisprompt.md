# LOVABLE BASISPROMPT — Horse Vally (vakantiewoning boekingssite)

Je bent een expert full-stack developer en conversie-copywriter voor vakantiewoning-boekingssites. Bouw een directe boekingssite (buiten Airbnb om) voor onderstaande woning.

## BESTAANDE REPO — BOUW HIEROP VERDER, NIET OPNIEUW

Er staat al een werkend prototype in `github.com/BLVJeezy/horse-valley-retreat` (TanStack Start + React 19 + Tailwind v4 + shadcn/ui). Behoud de bestaande visuele stijl, copy en structuur (hero, host-quote, foto-mozaïek, "eerlijk over ons huis", omgevingssectie, huisregels, contact) — dit is al goed gedaan. Focus de bouw-inspanning op wat nog ontbreekt:

- `BookingWidget.tsx` doet nu alleen een `alert()` bij submit — geen echte data. Vervang door een werkende flow gekoppeld aan Supabase + Mollie.
- Geen Supabase in het project — moet toegevoegd worden voor boekingen/beschikbaarheid.
- Geen i18n — site is nu alleen Nederlands. FR/EN moeten volledig toegevoegd worden zonder de bestaande NL-copy te breken.
- Geen admin-dashboard route — moet toegevoegd worden (zie onder).
- Check de huisregels die nu al op de site staan ("geen feesten na 22:00", "roken alleen buiten") bij Leslie — deze stonden niet in de originele Airbnb-listing en zijn mogelijk door Lovable zelf verzonnen.

## BUSINESS CONTEXT

- **Naam:** Horse Vally
- **Type:** Vakantiewoning, hele accommodatie (geen gedeelde ruimtes)
- **Locatie:** Tongeren-Borgloon, Vlaanderen, België
- **Capaciteit:** 8 gasten, 4 slaapkamers, 5 bedden, 2 badkamers
- **Host:** Leslie (nieuwe host — nog geen reviews, dus de site moet vertrouwen opbouwen via sterke visuals, duidelijke info en transparantie, niet via social proof die er nog niet is)
- **Doelgroep:** Gezinnen en groepen die een rustig, landelijk weekend/midweek willen in Limburg, met interesse in Tongeren (oudste stad van België), natuur, fietsen/wandelen

## KERNPROPOSITIE

"Puur genieten" — een stijlvolle nieuwbouwwoning met verzorgde tuin (trampoline, bbq, buitenlounge, buiteneethoek), speelmogelijkheden binnen (tafelvoetbal, pingpong, biljart), volledig uitgeruste keuken, en gratis parkeren op eigen terrein. Vlak bij Tongeren voor cultuur/historie, en omringd door velden voor wandelingen en fietstochten.

## VOORZIENINGEN (accuraat overnemen, niets verzinnen)

**Wel aanwezig:**
- Volledig uitgeruste keuken
- Wifi
- Gratis parkeren op het terrein
- Televisie
- Wasmachine
- Buiteneethoek + barbecue/grill
- Rookmelder, brandblusser, EHBO-doos

**Niet inbegrepen / ontbreekt (transparant vermelden, niet verbergen):**
- Airconditioning
- Droogkast
- CO-melder (onbekend of aanwezig)
- Beveiligingscamera's buiten de accommodatie

⚠️ **Let op vóór livegang:** de originele listing gaf ook "Verwarming" en "Warm water" als niet-inbegrepen aan. Dat is zeer ongebruikelijk voor een verhuurwoning en waarschijnlijk een invulfout van de nieuwe host. **Verifieer dit eerst bij Leslie voordat dit op de site komt** — vermeld dit niet als "geen verwarming/warm water" zonder bevestiging, dat kan boekingen kosten of tot klachten leiden.

## PRIJSINDICATIE (als voorbeeld, geen vaste prijs — bouw dynamische prijsberekening)

- Voorbeeld 5 nachten (1 gast): €3.308 richtprijs, met introductiekorting €2.726
- Voorbeeld 1 nacht midweek (2 gasten): €648 richtprijs, met introductiekorting €534
- Er loopt momenteel een "nieuwe host"-korting — bouw dit in als instelbare/tijdelijke promo, niet hardcoded

## HUISREGELS

- Check-in vanaf 15:00
- Maximum 8 gasten
- Gratis annuleren tot 24 uur voor check-in, 100% terugbetaling; na die termijn geen terugbetaling

## HUISSTIJL

Geen bestaand logo of kleurenpalet — ontwerp de visuele stijl op basis van de sfeer in de aangeleverde foto's: warme, landelijke, moderne look (baksteen, hout, groen gazon, neutrale tinten met accentkleur). Gebruik de frontend-design skill/richtlijnen voor een doordacht, niet-generiek resultaat — geen standaard Bootstrap-blauw of Lovable-default paars.

## ADRES & LOCATIE

Jason levert het exacte adres apart aan (niet in deze prompt). Bouw de kalenderlogica en eventuele Google Maps-integratie zo dat het adres eenvoudig los ingevoerd kan worden (bv. via env variable of in het admin-dashboard), en zorg dat het **nooit publiek zichtbaar is op de site zelf** — alleen regio "Tongeren-Borgloon" tonen aan bezoekers, exact adres pas na boeking per e-mail communiceren.

## BOEKINGSFLOW

Instant booking: gasten kiezen data + aantal gasten, zien direct de prijs, en kunnen meteen betalen zonder handmatige goedkeuring vooraf. Zorg dat de kalender na een geslaagde betaling automatisch de geboekte data blokkeert, zodat dubbele boekingen niet kunnen ontstaan.

## FOTO'S

Gebruik uitsluitend de foto's die Jason aanlevert. Geen stockfoto's, geen placeholders, geen AI-gegenereerde beelden. Als een sectie een foto nodig heeft die nog niet is aangeleverd, laat een duidelijk gemarkeerde placeholder achter (bv. "FOTO NODIG: tuin overzicht") in plaats van iets te verzinnen.

## FUNCTIONELE VEREISTEN (directe boekingssite)

1. **Kalender & beschikbaarheid**
   - Interactieve kalender met beschikbare/geblokkeerde data
   - Check-in/check-out selectie, gastenaantal (max 8)
   - Realtime prijsberekening op basis van nachten × tarief + eventuele korting/promo

2. **Boeking & betaling**
   - Boekingsformulier (naam, e-mail, telefoon, aantal gasten, opmerkingen)
   - Online betaling via Mollie (voorkeur voor Belgische markt, iDEAL/Bancontact support) — account moet nog opgezet worden, dus bouw de integratie zo dat de API-key later eenvoudig kan worden toegevoegd via environment variable in Vercel
   - Bevestigingsmail na boeking (via Resend, zoals gebruikelijk in onze stack)
   - **Aanbetaling instelbaar via admin-dashboard**: percentage (bv. 30%) of volledige betaling, aanpasbaar zonder codewijziging

3. **Content secties**
   - Hero met sterke foto (buitenkant woning of tuin/lounge)
   - Korte, warme intro (NL/FR/EN) — "puur genieten", gezinsvriendelijk, rust
   - Fotogalerij (alle beschikbare foto's: exterieur, tuin, eetkamer, lounge, trampoline)
   - Voorzieningen-overzicht (accuraat, zie boven)
   - Activiteiten in de buurt (Tongeren, fietsen, wandelen)
   - Kaart met locatie (regio Tongeren-Borgloon, geen exact adres tonen om privacy van host te respecteren)
   - Huisregels & annuleringsbeleid
   - Contactsectie / vraag stellen aan host

4. **Meertaligheid**
   - NL (primair), FR, EN — volledige vertaling van alle content, niet alleen labels
   - Taalwissel zichtbaar in header

5. **Vertrouwen opbouwen (belangrijk gezien nieuwe host, nog geen reviews)**
   - Duidelijke "Nieuw op de markt"-sectie i.p.v. nep-reviews tonen
   - Transparante info: wat is wel/niet inbegrepen, duidelijke annuleringsvoorwaarden
   - Persoonlijke noot van Leslie (host-story, kort en menselijk, geen corporate taal)
   - Veilige betaalbadges (Mollie/Stripe secured payment)

## ADMIN-DASHBOARD (eenvoudig, alleen voor Leslie/Jason)

Bouw een beveiligde admin-pagina (login met wachtwoord, geen publieke toegang) waar zonder code-kennis het volgende beheerd kan worden:
- Beschikbaarheid: data blokkeren/vrijgeven in de kalender
- Prijzen: basistarief per nacht, seizoensprijzen indien gewenst
- Kortingen/promo's: aan/uit zetten, percentage instellen
- Aanbetaling: percentage instellen of "volledige betaling verplicht" aanvinken

### Boekingenoverzicht

Aparte sectie in het admin-dashboard met een tabel van alle boekingen: gastnaam, check-in datum, check-out datum, aantal gasten, bedrag, betaalstatus (betaald/aanbetaling/openstaand), contactgegevens. Sorteerbaar op datum, nieuwste boeking bovenaan.

Vul de tabel bij oplevering met deze twee voorbeeldboekingen (testdata, later te verwijderen/vervangen door echte boekingen):

| Gast | Check-in | Check-out | Gasten | Bedrag | Status |
|---|---|---|---|---|---|
| Voorbeeldboeking 1 | 06/07/2026 | 07/07/2026 | 2 | € 534 | Betaald |
| Voorbeeldboeking 2 | 10/07/2026 | 13/07/2026 | 6 | € 1.850 | Betaald |

Deze twee data moeten ook automatisch als geblokkeerd verschijnen in de publieke kalender, zodat je meteen kan testen of de koppeling tussen boekingenoverzicht en beschikbaarheidskalender werkt.

Houd dit bewust simpel — geen onnodige extra features, alleen wat Leslie/Jason echt nodig hebben om de site draaiende te houden zonder ontwikkelaar erbij te halen.

## SEO & TECHNISCH

- Meta title/description per taalversie, uniek en gericht op "vakantiewoning Tongeren-Borgloon", "vakantiehuis Limburg gezin", etc.
- Schema markup: LodgingBusiness / VacationRental
- Sitemap.xml met alle taalversies
- Mobile-first (meeste boekingen gebeuren op mobiel)
- Snelle laadtijd — geoptimaliseerde afbeeldingen (WebP)

## CONTENT-REGELS (Solyn-stijl, ook hier toepassen)

- Schrijf menselijk, geen "top-notch", "ensure", "comprehensive", "crucial", "optimal", "delve", "navigating"
- 5de-graads leesniveau, korte zinnen
- Geen copy-paste CTA's tussen secties — elke sectie eindigt anders
- Gebruik concrete, sfeervolle taal (bv. "kinderen springen op de trampoline terwijl jullie een glas wijn drinken op het terras" i.p.v. "diverse voorzieningen voor het hele gezin")

## TECH STACK (Solyn-standaard)

- Lovable (React + Vite + TypeScript + Tailwind)
- Supabase voor boekingen-database en beschikbaarheidskalender
- Mollie of Stripe voor betalingen
- Resend voor bevestigingsmails
- Vercel voor hosting (NITRO_PRESET=vercel indien van toepassing)

## EERSTE STAP — NIET METEEN BOUWEN

Voordat je begint met bouwen:
1. Stel een sitemap/structuur voor (paginas, secties) en laat goedkeuren
2. Vraag om ontbrekende info: exacte adres (voor kalender/logistiek, niet publiek), bevestiging verwarming/warm water, definitieve prijslijst per seizoen, alle foto's in hoge resolutie, bankgegevens/Mollie-account voor betalingen
3. Wacht op akkoord voordat je de betaalintegratie opzet
