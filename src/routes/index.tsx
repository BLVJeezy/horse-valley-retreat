import { createFileRoute } from "@tanstack/react-router";
import { PropertyHome } from "@/components/site/PropertyHome";
import { PropertyComingSoon } from "@/components/site/PropertyComingSoon";
import { getPropertyBySlug } from "@/lib/properties.functions";

export const Route = createFileRoute("/")({
  loader: () => getPropertyBySlug({ data: { slug: "horse-vally" } }),
  component: Home,
});

function Home() {
  const property = Route.useLoaderData();

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
    />
  );
}
