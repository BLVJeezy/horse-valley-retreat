import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAvailabilityBlocks, submitBookingRequest } from "@/lib/booking.functions";

/** True if [aStart, aEnd) overlaps [bStart, bEnd), using YYYY-MM-DD string comparison. */
function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return aStart < bEnd && aEnd > bStart;
}

function formatNL(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

function DateField({
  label,
  value,
  min,
  onChange,
  className,
}: {
  label: string;
  value: string;
  min?: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const open = () => {
    const el = ref.current;
    if (!el) return;
    // showPicker is supported on modern mobile browsers
    if (typeof (el as HTMLInputElement & { showPicker?: () => void }).showPicker === "function") {
      (el as HTMLInputElement & { showPicker: () => void }).showPicker();
    } else {
      el.focus();
      el.click();
    }
  };

  return (
    <label
      className={`relative flex-1 px-4 py-3 cursor-pointer ${className ?? ""}`}
      onClick={(e) => {
        e.preventDefault();
        open();
      }}
    >
      <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
        {label}
      </span>
      <span className={`block text-sm font-medium ${value ? "text-foreground" : "text-muted-foreground/70"}`}>
        {value ? formatNL(value) : "dd-mm-jjjj"}
      </span>
      <input
        ref={ref}
        type="date"
        min={min}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label={label}
      />
    </label>
  );
}

type Step = "dates" | "details" | "sent";

export function BookingWidget() {
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(4);
  const [step, setStep] = useState<Step>("dates");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const { data: blocks } = useQuery({
    queryKey: ["availability-blocks"],
    queryFn: () => getAvailabilityBlocks(),
    staleTime: 5 * 60 * 1000,
  });

  const isRangeAvailable = (start: string, end: string) => {
    if (!start || !end) return true;
    return !(blocks ?? []).some((b) => rangesOverlap(start, end, b.start_date, b.end_date));
  };

  const available = isRangeAvailable(checkin, checkout);

  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkin || !checkout) return;
    if (!available) {
      setError("Deze data zijn helaas niet beschikbaar. Probeer een andere periode.");
      return;
    }
    setError(null);
    setStep("details");
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="bg-white/95 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-4xl text-foreground">
        <p className="font-medium mb-1">Aanvraag verstuurd, bedankt {name.split(" ")[0]}!</p>
        <p className="text-sm text-muted-foreground">
          We bevestigen jouw aanvraag voor {formatNL(checkin)} t/m {formatNL(checkout)} zo snel mogelijk per e-mail.
        </p>
      </div>
    );
  }

  if (step === "details") {
    return (
      <form
        onSubmit={handleSubmitRequest}
        className="bg-white/95 backdrop-blur-md p-4 md:p-5 rounded-xl shadow-2xl max-w-md text-foreground space-y-3"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {formatNL(checkin)} → {formatNL(checkout)} · {guests} {guests === 1 ? "gast" : "gasten"}
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
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
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

  return (
    <form
      onSubmit={handleCheckAvailability}
      className="bg-white/95 backdrop-blur-md p-2 md:p-3 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-4xl text-foreground"
    >
      <DateField
        label="Aankomst"
        value={checkin}
        min={today}
        onChange={(v) => {
          setCheckin(v);
          setError(null);
        }}
        className="md:border-r border-black/5"
      />
      <DateField
        label="Vertrek"
        value={checkout}
        min={checkin || today}
        onChange={(v) => {
          setCheckout(v);
          setError(null);
        }}
        className="md:border-r border-black/5"
      />
      <label className="flex-1 px-4 py-3 cursor-pointer">
        <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Gasten</span>
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
        className="bg-accent text-white px-8 py-4 rounded-lg text-sm font-medium hover:brightness-95 transition-all"
      >
        Bekijk beschikbaarheid
      </button>
      {error && <p className="text-xs text-red-600 px-2 md:px-0 md:absolute md:-bottom-6">{error}</p>}
    </form>
  );
}
