import type { Metadata } from "next";
import "./globals.css";
import { ConsentManager } from "@/components/consent-manager";
import { MobileCta } from "@/components/mobile-cta";
import { SITE_URL, SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Roam Travel — Go somewhere that stays with you",
    template: "%s | Roam Travel",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Roam Travel",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Roam Travel — Your next chapter starts here",
    description: SITE_DESCRIPTION,
    siteName: "Roam Travel",
    locale: "en_PK",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Roam Travel — your next chapter starts here",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <MobileCta />
        <ConsentManager />
      </body>
    </html>
  );
}
