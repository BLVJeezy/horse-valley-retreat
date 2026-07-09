import { createFileRoute } from "@tanstack/react-router";
import { PropertyHome } from "@/components/site/PropertyHome";
import { PropertyComingSoon } from "@/components/site/PropertyComingSoon";
import { getPropertyBySlug, listPublicProperties } from "@/lib/properties.functions";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [property, allProperties] = await Promise.all([
      getPropertyBySlug({ data: { slug: "horse-vally" } }),
      listPublicProperties(),
    ]);
    return { property, allProperties };
  },
  component: Home,
});

function Home() {
  const { property, allProperties } = Route.useLoaderData();

  // Fail open: if the properties row doesn't exist yet (e.g. migration not
  // applied), still show the site instead of a false "coming soon".
  if (property && property.is_live === false) {
    return <PropertyComingSoon name={property.name} />;
  }

  return (
    <PropertyHome
      name={property?.name ?? "Horse Vally"}
      galleryTo="/galerij"
      contactEmail={property?.contact_email ?? "hallo@horsevally.be"}
      address={property?.address}
      description={property?.description}
      pricePerNight={property?.price_per_night}
      currentSlug="horse-vally"
      allProperties={allProperties}
    />
  );
}
