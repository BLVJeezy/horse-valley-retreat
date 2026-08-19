import { useMemo } from "react";
import type { Beds24PropertyKey } from "@/components/site/Beds24Widget";

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

  const options = useMemo(() => {
    if (!allProperties || allProperties.length < 2) return [];
    return [
      ...allProperties.map((p) => ({ slug: p.slug, name: p.name })),
      { slug: "beide", name: "Beide" },
    ];
  }, [allProperties]);

  return (
    <div className="relative max-w-4xl">
      <div className="bg-white/95 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-2xl text-foreground">
        <div className="grid grid-cols-3 gap-1">
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

        {selectionLabel && (
          <p className="px-1 pt-2 text-xs text-foreground/60">
            Live beschikbaarheid en prijzen voor {selectionLabel}
          </p>
        )}
      </div>
    </div>
  );
}
