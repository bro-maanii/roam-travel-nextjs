import Link from "next/link";
import { Check, ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { CONTACT_EMAIL, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Thank You",
  "Thank you for contacting Roam Travel. Explore more destinations while your travel enquiry is reviewed.",
  "/thank-you",
  false,
);

export default function ThankYou() {
  return (
    <PageShell>
      <div className="status-page">
        <span className="status-icon">
          <Check size={40} />
        </span>
        <span className="eyebrow">ONE STEP CLOSER</span>
        <h1>
          Good things start
          <br />
          with a <span className="serif">hello.</span>
        </h1>
        <p>
          Thank you for getting in touch. After a successful form submission,
          your enquiry is sent to our contact inbox for review.
        </p>
        <p>
          Need to add a detail? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <Link href="/#destinations" className="button button-dark">
          Keep dreaming of somewhere
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </PageShell>
  );
}
