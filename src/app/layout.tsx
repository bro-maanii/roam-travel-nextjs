import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roam — Go somewhere that stays with you",
  description:
    "A thoughtfully crafted travel experience. Explore visa assistance, flights, boutique hotels, and car rentals with Roam. An interactive travel agency demo.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Roam — Your next chapter starts here",
    description:
      "Less planning. More living. Discover your next escape with Roam.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
