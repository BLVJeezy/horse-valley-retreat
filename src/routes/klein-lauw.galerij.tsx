import { createFileRoute } from "@tanstack/react-router";
import { PropertyGallery } from "@/components/site/PropertyGallery";
import { PropertyComingSoon } from "@/components/site/PropertyComingSoon";
import { getPropertyBySlug } from "@/lib/properties.functions";

export const Route = createFileRoute("/klein-lauw/galerij")({
  loader: () => getPropertyBySlug({ data: { slug: "klein-lauw" } }),
  head: () => ({
    meta: [{ title: "Galerij — Klein Lauw in Tongeren-Borgloon" }],
  }),
  component: KleinLauwGallery,
});

function KleinLauwGallery() {
  const property = Route.useLoaderData();

  if (!property || !property.is_live) {
    return <PropertyComingSoon name="Klein Lauw" />;
  }

  return <PropertyGallery name={property.name} mirror={property.mirror_photos} />;
}
