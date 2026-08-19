import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { DateRange } from "react-day-picker";
import { nl } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { getAvailabilityBlocks, submitBookingRequest } from "@/lib/booking.functions";

/** True if [aStart, aEnd) overlaps [bStart, bEnd), using YYYY-MM-DD string comparison. */
function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return aStart < bEnd && aEnd > bStart;
}

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromISO(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatNL(d?: Date) {
  if (!d) return "";
  return d.toLocaleDateString("nl-BE", { day: "2-digit", month: "short", year: "numeric" });
}

function nightsBetween(from?: Date, to?: Date) {
  if (!from || !to) return 0;
  return Math.max(0, Math.round((to.getTime() - from.getTime()) / 86400000));
}

type Step = "dates" | "details" | "sent";

export function BookingWidget({
  pricePerNight,
  slug = "horse-vally",
  selectionLabel,
}: {
  pricePerNight?: number | null;
  slug?: string;
  /** Naam van de gekozen woning, gebruikt in het label van de CTA. */
  selectionLabel?: string;
}) {
  const navigate = useNavigate();
  const [range, setRange] = useState<DateRange | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [focus, setFocus] = useState<"from" | "to">("from");
  const [guests, setGuests] = useState(4);
  const [step, setStep] = useState<Step>("dates");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const { data: blocks } = useQuery({
    queryKey: ["availability-blocks"],
    queryFn: () => getAvailabilityBlocks(),
    staleTime: 5 * 60 * 1000,
  });

  // Airbnb-style: unavailable nights are simply not clickable.
  const disabled = useMemo(() => {
    const ranges = (blocks ?? []).map((b) => ({
      from: fromISO(b.start_date),
      to: new Date(fromISO(b.end_date).getTime() - 86400000),
    }));
    return [{ before: today }, ...ranges];
  }, [blocks, today]);

  const checkin = range?.from ? toISO(range.from) : "";
  const checkout = range?.to ? toISO(range.to) : "";
  const nights = nightsBetween(range?.from, range?.to);

  const available =
    !checkin ||
    !checkout ||
    !(blocks ?? []).some((b) => rangesOverlap(checkin, checkout, b.start_date, b.end_date));

  // Close the calendar panel on outside click / Escape, like Airbnb's picker.
  useEffect(() => {
    if (!calendarOpen) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setCalendarOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCalendarOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [calendarOpen]);

  const openCalendar = (which: "from" | "to") => {
    setFocus(which);
    setCalendarOpen(true);
    setError(null);
  };

  const handleSelect = (next: DateRange | undefined) => {
    setRange(next);
    setError(null);
    if (next?.from && !next.to) setFocus("to");
    if (next?.from && next.to) {
      setFocus("from");
      // Small delay so the selection is visible before the panel closes.
      window.setTimeout(() => setCalendarOpen(false), 220);
    }
  };

  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!range?.from || !range?.to) {
      openCalendar(range?.from ? "to" : "from");
      setError("Kies een aankomst- en vertrekdatum.");
      return;
    }
    if (!available) {
      setError("Deze data zijn helaas niet beschikbaar. Probeer een andere periode.");
      return;
    }
    setError(null);
    navigate({
      to: "/boeken",
      search: { woning: slug, aankomst: checkin, vertrek: checkout, gasten: guests },
    });
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError("Je moet de huisregels en algemene voorwaarden accepteren.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitBookingRequest({
        data: {
          start_date: checkin,
          end_date: checkout,
          guests,
          guest_name: name,
          guest_email: email,
          guest_phone: phone || undefined,
          message: message || undefined,
        },
      });
      setStep("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "sent") {
    return (
      <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-4xl text-foreground">
        <p className="font-medium mb-1">Aanvraag verstuurd, bedankt {name.split(" ")[0]}!</p>
        <p className="text-sm text-muted-foreground">
          We bevestigen jouw aanvraag voor {formatNL(range?.from)} — {formatNL(range?.to)} zo snel
          mogelijk per e-mail.
        </p>
      </div>
    );
  }

  if (step === "details") {
    return (
      <form
        onSubmit={handleSubmitRequest}
        className="bg-white/95 backdrop-blur-md p-4 md:p-5 rounded-2xl shadow-2xl max-w-md text-foreground space-y-3"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {formatNL(range?.from)} → {formatNL(range?.to)} · {nights}{" "}
            {nights === 1 ? "nacht" : "nachten"} · {guests} {guests === 1 ? "gast" : "gasten"}
          </p>
          <button
            type="button"
            onClick={() => setStep("dates")}
            className="text-xs text-muted-foreground underline"
          >
            wijzig
          </button>
        </div>
        <input
          required
          placeholder="Naam"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <input
          required
          type="email"
          placeholder="E-mailadres"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <input
          placeholder="Telefoon (optioneel)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <textarea
          placeholder="Bericht (optioneel)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent resize-none"
        />
        <label className="flex items-start gap-2.5 text-[11px] leading-snug text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            required
            checked={acceptedTerms}
            onChange={(e) => {
              setAcceptedTerms(e.target.checked);
              if (e.target.checked) setError(null);
            }}
            className="mt-0.5 h-4 w-4 shrink-0 accent-accent cursor-pointer"
          />
          <span>
            Ik heb de{" "}
            <a
              href="/huisregels-horse-vally.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-foreground"
            >
              huisregels en algemene voorwaarden (PDF)
            </a>{" "}
            gelezen en accepteer deze.
          </span>
        </label>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !acceptedTerms}
          className="w-full bg-accent text-white px-6 py-3 rounded-lg text-sm font-medium hover:brightness-95 transition-all disabled:opacity-60"
        >
          {submitting ? "Versturen..." : "Aanvraag versturen"}
        </button>
        <p className="text-[11px] text-muted-foreground">
          Dit is een aanvraag, geen directe boeking. We bevestigen persoonlijk per e-mail.
        </p>
      </form>
    );
  }

  const total = pricePerNight && nights ? pricePerNight * nights : null;

  return (
    <div ref={wrapRef} className="relative max-w-4xl">
      <form
        onSubmit={handleCheckAvailability}
        className="bg-white/95 backdrop-blur-md p-2 md:p-3 rounded-2xl shadow-2xl flex flex-col md:flex-row md:items-stretch gap-2 text-foreground"
      >
        <button
          type="button"
          onClick={() => openCalendar("from")}
          className={`flex-1 text-left px-4 py-3 rounded-xl transition-colors md:border-r border-black/5 ${
            calendarOpen && focus === "from" ? "bg-black/[0.04]" : "hover:bg-black/[0.03]"
          }`}
        >
          <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Aankomst
          </span>
          <span
            className={`block text-sm font-medium ${range?.from ? "text-foreground" : "text-muted-foreground/70"}`}
          >
            {range?.from ? formatNL(range.from) : "Kies datum"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => openCalendar("to")}
          className={`flex-1 text-left px-4 py-3 rounded-xl transition-colors md:border-r border-black/5 ${
            calendarOpen && focus === "to" ? "bg-black/[0.04]" : "hover:bg-black/[0.03]"
          }`}
        >
          <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Vertrek
          </span>
          <span
            className={`block text-sm font-medium ${range?.to ? "text-foreground" : "text-muted-foreground/70"}`}
          >
            {range?.to ? formatNL(range.to) : "Kies datum"}
          </span>
        </button>

        <label className="flex-1 px-4 py-3 cursor-pointer rounded-xl hover:bg-black/[0.03] transition-colors">
          <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Gasten
          </span>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full bg-transparent text-sm font-medium outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "gast" : "gasten"}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="bg-accent text-white px-8 py-4 rounded-xl text-sm font-medium hover:brightness-95 transition-all"
        >
          {selectionLabel ? `Ga verder naar boeking voor ${selectionLabel}` : "Bekijk beschikbaarheid"}
        </button>
      </form>

      {calendarOpen && (
        <div className="absolute left-0 bottom-full mb-2 z-50 w-full md:w-auto rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 p-3 md:p-4">
          <div className="flex items-center justify-between px-1 pb-2">
            <div>
              <p className="text-sm font-medium text-foreground">
                {nights > 0
                  ? `${nights} ${nights === 1 ? "nacht" : "nachten"}`
                  : "Selecteer je data"}
              </p>
              <p className="text-xs text-muted-foreground">
                {range?.from
                  ? `${formatNL(range.from)}${range.to ? ` — ${formatNL(range.to)}` : ""}`
                  : "Aankomst — vertrek"}
              </p>
            </div>
            {range?.from && (
              <button
                type="button"
                onClick={() => {
                  setRange(undefined);
                  setFocus("from");
                }}
                className="text-xs text-muted-foreground underline"
              >
                wissen
              </button>
            )}
          </div>

          <Calendar
            mode="range"
            selected={range}
            onSelect={handleSelect}
            disabled={disabled}
            excludeDisabled
            numberOfMonths={1}
            defaultMonth={range?.from ?? today}
            locale={nl}
            showOutsideDays={false}
            className="p-0 w-full md:hidden"
          />
          <Calendar
            mode="range"
            selected={range}
            onSelect={handleSelect}
            disabled={disabled}
            excludeDisabled
            numberOfMonths={2}
            defaultMonth={range?.from ?? today}
            locale={nl}
            showOutsideDays={false}
            className="p-0 hidden md:block"
          />

          <div className="flex items-center justify-between gap-3 pt-2 px-1">
            <p className="text-xs text-muted-foreground">
              {total
                ? `€${total} totaal · €${pricePerNight}/nacht`
                : "Bezette data zijn niet selecteerbaar."}
            </p>
            <button
              type="button"
              onClick={() => setCalendarOpen(false)}
              className="text-xs font-medium underline text-foreground"
            >
              Sluiten
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-600 md:text-white">{error}</p>}
    </div>
  );
}
