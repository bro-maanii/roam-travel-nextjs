import { PageShell } from "@/components/page-shell";
import { CookiePreferencesButton } from "@/components/consent-manager";
import { CONTACT_EMAIL, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Privacy Policy",
  "How Roam Travel handles contact enquiries, analytics preferences and website data, and how to contact us about your privacy.",
  "/privacy",
);

export default function Privacy() {
  return (
    <PageShell>
      <article className="legal-content">
        <span className="eyebrow">YOUR INFORMATION, TREATED WITH CARE</span>
        <h1>
          Privacy <span className="serif">policy.</span>
        </h1>
        <p className="legal-updated">Last updated: 2 November 2026</p>
        <p>
          This notice describes information handled by the Roam Travel website.
          The website contact is based in Karachi, Pakistan and can be reached
          at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <h2>Contact enquiries</h2>
        <p>
          When you send the contact form, we process your name, email address,
          selected service and message to receive and respond to your enquiry.
          Please avoid including passport numbers, payment card information,
          identity documents or other sensitive details in the form.
        </p>
        <p>
          Enquiries are sent through our configured email delivery provider,
          Resend or SMTP, to our contact inbox. They are not saved to a separate
          application database. Email providers and inbox services process and
          retain messages under their own service terms. Sending a form does not
          subscribe you to marketing emails.
        </p>
        <h2>Hosting and security information</h2>
        <p>
          Vercel hosts this website and may process technical request
          information, such as IP addresses and request logs, to deliver and
          protect the service. We use limited, temporary request information to
          reduce form abuse. We do not sell contact information.
        </p>
        <h2>Cookies, local storage and analytics</h2>
        <p>
          We save your privacy preference in your browser’s local storage for up
          to 180 days. This preference is used to remember whether you accepted
          optional analytics or chose essential features only. Core browsing,
          searches and enquiries work without analytics consent.
        </p>
        <p>
          Vercel Web Analytics is loaded only after you accept analytics. It
          provides aggregated website usage information such as page views,
          browser type and referring sites. We exclude URL query strings and
          fragments from analytics events and do not include contact form
          contents in analytics. Vercel Web Analytics does not use advertising
          cookies. See{" "}
          <a
            href="https://vercel.com/docs/analytics/privacy-policy"
            target="_blank"
            rel="noreferrer"
          >
            Vercel’s analytics privacy information
          </a>
          .
        </p>
        <p>
          You can change your choice at any time: <CookiePreferencesButton />.
          Withdrawing consent stops future analytics events; it does not erase
          previously processed statistics.
        </p>
        <h2>Your choices and enquiries</h2>
        <p>
          You may ask about information you submitted, request a correction, or
          ask for its deletion by emailing{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We retain
          enquiry emails only as needed to deal with the enquiry and any
          relevant recordkeeping requirements. We may need to confirm the
          request relates to you.
        </p>
        <h2>External links and updates</h2>
        <p>
          External websites have their own privacy practices. We will update
          this notice if the way this website handles information changes; the
          date above identifies the latest version.
        </p>
      </article>
    </PageShell>
  );
}
