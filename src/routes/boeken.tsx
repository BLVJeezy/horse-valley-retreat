import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { countriesForSelect, arrivalTimeSlots } from "@/lib/countries";
import { createBooking } from "@/lib/booking.functions";
import { getPropertyBySlug } from "@/lib/properties.functions";

interface BookingSearch {
  woning: string;
  aankomst?: string;
  vertrek?: string;
  gasten?: number;
}

export const Route = createFileRoute("/boeken")({
  validateSearch: (search: Record<string, unknown>): BookingSearch => ({
    woning: typeof search.woning === "string" ? search.woning : "horse-vally",
    aankomst: typeof search.aankomst === "string" ? search.aankomst : undefined,
    vertrek: typeof search.vertrek === "string" ? search.vertrek : undefined,
    gasten: Number(search.gasten) > 0 ? Number(search.gasten) : undefined,
  }),
  loaderDeps: ({ search }) => ({ woning: search.woning }),
  loader: async ({ deps }) => {
    const property = await getPropertyBySlug({ data: { slug: deps.woning } });
    return { property };
  },
  head: () => ({
    meta: [
      { title: "Boeken — Horsey Valley & Klein Lauw in Tongeren" },
      {
        name: "description",
        content:
          "Boek Horsey Valley of Klein Lauw in drie stappen: je gegevens, optionele annuleringsverzekering en online betaling. Rechtstreeks bij de eigenaars.",
      },
      { property: "og:title", content: "Boeken — Horsey Valley & Klein Lauw" },
      {
        property: "og:description",
        content: "Boek direct bij de host in drie eenvoudige stappen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookPage,
});

const INSURANCE_RATE = 0.0546; // ~5,5% van de verblijfskosten

const houseRules = [
  "Niet roken",
  "Geen feesten/bijeenkomsten",
  "Tussen 22:00 en 08:00 moet het stil zijn",
  "Geen huisdieren",
];

function nightsBetween(a?: string, b?: string) {
  if (!a || !b) return 0;
  const diff = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(0, Math.round(diff / 86400000));
}

function formatNL(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("nl-BE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function euro(n: number) {
  return `€${n.toFixed(2)}`;
}

const inputClass =
  "w-full border border-foreground/15 rounded-lg px-3 py-2.5 text-sm bg-background outline-none focus:border-accent transition-colors";
const labelClass = "block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1.5";

function BookPage() {
  const { property } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Stap 1
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [dial, setDial] = useState("32");
  const [phone, setPhone] = useState("");
  const [digitalConfirmation, setDigitalConfirmation] = useState(true);
  const [bookingFor, setBookingFor] = useState<"self" | "other">("self");
  const [businessTrip, setBusinessTrip] = useState<boolean | null>(null);
  const [carRental, setCarRental] = useState(false);
  const [transfer, setTransfer] = useState(false);
  const [specialRequests, setSpecialRequests] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  // Stap 2
  const [insurance, setInsurance] = useState(false);

  // Stap 3
  const [payment, setPayment] = useState<"card" | "bancontact" | "transfer">("card");

  const nights = nightsBetween(search.aankomst, search.vertrek);
  const guests = search.gasten ?? 2;
  const pricePerNight = property?.price_per_night ?? null;
  const stayTotal = useMemo(
    () => (pricePerNight && nights ? Number(pricePerNight) * nights : 0),
    [pricePerNight, nights],
  );
  const insuranceAmount = useMemo(
    () => Math.round(stayTotal * INSURANCE_RATE * 100) / 100,
    [stayTotal],
  );
  const grandTotal = stayTotal + (insurance ? insuranceAmount : 0);

  const datesMissing = !search.aankomst || !search.vertrek || nights === 0;

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (datesMissing) {
      setError("Kies eerst je aankomst- en vertrekdatum.");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await createBooking({
        data: {
          property_slug: search.woning,
          start_date: search.aankomst!,
          end_date: search.vertrek!,
          guests,
          first_name: firstName,
          last_name: lastName,
          guest_email: email,
          country,
          phone_country_code: `+${dial}`,
          guest_phone: phone,
          booking_for: bookingFor,
          business_trip: businessTrip ?? undefined,
          special_requests: specialRequests || undefined,
          arrival_time: arrivalTime || undefined,
          house_rules_accepted: true,
          insurance_added: insurance,
          insurance_amount: insurance ? insuranceAmount : undefined,
          payment_method: payment,
          total_amount: grandTotal || undefined,
          wants_car_rental: carRental,
          wants_transfer: transfer,
        },
      });
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />

      <main className="pt-28 md:pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground mb-3">
          {property?.name ?? "Horsey Valley"} · Tongeren
        </p>
        <h1 className="font-serif text-4xl md:text-5xl mb-8">Je boeking afronden</h1>

        {done ? (
          <div className="border border-accent/40 bg-accent/5 rounded-2xl p-8 max-w-2xl">
            <h2 className="font-serif text-2xl mb-2">Bedankt {firstName}, je boeking is binnen!</h2>
            <p className="text-sm text-muted-foreground mb-4">
              We sturen je een bevestiging naar {email} met de betaalinstructies en het exacte
              adres. Aankomst {formatNL(search.aankomst)}, vertrek {formatNL(search.vertrek)} ·{" "}
              {nights} {nights === 1 ? "nacht" : "nachten"} · {guests}{" "}
              {guests === 1 ? "gast" : "gasten"}.
            </p>
            <Link to="/" className="text-sm underline">
              Terug naar de woning
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
            <div>
              {/* Stepper */}
              <ol className="flex items-center gap-3 mb-8 text-xs">
                {[
                  { n: 1, label: "Je gegevens" },
                  { n: 2, label: "Verzekering" },
                  { n: 3, label: "Betalen" },
                ].map((s) => (
                  <li key={s.n} className="flex items-center gap-2">
                    <span
                      className={`h-6 w-6 rounded-full grid place-items-center text-[11px] ${
                        step >= s.n
                          ? "bg-accent text-background"
                          : "bg-foreground/10 text-muted-foreground"
                      }`}
                    >
                      {s.n}
                    </span>
                    <span className={step === s.n ? "font-medium" : "text-muted-foreground"}>
                      {s.label}
                    </span>
                    {s.n < 3 && <span className="w-6 h-px bg-foreground/15 ml-1" />}
                  </li>
                ))}
              </ol>

              {datesMissing && (
                <div className="mb-8 rounded-xl border border-foreground/15 p-5">
                  <p className="text-sm mb-3">
                    Je hebt nog geen data gekozen. Selecteer eerst je aankomst en vertrek.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <label className="text-sm">
                      <span className={labelClass}>Aankomst</span>
                      <input
                        type="date"
                        className={inputClass}
                        value={search.aankomst ?? ""}
                        onChange={(e) =>
                          navigate({
                            to: "/boeken",
                            search: { ...search, aankomst: e.target.value },
                          })
                        }
                      />
                    </label>
                    <label className="text-sm">
                      <span className={labelClass}>Vertrek</span>
                      <input
                        type="date"
                        className={inputClass}
                        value={search.vertrek ?? ""}
                        onChange={(e) =>
                          navigate({
                            to: "/boeken",
                            search: { ...search, vertrek: e.target.value },
                          })
                        }
                      />
                    </label>
                    <label className="text-sm">
                      <span className={labelClass}>Gasten</span>
                      <select
                        className={inputClass}
                        value={guests}
                        onChange={(e) =>
                          navigate({
                            to: "/boeken",
                            search: { ...search, gasten: Number(e.target.value) },
                          })
                        }
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? "gast" : "gasten"}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              )}

              {/* ---------- Stap 1 ---------- */}
              {step === 1 && (
                <form onSubmit={handleStep1} className="space-y-8">
                  <section className="border border-foreground/12 rounded-2xl p-6">
                    <h2 className="font-serif text-2xl mb-1">Vul je gegevens in</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      Bijna klaar! Vul alleen nog de vereiste gegevens bij * in.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label>
                        <span className={labelClass}>Voornaam*</span>
                        <input
                          required
                          maxLength={80}
                          className={inputClass}
                          placeholder="Vul je voornaam in"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </label>
                      <label>
                        <span className={labelClass}>Achternaam*</span>
                        <input
                          required
                          maxLength={80}
                          className={inputClass}
                          placeholder="Vul je achternaam in"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </label>
                      <label className="sm:col-span-2">
                        <span className={labelClass}>E-mailadres*</span>
                        <input
                          required
                          type="email"
                          maxLength={255}
                          className={inputClass}
                          placeholder="Vul je e-mailadres in"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </label>
                      <label>
                        <span className={labelClass}>Land/regio*</span>
                        <select
                          required
                          className={inputClass}
                          value={country}
                          onChange={(e) => {
                            setCountry(e.target.value);
                            const c = countriesForSelect.find((x) => x.name === e.target.value);
                            if (c) setDial(c.dial);
                          }}
                        >
                          <option value="">Selecteer land/regio</option>
                          {countriesForSelect.map((c) => (
                            <option key={c.code} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div>
                        <span className={labelClass}>Telefoonnummer*</span>
                        <div className="flex gap-2">
                          <select
                            className={`${inputClass} w-32`}
                            value={dial}
                            onChange={(e) => setDial(e.target.value)}
                          >
                            {countriesForSelect.map((c) => (
                              <option key={c.code} value={c.dial}>
                                {c.code} +{c.dial}
                              </option>
                            ))}
                          </select>
                          <input
                            required
                            type="tel"
                            pattern="[0-9\s\-\+\/\.]{5,}"
                            title="Vul een geldig telefoonnummer in"
                            className={inputClass}
                            placeholder="Vul een geldig telefoonnummer in"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <label className="flex items-start gap-3 mt-6 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-accent"
                        checked={digitalConfirmation}
                        onChange={(e) => setDigitalConfirmation(e.target.checked)}
                      />
                      <span>
                        Ja, ik wil graag een gratis digitale bevestiging (aanbevolen)
                        <span className="block text-xs text-muted-foreground">
                          We sturen je een sms met de bevestiging en praktische info.
                        </span>
                      </span>
                    </label>

                    <div className="grid sm:grid-cols-2 gap-6 mt-8">
                      <div>
                        <p className="text-sm font-medium mb-2">
                          Voor wie maak je deze boeking?{" "}
                          <span className="text-muted-foreground font-normal">(optioneel)</span>
                        </p>
                        <div className="space-y-2 text-sm">
                          {[
                            { v: "self", l: "Ik ben de hoofdgast" },
                            { v: "other", l: "Boeking voor iemand anders" },
                          ].map((o) => (
                            <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="bookingFor"
                                className="accent-accent"
                                checked={bookingFor === o.v}
                                onChange={() => setBookingFor(o.v as "self" | "other")}
                              />
                              {o.l}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">
                          Reis je voor werk?{" "}
                          <span className="text-muted-foreground font-normal">(optioneel)</span>
                        </p>
                        <div className="space-y-2 text-sm">
                          {[
                            { v: true, l: "Ja" },
                            { v: false, l: "Nee" },
                          ].map((o) => (
                            <label
                              key={String(o.v)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="businessTrip"
                                className="accent-accent"
                                checked={businessTrip === o.v}
                                onChange={() => setBusinessTrip(o.v)}
                              />
                              {o.l}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="border border-foreground/12 rounded-2xl p-6">
                    <h2 className="font-serif text-xl mb-4">Voeg toe aan je verblijf</h2>
                    <label className="flex items-start gap-3 text-sm cursor-pointer mb-4">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-accent"
                        checked={carRental}
                        onChange={(e) => setCarRental(e.target.checked)}
                      />
                      <span>
                        Ik heb interesse in het huren van een auto
                        <span className="block text-xs text-muted-foreground">
                          We zetten de opties voor autoverhuur in je boekingsbevestiging.
                        </span>
                      </span>
                    </label>
                    <label className="flex items-start gap-3 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-accent"
                        checked={transfer}
                        onChange={(e) => setTransfer(e.target.checked)}
                      />
                      <span>
                        Ik wil alvast een taxi of pendelbus reserveren
                        <span className="block text-xs text-muted-foreground">
                          Reis zonder verrassingen van de luchthaven naar de woning.
                        </span>
                      </span>
                    </label>
                  </section>

                  <section className="border border-foreground/12 rounded-2xl p-6">
                    <h2 className="font-serif text-xl mb-2">Speciale verzoeken</h2>
                    <p className="text-xs text-muted-foreground mb-3">
                      Speciale verzoeken kunnen we niet garanderen, maar we doen ons best. Je kan
                      ook later nog een verzoek doorgeven.
                    </p>
                    <textarea
                      rows={4}
                      maxLength={1000}
                      className={`${inputClass} resize-none`}
                      placeholder="Schrijf hier je verzoeken (optioneel)"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    />

                    <h3 className="font-serif text-xl mt-8 mb-1">Je aankomsttijd</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Je kan inchecken vanaf 16:00. Tijd in de tijdzone van Tongeren.
                    </p>
                    <select
                      className={`${inputClass} max-w-xs`}
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                    >
                      <option value="">Selecteer verwachte aankomsttijd (optioneel)</option>
                      {arrivalTimeSlots.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </section>

                  <section className="border border-foreground/12 rounded-2xl p-6">
                    <h2 className="font-serif text-xl mb-2">Lees de huisregels</h2>
                    <p className="text-sm text-muted-foreground mb-3">
                      We vragen je akkoord te gaan met de volgende huisregels:
                    </p>
                    <ul className="text-sm space-y-1.5 mb-4">
                      {houseRules.map((r) => (
                        <li key={r} className="flex gap-2">
                          <span className="text-accent">·</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground">
                      Door verder te gaan naar de volgende stap, ga je akkoord met deze huisregels
                      en met de{" "}
                      <a
                        href="/huisregels-horse-vally.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        volledige huisregels en algemene voorwaarden (PDF)
                      </a>
                      .
                    </p>
                  </section>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <button
                    type="submit"
                    className="bg-accent text-background px-8 py-3.5 rounded-lg text-sm font-medium hover:brightness-95 transition-all"
                  >
                    Volgende stap
                  </button>
                </form>
              )}

              {/* ---------- Stap 2 ---------- */}
              {step === 2 && (
                <section className="border border-foreground/12 rounded-2xl p-6 space-y-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Stap 2 — Annuleringskostenverzekering
                  </p>
                  <h2 className="font-serif text-2xl">Dekking tot het inchecken</h2>
                  <p className="text-sm text-muted-foreground">
                    Verzeker je verblijfskosten van {euro(stayTotal)} voor slechts{" "}
                    {euro(insuranceAmount)}. Annuleer je om een gedekte reden, dan worden je
                    verblijfskosten terugbetaald.
                  </p>
                  <ul className="text-sm space-y-1.5 text-muted-foreground">
                    <li>
                      · Dekt annulering door letsel, ziekte, ontslag, natuurrampen, noodsituaties
                      thuis of reisvertraging
                    </li>
                    <li>
                      · Dekt annulering wanneer het hoofddoel van je reis (vooraf geboekt evenement)
                      afgelast of uitgesteld wordt
                    </li>
                    <li>
                      · Niet gedekt: bestaande medische aandoeningen of gewijzigde reisbeperkingen
                    </li>
                  </ul>
                  <label className="flex items-start gap-3 text-sm cursor-pointer border-t border-foreground/10 pt-4">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-accent"
                      checked={insurance}
                      onChange={(e) => setInsurance(e.target.checked)}
                    />
                    <span>
                      Verzekering toevoegen — {euro(insuranceAmount)} verzekeringskosten (incl.
                      assurantiebelasting)
                      <span className="block text-xs text-muted-foreground mt-1">
                        Ik bevestig dat ik ouder ben dan 18 jaar en in België woon, en dat ik de
                        verzekeringsvoorwaarden gelezen en aanvaard heb.
                      </span>
                    </span>
                  </label>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3 rounded-lg text-sm border border-foreground/20"
                    >
                      Terug
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(3);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="bg-accent text-background px-8 py-3 rounded-lg text-sm font-medium hover:brightness-95 transition-all"
                    >
                      {insurance ? "Verzekering toevoegen en verder" : "Verder zonder verzekering"}
                    </button>
                  </div>
                </section>
              )}

              {/* ---------- Stap 3 ---------- */}
              {step === 3 && (
                <section className="border border-foreground/12 rounded-2xl p-6 space-y-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Stap 3 — Betalen
                  </p>
                  <h2 className="font-serif text-2xl">Hoe wil je betalen?</h2>
                  <div className="space-y-2 text-sm">
                    {[
                      { v: "card", l: "Kredietkaart (Visa / Mastercard)" },
                      { v: "bancontact", l: "Bancontact" },
                      { v: "transfer", l: "Overschrijving (betaalinstructies per e-mail)" },
                    ].map((o) => (
                      <label
                        key={o.v}
                        className="flex items-center gap-3 border border-foreground/12 rounded-lg px-4 py-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="payment"
                          className="accent-accent"
                          checked={payment === o.v}
                          onChange={() => setPayment(o.v as typeof payment)}
                        />
                        {o.l}
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Je boeking is rechtstreeks bij {property?.name ?? "Horsey Valley"}. Door te
                    boeken ga je akkoord met de boekingsvoorwaarden, de huisregels en het
                    privacybeleid. Het herroepingsrecht op grond van de Europese
                    consumentenwetgeving is niet van toepassing bij het boeken van een accommodatie.
                  </p>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3 rounded-lg text-sm border border-foreground/20"
                    >
                      Terug
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleSubmit}
                      className="bg-accent text-background px-8 py-3 rounded-lg text-sm font-medium hover:brightness-95 transition-all disabled:opacity-60"
                    >
                      {submitting ? "Bezig..." : "Boeken en betalen"}
                    </button>
                  </div>
                </section>
              )}
            </div>

            {/* Samenvatting */}
            <aside className="border border-foreground/12 rounded-2xl p-6 lg:sticky lg:top-28 space-y-4">
              <h2 className="font-serif text-xl">{property?.name ?? "Horsey Valley"}</h2>
              <p className="text-xs text-muted-foreground">
                Vakantiehuis met 4 slaapkamers · je hebt de hele woning voor jezelf
              </p>
              <dl className="text-sm space-y-2 border-t border-foreground/10 pt-4">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Aankomst</dt>
                  <dd>{formatNL(search.aankomst)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Vertrek</dt>
                  <dd>{formatNL(search.vertrek)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Nachten</dt>
                  <dd>{nights || "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Gasten</dt>
                  <dd>{guests}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Check-in</dt>
                  <dd>vanaf 16:00</dd>
                </div>
              </dl>
              <div className="border-t border-foreground/10 pt-4 text-sm space-y-2">
                {stayTotal > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Verblijfskosten</span>
                    <span>{euro(stayTotal)}</span>
                  </div>
                )}
                {insurance && (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Annuleringsverzekering</span>
                    <span>{euro(insuranceAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between gap-4 font-medium text-base pt-2">
                  <span>Totaal</span>
                  <span>{grandTotal > 0 ? euro(grandTotal) : "Op aanvraag"}</span>
                </div>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 border-t border-foreground/10 pt-4">
                <li>· Roken niet toegestaan</li>
                <li>· Geen feesten of bijeenkomsten</li>
                <li>· Stilte tussen 22:00 en 08:00</li>
                <li>· Geen huisdieren</li>
              </ul>
            </aside>
          </div>
        )}
      </main>

      <Footer contactEmail={property?.contact_email ?? "hallo@horsevally.be"} />
    </div>
  );
}
