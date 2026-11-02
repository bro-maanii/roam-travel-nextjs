import { Home } from "@/components/home";
import { StructuredData } from "@/components/structured-data";
import { pageMetadata, SITE_DESCRIPTION } from "@/lib/site";

export const metadata = pageMetadata(
  "Visa Assistance, Flights, Hotels & Car Rental",
  SITE_DESCRIPTION,
  "/",
);

export default function Page() {
  return (
    <>
      <StructuredData />
      <Home />
    </>
  );
}
