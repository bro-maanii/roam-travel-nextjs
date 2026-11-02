import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Roam Travel",
    short_name: "Roam",
    description: "Visa assistance, flights, hotels and car rental enquiries.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f6",
    theme_color: "#26362b",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
