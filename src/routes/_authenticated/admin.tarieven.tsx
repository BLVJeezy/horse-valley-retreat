import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { updateSettings, createSeasonalRate, deleteSeasonalRate } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";

export const Route = createFileRoute("/_authenticated/admin/tarieven")({
  component: TarievenPage,
});

type Settings = {
  base_price_per_night: number;
  cleaning_fee: number;
  tourist_tax_per_person_per_night: number;
  security_deposit: number;
  default_min_nights: number;
};

type Season = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  price_per_night: number;
  min_nights: number | null;
};

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}
function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("nl-BE", { day: "numeric", month: "short", year: "numeric" });
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);
  return isDesktop;
}

function TarievenPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [saving, setSaving] = useState(false);
  const save = useServerFn(updateSettings);
  const addSeason = useServerFn(createSeasonalRate);
  const rmSeason = useServerFn(deleteSeasonalRate);
  const isDesktop = useIsDesktop();

  // Season form
  const [sName, setSName] = useState("");
  const [sRange, setSRange] = useState<DateRange | undefined>();
  const [sPrice, setSPrice] = useState("");
  const [sMin, setSMin] = useState("");

  async function refresh() {
    const [{ data: s }, { data: sr }] = await Promise.all([
      supabase.from("settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("seasonal_rates").select("*").order("start_date"),
    ]);
    if (s)
      setSettings({
        base_price_per_night: Number(s.base_price_per_night),
        cleaning_fee: Number(s.cleaning_fee),
        tourist_tax_per_person_per_night: Number(s.tourist_tax_per_person_per_night),
        security_deposit: Number(s.security_deposit),
        default_min_nights: s.default_min_nights,
      });
    setSeasons((sr as any[])?.map((r) => ({ ...r, price_per_night: Number(r.price_per_night) })) ?? []);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await save({ data: settings });
      toast.success("Instellingen bewaard");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function onAddSeason(e: React.FormEvent) {
    e.preventDefault();
    if (!sRange?.from || !sRange?.to || !sName || !sPrice) {
      toast.error("Vul alle velden in");
      return;
    }
    try {
      await addSeason({
        data: {
          name: sName,
          start_date: fmtDate(sRange.from),
          end_date: fmtDate(sRange.to),
          price_per_night: Number(sPrice),
          min_nights: sMin ? Number(sMin) : null,
        },
      });
      toast.success("Seizoen toegevoegd");
      setSName("");
      setSRange(undefined);
      setSPrice("");
      setSMin("");
      await refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function onDeleteSeason(id: string) {
    try {
      await rmSeason({ data: { id } });
      toast.success("Verwijderd");
      await refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  if (!settings) return <p className="text-sm text-muted-foreground">Laden…</p>;

  const bind = (k: keyof Settings) => ({
    value: settings[k].toString(),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setSettings({ ...settings, [k]: Number(e.target.value) || 0 }),
  });

  return (
    <div className="space-y-12">
      <section>
        <h1 className="font-display text-3xl mb-2">Basistarief & vaste kosten</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Het basistarief geldt voor elke nacht die niet binnen een seizoen valt.
        </p>
        <form onSubmit={onSaveSettings} className="grid gap-5 rounded-2xl border border-border bg-card p-6 md:grid-cols-2">
          <div>
            <Label>Basistarief per nacht (€)</Label>
            <Input type="number" step="0.01" min="0" {...bind("base_price_per_night")} />
          </div>
          <div>
            <Label>Schoonmaakkosten (€ per boeking)</Label>
            <Input type="number" step="0.01" min="0" {...bind("cleaning_fee")} />
          </div>
          <div>
            <Label>Toeristenbelasting (€ per persoon per nacht)</Label>
            <Input type="number" step="0.01" min="0" {...bind("tourist_tax_per_person_per_night")} />
          </div>
          <div>
            <Label>Borg (€ per boeking)</Label>
            <Input type="number" step="0.01" min="0" {...bind("security_deposit")} />
          </div>
          <div>
            <Label>Standaard minimum nachten</Label>
            <Input type="number" step="1" min="1" max="30" {...bind("default_min_nights")} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={saving} className="w-full md:w-auto min-h-[44px]">
              {saving ? "Bewaren…" : "Bewaar instellingen"}
            </Button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-2">Seizoensprijzen</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Voeg periodes toe met een afwijkende nachtprijs (bv. zomer, kerstvakantie). Overlapt met
          het basistarief.
        </p>

        <form onSubmit={onAddSeason} className="grid gap-4 rounded-2xl border border-border bg-card p-6 md:grid-cols-5 md:items-end">
          <div className="md:col-span-2">
            <Label>Naam</Label>
            <Input placeholder="Zomer 2026" value={sName} onChange={(e) => setSName(e.target.value)} />
          </div>
          <div>
            <Label>Periode</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="w-full justify-start font-normal min-h-[44px]">
                  {sRange?.from && sRange?.to
                    ? `${fmt(sRange.from.toISOString())} → ${fmt(sRange.to.toISOString())}`
                    : "Kies periode"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={sRange}
                  onSelect={setSRange}
                  numberOfMonths={isDesktop ? 2 : 1}
                  className="pointer-events-auto p-3"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>Prijs / nacht (€)</Label>
            <Input type="number" step="0.01" min="0" value={sPrice} onChange={(e) => setSPrice(e.target.value)} />
          </div>
          <div>
            <Label>Min. nachten</Label>
            <Input type="number" step="1" min="1" max="30" placeholder="optioneel" value={sMin} onChange={(e) => setSMin(e.target.value)} />
          </div>
          <div className="md:col-span-5 flex justify-end">
            <Button type="submit" className="w-full md:w-auto min-h-[44px]">Seizoen toevoegen</Button>
          </div>
        </form>

        <div className="mt-6">
          {seasons.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground rounded-2xl border border-border bg-card">
              Nog geen seizoenen ingesteld.
            </p>
          ) : (
            <>
              {/* Mobile: stacked cards, no horizontal scroll */}
              <ul className="md:hidden space-y-2">
                {seasons.map((s) => (
                  <li key={s.id} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {fmt(s.start_date)} → {fmt(s.end_date)}
                        </p>
                      </div>
                      <button
                        onClick={() => onDeleteSeason(s.id)}
                        className="shrink-0 rounded-full px-3 py-2 min-h-[40px] text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                      >
                        Verwijderen
                      </button>
                    </div>
                    <div className="mt-3 flex gap-4 text-sm">
                      <span>€ {s.price_per_night.toFixed(2)} / nacht</span>
                      <span className="text-muted-foreground">
                        Min. {s.min_nights ?? "—"} nachten
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Desktop: table */}
              <table className="hidden md:table w-full text-sm rounded-2xl border border-border bg-card overflow-hidden">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Naam</th>
                    <th className="px-4 py-3">Periode</th>
                    <th className="px-4 py-3">Prijs / nacht</th>
                    <th className="px-4 py-3">Min. nachten</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {seasons.map((s) => (
                    <tr key={s.id} className="border-t border-border">
                      <td className="px-4 py-3">{s.name}</td>
                      <td className="px-4 py-3">
                        {fmt(s.start_date)} → {fmt(s.end_date)}
                      </td>
                      <td className="px-4 py-3">€ {s.price_per_night.toFixed(2)}</td>
                      <td className="px-4 py-3">{s.min_nights ?? "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onDeleteSeason(s.id)}
                          className="text-xs text-muted-foreground hover:text-destructive"
                        >
                          Verwijderen
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
