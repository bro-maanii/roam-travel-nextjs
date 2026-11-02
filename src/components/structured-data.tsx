import {
  CONTACT_EMAIL,
  LOCATION,
  SITE_DESCRIPTION,
  SITE_URL,
  faqs,
} from "@/lib/site";

export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Roam Travel",
        url: SITE_URL,
        logo: `${SITE_URL}/icon-512.png`,
        description: SITE_DESCRIPTION,
        email: CONTACT_EMAIL,
        location: {
          "@type": "Place",
          name: LOCATION,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Karachi",
            addressCountry: "PK",
          },
        },
        contactPoint: {
          "@type": "ContactPoint",
          email: CONTACT_EMAIL,
          contactType: "travel enquiries",
          availableLanguage: ["English", "Urdu"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Roam Travel",
        url: SITE_URL,
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: "Visa Assistance, Flights, Hotels & Car Rental | Roam Travel",
        description: SITE_DESCRIPTION,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "ItemList",
        name: "Travel services",
        itemListElement: [
          "Visa assistance",
          "Flight ticket booking",
          "Hotel booking",
          "Car rental",
        ].map((name, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Service",
            name,
            url: `${SITE_URL}/#services`,
            provider: { "@id": `${SITE_URL}/#organization` },
            areaServed: "Pakistan",
          },
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: faqs.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
