import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { createBlock, deleteBlock } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";

type Block = { id: string; start_date: string; end_date: string; source: string; guest_name: string | null };

const SOURCE_LABELS: Record<string, string> = {
  manual: "Manueel",
  website: "Website",
  airbnb: "Airbnb",
  booking: "Booking.com",
  launchpad: "Launchpad",
  other: "Extern",
};

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AvailabilityPage,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" });
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

function AvailabilityPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [range, setRange] = useState<DateRange | undefined>();
  const [loading, setLoading] = useState(false);
  const addBlock = useServerFn(createBlock);
  const rmBlock = useServerFn(deleteBlock);
  const isDesktop = useIsDesktop();

  async function refresh() {
    const { data, error } = await supabase
      .from("availability_blocks")
      .select("id, start_date, end_date, source, guest_name")
      .order("start_date", { ascending: true });
    if (error) toast.error(error.message);
    else setBlocks(data ?? []);
  }

  useEffect(() => {
    refresh();
  }, []);

  // Turn blocks into disabled matcher for the calendar
  const blockedRanges = blocks.map((b) => ({ from: new Date(b.start_date), to: new Date(b.end_date) }));

  async function onBlock() {
    if (!range?.from || !range?.to) {
      toast.error("Kies een periode");
      return;
    }
    setLoading(true);
    try {
      await addBlock({
        data: {
          start_date: range.from.toISOString().slice(0, 10),
          end_date: range.to.toISOString().slice(0, 10),
        },
      });
      toast.success("Periode geblokkeerd");
      setRange(undefined);
      await refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function onUnblock(id: string) {
    try {
      await rmBlock({ data: { id } });
      toast.success("Blokkade verwijderd");
      await refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_360px]">
      <section>
        <h1 className="font-display text-3xl mb-2">Beschikbaarheid</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Selecteer een periode om deze te blokkeren (bv. eigen gebruik of onderhoud). Gasten kunnen
          geblokkeerde datums niet boeken.
        </p>
        <div className="rounded-2xl border border-border bg-card p-3 md:p-4">
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={isDesktop ? 2 : 1}
            disabled={blockedRanges}
            className="pointer-events-auto mx-auto"
          />
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              {range?.from && range?.to
                ? `${formatDate(range.from.toISOString())} → ${formatDate(range.to.toISOString())}`
                : "Nog geen periode geselecteerd"}
            </p>
            <Button onClick={onBlock} disabled={loading || !range?.from || !range?.to} className="w-full md:w-auto min-h-[44px]">
              Periode blokkeren
            </Button>
          </div>
        </div>
      </section>

      <aside>
        <h2 className="font-display text-xl mb-3">Geblokkeerde periodes</h2>
        {blocks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Geen blokkades ingesteld.</p>
        ) : (
          <ul className="space-y-2">
            {blocks.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm"
              >
                <div>
                  <span className="block">
                    {formatDate(b.start_date)} → {formatDate(b.end_date)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {SOURCE_LABELS[b.source] ?? b.source}
                    {b.guest_name ? ` · ${b.guest_name}` : ""}
                  </span>
                </div>
                {b.source === "manual" ? (
                  <button
                    onClick={() => onUnblock(b.id)}
                    className="shrink-0 rounded-full px-3 py-2 min-h-[40px] text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                  >
                    Verwijderen
                  </button>
                ) : (
                  <span className="text-[10px] text-muted-foreground shrink-0" title="Wijzig dit op de bron zelf (Airbnb, Booking.com, website-aanvraag of volgende sync)">
                    gesynced
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
