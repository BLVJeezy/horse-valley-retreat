import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export function BookingWidget({
  slug = "horse-vally",
  selectionLabel,
  selected,
  onSelect,
  allProperties,
}: {
  pricePerNight?: number | null;
  slug?: string;
  selectionLabel?: string;
  selected?: string;
  onSelect?: (slug: string) => void;
  allProperties?: { slug: string; name: string; is_live: boolean }[];
}) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const options = useMemo(() => {
    if (!allProperties || allProperties.length < 2) return [];
    return [
      ...allProperties.map((p) => ({ slug: p.slug, name: p.name })),
      { slug: "beide", name: "Beide" },
    ];
  }, [allProperties]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const chosen = selected ?? slug;
    if (!chosen) {
      setError("Kies eerst een woning.");
      return;
    }
    navigate({
      to: "/boeken",
      search: { woning: chosen, gasten: 4 },
    });
  };

  return (
    <div className="relative max-w-4xl">
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 backdrop-blur-md p-2 md:p-3 rounded-2xl shadow-2xl flex flex-col md:flex-row md:items-stretch gap-2 text-foreground"
      >
        <div className="flex-1 grid grid-cols-3 gap-1 p-1">
          {options.map((p) => {
            const active = p.slug === selected;
            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => onSelect?.(p.slug)}
                className={`px-2 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "text-foreground hover:bg-black/[0.03]"
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        <button
          type="submit"
          className="bg-accent text-white px-6 py-4 rounded-xl text-sm font-medium hover:brightness-95 transition-all"
        >
          {selectionLabel ? `Ga verder naar boeking voor ${selectionLabel}` : "Ga verder naar boeking"}
        </button>
      </form>

      {error && <p className="mt-2 text-xs text-red-600 md:text-white">{error}</p>}
    </div>
  );
}
