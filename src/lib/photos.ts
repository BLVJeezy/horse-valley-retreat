import exterior from "@/assets/photos/image.png.asset.json";
import loungeCovered from "@/assets/photos/image-2.png.asset.json";
import gardenTrampoline from "@/assets/photos/image-3.png.asset.json";
import dining from "@/assets/photos/image-4.png.asset.json";
import loungeDay from "@/assets/photos/image-5.png.asset.json";
import bedroom from "@/assets/photos/image-6.png.asset.json";
import kitchen from "@/assets/photos/image-7.png.asset.json";
import hallwayShelf from "@/assets/photos/image-8.png.asset.json";
import kitchenAlt from "@/assets/photos/image-9.png.asset.json";
import laundry from "@/assets/photos/image-10.png.asset.json";

export type Photo = { url: string; alt: string; category: string };

export const photos = {
  exterior: { url: exterior.url, alt: "Bakstenen nieuwbouwwoning Horse Vally met zonnepanelen", category: "Buiten" },
  loungeCovered: { url: loungeCovered.url, alt: "Overdekte buitenlounge met houten pergola en crème zetels", category: "Tuin" },
  gardenTrampoline: { url: gardenTrampoline.url, alt: "Groen gazon met trampoline en houten omheining", category: "Tuin" },
  dining: { url: dining.url, alt: "Eetkamer met houten tafel voor acht personen", category: "Binnen" },
  loungeDay: { url: loungeDay.url, alt: "Buitenlounge overdag met terras en pergola", category: "Tuin" },
  bedroom: { url: bedroom.url, alt: "Ruime slaapkamer met tweepersoonsbed", category: "Slaapkamers" },
  kitchen: { url: kitchen.url, alt: "Volledig uitgeruste keuken in licht hout", category: "Binnen" },
  hallwayShelf: { url: hallwayShelf.url, alt: "Inkomhal met trap en decoratieve rekken", category: "Binnen" },
  kitchenAlt: { url: kitchenAlt.url, alt: "Keuken en eethoek in warme houttinten", category: "Binnen" },
  laundry: { url: laundry.url, alt: "Wasruimte met wasmachine", category: "Praktisch" },
} satisfies Record<string, Photo>;

export const galleryOrder: Photo[] = [
  photos.exterior,
  photos.loungeCovered,
  photos.gardenTrampoline,
  photos.dining,
  photos.kitchen,
  photos.bedroom,
  photos.loungeDay,
  photos.hallwayShelf,
  photos.kitchenAlt,
  photos.laundry,
];
