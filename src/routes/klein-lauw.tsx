import { createFileRoute } from "@tanstack/react-router";
import { PropertyHome } from "@/components/site/PropertyHome";
import { PropertyComingSoon } from "@/components/site/PropertyComingSoon";
import { getPropertyBySlug } from "@/lib/properties.functions";

export const Route = createFileRoute("/klein-lauw")({
  loader: () => getPropertyBySlug({ data: { slug: "klein-lauw" } }),
  head: () => ({
    meta: [
      { title: "Klein Lauw — vakantiewoning in Tongeren-Borgloon" },
      {
        name: "description",
        content: "Klein Lauw: dezelfde sfeer als Horse Vally, gespiegelde indeling.",
      },
    ],
  }),
  component: KleinLauw,
});

function KleinLauw() {
  const property = Route.useLoaderData();

  if (!property || !property.is_live) {
    return <PropertyComingSoon name="Klein Lauw" />;
  }

  return (
    <PropertyHome
      name={property.name}
      galleryTo="/klein-lauw/galerij"
      contactEmail={property.contact_email}
      address={property.address}
      description={property.description}
      pricePerNight={property.price_per_night}
      mirror={property.mirror_photos}
    />
  );
}
