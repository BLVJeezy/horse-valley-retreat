import { useState } from "react";

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
      <label className="flex-1 px-4 py-3 md:border-r border-black/5 cursor-pointer">
        <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Aankomst</span>
        <input
          type="date"
          min={today}
          required
          value={checkin}
          onChange={(e) => setCheckin(e.target.value)}
          className="w-full bg-transparent text-sm font-medium outline-none"
        />
      </label>
      <label className="flex-1 px-4 py-3 md:border-r border-black/5 cursor-pointer">
        <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Vertrek</span>
        <input
          type="date"
          min={checkin || today}
          required
          value={checkout}
          onChange={(e) => setCheckout(e.target.value)}
          className="w-full bg-transparent text-sm font-medium outline-none"
        />
      </label>
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
