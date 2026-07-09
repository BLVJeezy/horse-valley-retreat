import { createFileRoute } from "@tanstack/react-router";
import { PropertyGallery } from "@/components/site/PropertyGallery";

export const Route = createFileRoute("/galerij")({
  head: () => ({
    meta: [
      { title: "Galerij — Horse Vally in Tongeren-Borgloon" },
      {
        name: "description",
        content:
          "Foto's van Horse Vally: bakstenen nieuwbouwwoning, verzorgde tuin met trampoline, overdekte lounge, keuken en slaapkamers.",
      },
      { property: "og:title", content: "Galerij — Horse Vally" },
      {
        property: "og:description",
        content: "Bekijk de foto's van de vakantiewoning in Tongeren-Borgloon.",
      },
    ],
  }),
  component: () => <PropertyGallery name="Horse Vally" />,
});
