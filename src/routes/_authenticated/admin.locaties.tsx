import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { listProperties, setPropertyLive } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/locaties")({
  component: LocatiesPage,
});

type Property = {
  id: string;
  slug: string;
  name: string;
  is_live: boolean;
  mirror_photos: boolean;
};

function LocatiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const getProperties = useServerFn(listProperties);
  const toggleLive = useServerFn(setPropertyLive);

  async function refresh() {
    try {
      setProperties((await getProperties()) as Property[]);
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onToggle(p: Property) {
    setBusyId(p.id);
    try {
      await toggleLive({ data: { id: p.id, is_live: !p.is_live } });
      toast.success(!p.is_live ? `${p.name} staat nu live` : `${p.name} staat nu offline`);
      await refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-2">Locaties</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Zet een woning live om ze publiek zichtbaar te maken op de website (bv. /{properties[0]?.slug ?? "slug"}).
        Offline toont bezoekers een "binnenkort"-pagina in plaats van de volledige site.
      </p>

      {properties.length === 0 ? (
        <p className="text-sm text-muted-foreground">Geen locaties gevonden.</p>
      ) : (
        <ul className="space-y-2">
          {properties.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-4"
            >
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  /{p.slug}
                  {p.mirror_photos ? " · foto's gespiegeld" : ""}
                </p>
              </div>
              <button
                onClick={() => onToggle(p)}
                disabled={busyId === p.id}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wide transition-colors disabled:opacity-60 ${
                  p.is_live
                    ? "bg-accent text-white hover:brightness-95"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {p.is_live ? "Live" : "Offline"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
