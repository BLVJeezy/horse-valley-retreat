import { createFileRoute } from "@tanstack/react-router";
import { PropertyHome } from "@/components/site/PropertyHome";

export const Route = createFileRoute("/")({
  component: () => (
    <PropertyHome name="Horse Vally" galleryTo="/galerij" contactEmail="hallo@horsevally.be" />
  ),
});
