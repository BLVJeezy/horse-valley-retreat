import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import {
  listIcalFeeds,
  createIcalFeed,
  updateIcalFeed,
  deleteIcalFeed,
  triggerIcalSync,
  listBookingRequests,
  confirmBookingRequest,
  declineBookingRequest,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/kalendersync")({
  component: KalenderSyncPage,
});

type Feed = {
  id: string;
  source: string;
  label: string;
  ical_url: string;
  is_active: boolean;
  last_synced_at: string | null;
  last_sync_status: string | null;
  last_sync_error: string | null;
};

type BookingRequest = {
  id: string;
  start_date: string;
  end_date: string;
  guests: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

const SOURCE_OPTIONS = [
  { value: "airbnb", label: "Airbnb" },
  { value: "booking", label: "Booking.com" },
  { value: "launchpad", label: "Launchpad" },
  { value: "other", label: "Andere" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" });
}

function KalenderSyncPage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [newSource, setNewSource] = useState("airbnb");
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const getFeeds = useServerFn(listIcalFeeds);
  const addFeed = useServerFn(createIcalFeed);
  const editFeed = useServerFn(updateIcalFeed);
  const rmFeed = useServerFn(deleteIcalFeed);
  const runSync = useServerFn(triggerIcalSync);
  const getRequests = useServerFn(listBookingRequests);
  const confirmReq = useServerFn(confirmBookingRequest);
  const declineReq = useServerFn(declineBookingRequest);

  async function refresh() {
    try {
      const [f, r] = await Promise.all([getFeeds(), getRequests()]);
      setFeeds(f as Feed[]);
      setRequests(r as BookingRequest[]);
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onAddFeed(e: React.FormEvent) {
    e.preventDefault();
    if (!newLabel.trim() || !newUrl.trim()) {
      toast.error("Vul label en iCal-URL in");
      return;
    }
    setSaving(true);
    try {
      await addFeed({ data: { source: newSource as any, label: newLabel, ical_url: newUrl } });
      toast.success("Kalender toegevoegd");
      setNewLabel("");
      setNewUrl("");
      await refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function onToggleActive(feed: Feed) {
    try {
      await editFeed({ data: { id: feed.id, is_active: !feed.is_active } });
      await refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function onDeleteFeed(id: string) {
    try {
      await rmFeed({ data: { id } });
      toast.success("Kalender verwijderd");
      await refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function onSyncNow() {
    setSyncing(true);
    try {
      await runSync();
      toast.success("Synchronisatie gestart");
      await refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSyncing(false);
    }
  }

  async function onConfirmRequest(id: string) {
    try {
      await confirmReq({ data: { id } });
      toast.success("Aanvraag bevestigd en geblokkeerd in kalender");
      await refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function onDeclineRequest(id: string) {
    try {
      await declineReq({ data: { id } });
      toast.success("Aanvraag geweigerd");
      await refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const pastRequests = requests.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-3xl">Kalendersync</h1>
          <Button onClick={onSyncNow} disabled={syncing} size="sm">
            {syncing ? "Bezig..." : "Nu synchroniseren"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Verbind de iCal-links van Airbnb, Booking.com en Launchpad. We halen de bezette dagen automatisch
          op (elke paar uur) en blokkeren ze hier. Een website-aanvraag blokkeert pas na jouw bevestiging
          hieronder — zo vermijden we dubbele boekingen tijdens de synctijd.
        </p>

        <form onSubmit={onAddFeed} className="rounded-2xl border border-border bg-card p-4 mb-6 flex flex-col md:flex-row gap-3">
          <select
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            className="rounded-md border border-border bg-background px-3 min-h-[44px] text-sm"
          >
            {SOURCE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <input
            placeholder="Label (bv. Airbnb - Horse Valley)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="flex-1 rounded-md border border-border bg-background px-3 min-h-[44px] text-sm"
          />
          <input
            placeholder="https://www.airbnb.com/calendar/ical/....ics"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="flex-[2] rounded-md border border-border bg-background px-3 min-h-[44px] text-sm"
          />
          <Button type="submit" disabled={saving} className="w-full md:w-auto min-h-[44px]">
            Toevoegen
          </Button>
        </form>

        {feeds.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nog geen kalenders gekoppeld.</p>
        ) : (
          <ul className="space-y-2 mb-8">
            {feeds.map((f) => (
              <li key={f.id} className="rounded-lg border border-border bg-card px-4 py-3 text-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-medium">{f.label}</span>{" "}
                    <span className="text-xs text-muted-foreground">
                      ({SOURCE_OPTIONS.find((o) => o.value === f.source)?.label ?? f.source})
                    </span>
                    <p className="text-xs text-muted-foreground truncate">{f.ical_url}</p>
                    <p className="text-xs mt-1">
                      {f.last_sync_status === "error" ? (
                        <span className="text-destructive">Laatste sync mislukt: {f.last_sync_error}</span>
                      ) : f.last_synced_at ? (
                        <span className="text-muted-foreground">
                          Laatst gesynced: {new Date(f.last_synced_at).toLocaleString("nl-BE")}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Nog niet gesynced</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onToggleActive(f)}
                      className="rounded-full px-3 py-2 min-h-[40px] text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {f.is_active ? "Actief" : "Gepauzeerd"}
                    </button>
                    <button
                      onClick={() => onDeleteFeed(f.id)}
                      className="rounded-full px-3 py-2 min-h-[40px] text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      Verwijderen
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Export-link voor Airbnb / Booking.com / Launchpad</p>
          <p className="mb-2">
            Voeg deze URL toe als "externe kalender" op elk platform, zodat website-boekingen ook daar
            geblokkeerd worden:
          </p>
          <ExportUrlCopyField />
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-2">Boekingsaanvragen</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Aanvragen via de website blokkeren de kalender pas na bevestiging hier.
        </p>

        {pendingRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground mb-6">Geen openstaande aanvragen.</p>
        ) : (
          <ul className="space-y-2 mb-8">
            {pendingRequests.map((r) => (
              <li key={r.id} className="rounded-lg border border-accent/40 bg-accent/5 px-4 py-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {formatDate(r.start_date)} → {formatDate(r.end_date)} · {r.guests}{" "}
                      {r.guests === 1 ? "gast" : "gasten"}
                    </p>
                    <p className="text-muted-foreground">
                      {r.guest_name} · {r.guest_email}
                      {r.guest_phone ? ` · ${r.guest_phone}` : ""}
                    </p>
                    {r.message && <p className="text-muted-foreground mt-1 italic">"{r.message}"</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" onClick={() => onConfirmRequest(r.id)}>
                      Bevestigen
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onDeclineRequest(r.id)}>
                      Weigeren
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {pastRequests.length > 0 && (
          <details>
            <summary className="text-sm text-muted-foreground cursor-pointer">
              Afgehandelde aanvragen ({pastRequests.length})
            </summary>
            <ul className="space-y-2 mt-3">
              {pastRequests.map((r) => (
                <li key={r.id} className="rounded-lg border border-border px-4 py-3 text-sm text-muted-foreground">
                  {formatDate(r.start_date)} → {formatDate(r.end_date)} · {r.guest_name} ·{" "}
                  <span className={r.status === "confirmed" ? "text-accent" : ""}>{r.status}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>
    </div>
  );
}

const EXPORT_URL = "https://hoaginjyaachoickqkno.supabase.co/functions/v1/ical-export";

function ExportUrlCopyField() {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(EXPORT_URL);
      setCopied(true);
      toast.success("Link gekopieerd");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Kopiëren lukte niet, selecteer de link handmatig");
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="w-full flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-3 min-h-[48px] text-left hover:border-accent transition-colors"
    >
      <code className="text-foreground text-[11px] break-all">{EXPORT_URL}</code>
      <span className="shrink-0 flex items-center gap-1.5 text-accent text-xs font-medium">
        {copied ? (
          <>
            <Check className="size-4" /> Gekopieerd
          </>
        ) : (
          <>
            <Copy className="size-4" /> Kopieer
          </>
        )}
      </span>
    </button>
  );
}
