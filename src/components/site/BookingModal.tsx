import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  BEDS24_PROPERTY_IDS,
  SingleBeds24Widget,
  type Beds24PropertyKey,
} from "@/components/site/Beds24Widget";
import {
  closeBookingModal,
  setBookingModalProperty,
  useBookingModalState,
} from "@/lib/bookingModal";

const propertyOptions: { key: Beds24PropertyKey; label: string }[] = [
  { key: "horse-vally", label: "Horsey Vally" },
  { key: "klein-lauw", label: "Klein Lauw" },
  { key: "beide", label: "Beide" },
];

/**
 * Globale boekingsmodal. Wordt éénmaal gemount in de root layout en luistert naar
 * de bookingModal-store, zodat elke "Boek"-knop op de site (sticky balk, per-woning
 * knoppen) 'm kan openen — ook wanneer er geen React-context tussen zit.
 */
export function BookingModal() {
  const { isOpen, property } = useBookingModalState();
  const propId = BEDS24_PROPERTY_IDS[property];
  const activeLabel = propertyOptions.find((opt) => opt.key === property)?.label ?? "";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeBookingModal()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Boek voor {activeLabel}</DialogTitle>
          <DialogDescription>Kies hieronder eventueel een andere woning, of ga direct verder met boeken.</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-2 mb-2">
          {propertyOptions.map((opt) => {
            const isActive = opt.key === property;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setBookingModalProperty(opt.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  isActive
                    ? "bg-accent text-background border-accent"
                    : "bg-transparent text-foreground border-foreground/15 hover:bg-black/[0.03]"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {property === "beide" ? (
          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 text-center">
                Horsey Vally
              </p>
              <SingleBeds24Widget
                key={`modal-${BEDS24_PROPERTY_IDS["horse-vally"]}`}
                propId={BEDS24_PROPERTY_IDS["horse-vally"]}
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 text-center">
                Klein Lauw
              </p>
              <SingleBeds24Widget
                key={`modal-${BEDS24_PROPERTY_IDS["klein-lauw"]}`}
                propId={BEDS24_PROPERTY_IDS["klein-lauw"]}
              />
            </div>
          </div>
        ) : (
          <SingleBeds24Widget key={`modal-${propId}`} propId={propId} />
        )}
      </DialogContent>
    </Dialog>
  );
}
