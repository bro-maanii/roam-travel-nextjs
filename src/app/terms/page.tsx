import { PageShell } from "@/components/page-shell";
import { CONTACT_EMAIL, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Terms of Use",
  "Read the terms for using Roam Travel, including sample travel prices, enquiry handling, booking conditions and visa assistance limitations.",
  "/terms",
);

export default function Terms() {
  return (
    <PageShell>
      <article className="legal-content">
        <span className="eyebrow">A FEW DETAILS BEFORE YOU GO</span>
        <h1>
          Terms of <span className="serif">use.</span>
        </h1>
        <p className="legal-updated">Last updated: 2 November 2026</p>
        <p>
          These terms describe use of the Roam Travel website and its travel
          enquiry features. For questions, contact{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> in Karachi,
          Pakistan.
        </p>
        <h2>Travel information and sample prices</h2>
        <p>
          Search results, packages, prices, traveler stories and company figures
          on this website are illustrative sample content. They do not establish
          live availability or a binding quote. Prices are shown in US dollars
          unless stated otherwise. Travel requirements, fares and availability
          may change.
        </p>
        <h2>Enquiries and bookings</h2>
        <p>
          Submitting the contact form requests further information. It does not
          confirm a reservation, create a paid booking or guarantee a response
          time. This website does not collect payments. Before arranging travel,
          confirm the final itinerary, supplier, price, cancellation rules and
          any separate booking agreement.
        </p>
        <h2>Visa assistance</h2>
        <p>
          Visa assistance is administrative guidance, such as document
          checklists and preparation support. It is not a promise of visa
          approval or a substitute for official consular information. The
          relevant authority decides each application; government fees and
          requirements are separate.
        </p>
        <h2>Your information and use of the service</h2>
        <p>
          Please provide accurate contact details and travel preferences. Do not
          submit unlawful, abusive or misleading content, impersonate another
          person, send unsolicited bulk messages or interfere with the website.
          Do not send payment information or identity documents through this
          contact form.
        </p>
        <h2>Content and third-party services</h2>
        <p>
          Website branding, design and content are protected by their applicable
          rights. Photography and icons remain subject to their original
          licenses. Third-party websites, travel suppliers and email services
          have separate terms and policies. Our{" "}
          <a href="/privacy">privacy policy</a> explains how enquiry information
          and analytics preferences are handled.
        </p>
        <h2>Availability and updates</h2>
        <p>
          We aim to provide a useful, accessible website, but errors and
          interruptions can occur. Verify important travel details directly with
          the relevant airline, accommodation provider, rental company or
          government authority. These website terms do not replace a supplier’s
          booking conditions or rights that apply under applicable law.
        </p>
      </article>
    </PageShell>
  );
}
