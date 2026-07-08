import { useRef, useState } from "react";

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

export function BookingWidget() {
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(4);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert(
          "De online kalender en betaling komen binnenkort online. Stuur ons voorlopig gerust een mailtje via de contactsectie."
        );
      }}
      className="bg-white/95 backdrop-blur-md p-2 md:p-3 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-4xl text-foreground"
    >
      <DateField
        label="Aankomst"
        value={checkin}
        min={today}
        onChange={setCheckin}
        className="md:border-r border-black/5"
      />
      <DateField
        label="Vertrek"
        value={checkout}
        min={checkin || today}
        onChange={setCheckout}
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
    </form>
  );
}
