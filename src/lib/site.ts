import type { Metadata } from "next";

export const SITE_URL = "https://roam-travel-nextjs.vercel.app";
export const CONTACT_EMAIL = "emanaliabbasi99@gmail.com";
export const LOCATION = "Karachi, Pakistan";
export const SITE_DESCRIPTION =
  "Plan your next trip with Roam in Karachi, Pakistan. Explore visa assistance, flights, hotels and car rentals, then request a personal travel quote.";

export const faqs = [
  {
    question: "Which travel services does Roam offer?",
    answer:
      "Roam brings visa assistance, flight ticket booking, hotel booking and car rental enquiries together. Tell us your destination, travel dates and group size to start planning.",
  },
  {
    question: "Where is Roam based and how can I get in touch?",
    answer: `Our contact location is Karachi, Pakistan. Email ${CONTACT_EMAIL} or send an enquiry using the contact form on this page.`,
  },
  {
    question: "Can I make a confirmed booking on this website?",
    answer:
      "Search results and package prices are sample travel options for exploring your plans. Submitting an enquiry does not reserve a flight, hotel or car. Confirm availability, final prices and booking terms before making any commitment.",
  },
  {
    question: "What does visa assistance include?",
    answer:
      "Visa assistance covers a document checklist, application preparation and review. Government fees are separate, and the relevant authority makes every visa decision. Approval is never guaranteed.",
  },
  {
    question: "How do I request a tailored travel quote?",
    answer:
      "Choose a service and search for your destination. Select Enquire on an option, or open a destination package, to add the trip details to the contact form. Add your name, email and preferences, then send your enquiry.",
  },
];

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  index = true,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
      title: `${title} | Roam Travel`,
      description,
      url: `${SITE_URL}${path}`,
      siteName: "Roam Travel",
      locale: "en_PK",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Roam Travel — visa assistance, flights, hotels and car rental in Karachi, Pakistan",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Roam Travel`,
      description,
      images: [`${SITE_URL}/opengraph-image`],
    },
    robots: { index, follow: true },
  };
}
