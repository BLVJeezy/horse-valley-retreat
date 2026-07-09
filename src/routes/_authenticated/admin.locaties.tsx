import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { listProperties, setPropertyLive, updatePropertyDetails } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/locaties")({
  component: LocatiesPage,
});

type Property = {
  id: string;
  slug: string;
  name: string;
  is_live: boolean;
  mirror_photos: boolean;
  address: string | null;
  description: string | null;
  contact_email: string;
  price_per_night: number | null;
};

function LocatiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

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
        Offline toont bezoekers een "binnenkort"-pagina in plaats van de volledige site. Klik op een
        locatie om adres, beschrijving, contact en prijs te bewerken.
      </p>

      {properties.length === 0 ? (
        <p className="text-sm text-muted-foreground">Geen locaties gevonden.</p>
      ) : (
        <ul className="space-y-2">
          {properties.map((p) => (
            <li key={p.id} className="rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between gap-4 px-4 py-4">
                <button
                  className="flex-1 text-left"
                  onClick={() => setOpenId(openId === p.id ? null : p.id)}
                >
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    /{p.slug}
                    {p.mirror_photos ? " · foto's gespiegeld" : ""}
                    {p.price_per_night ? ` · €${p.price_per_night}/nacht` : ""}
                  </p>
                </button>
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
              </div>
              {openId === p.id && (
                <div className="border-t border-border px-4 py-4">
                  <PropertyDetailsForm property={p} onSaved={refresh} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PropertyDetailsForm({ property, onSaved }: { property: Property; onSaved: () => Promise<void> }) {
  const [name, setName] = useState(property.name);
  const [address, setAddress] = useState(property.address ?? "");
  const [description, setDescription] = useState(property.description ?? "");
  const [contactEmail, setContactEmail] = useState(property.contact_email);
  const [price, setPrice] = useState(property.price_per_night?.toString() ?? "");
  const [saving, setSaving] = useState(false);

  const saveDetails = useServerFn(updatePropertyDetails);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveDetails({
        data: {
          id: property.id,
          name,
          address: address || null,
          description: description || null,
          contact_email: contactEmail,
          price_per_night: price.trim() === "" ? null : Number(price),
        },
      });
      toast.success("Locatie bijgewerkt");
      await onSaved();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSave} className="space-y-3 max-w-lg">
      <div>
        <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1">Naam</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1">Adres / locatie</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="bv. Tongeren-Borgloon, Belgisch Limburg"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1">
          Beschrijving / hero-tekst
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none"
        />
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1">
            Contact e-mail
          </label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="w-40">
          <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1">
            Prijs/nacht (€)
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="standaardtarief"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Prijs leeg laten = gebruikt het algemene tarief uit "Tarieven & seizoenen".
      </p>
      <Button type="submit" disabled={saving} size="sm">
        {saving ? "Opslaan..." : "Opslaan"}
      </Button>
    </form>
  );
}
