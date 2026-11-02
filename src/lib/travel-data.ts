export type Service = "Flights" | "Hotels" | "Visa" | "Car rental";
export type Region = "All places" | "Asia" | "Europe" | "Middle East";

export const destinations = [
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    region: "Asia",
    image: "/images/bali.jpg",
    alt: "Lush tropical greenery and traditional architecture in Bali",
    price: 649,
    tag: "A slower kind of paradise",
    rating: "4.9",
    days: "6 days / 5 nights",
    description:
      "Sunrise over rice terraces, little jungle hideaways, and the kind of sunsets you wish would last forever.",
    includes: "Boutique stay, airport transfers, breakfast & a guided day trip",
  },
  {
    id: "italy",
    name: "Italian Riviera",
    country: "Italy",
    region: "Europe",
    image: "/images/italy.jpg",
    alt: "Colorful Italian coastal village above the Mediterranean Sea",
    price: 1199,
    tag: "La dolce vita awaits",
    rating: "4.9",
    days: "7 days / 6 nights",
    description:
      "Winding coastal roads, lemon-scented afternoons, and long lunches with the Mediterranean at your feet.",
    includes: "Coastal hotel, breakfast, transfers & a private boat afternoon",
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    region: "Middle East",
    image: "/images/dubai.jpg",
    alt: "Dubai skyline with the Burj Khalifa above the city",
    price: 799,
    tag: "A world of possibilities",
    rating: "4.8",
    days: "5 days / 4 nights",
    description:
      "From quiet desert dunes to a skyline that never stops dreaming. Discover both sides of this extraordinary city.",
    includes: "City hotel, breakfast, airport transfers & desert safari",
  },
  {
    id: "japan",
    name: "Kyoto",
    country: "Japan",
    region: "Asia",
    image: "/images/japan.jpg",
    alt: "Traditional Japanese street and pagoda in Kyoto",
    price: 1399,
    tag: "Find beauty in the little things",
    rating: "4.9",
    days: "8 days / 7 nights",
    description:
      "Temple gardens, lantern-lit lanes, and an invitation to slow down. A journey into Japan’s timeless heart.",
    includes: "Ryokan stay, breakfast, rail pass & a local walking tour",
  },
  {
    id: "greece",
    name: "Santorini",
    country: "Greece",
    region: "Europe",
    image: "/images/greece.jpg",
    alt: "White buildings and blue domes overlooking the Aegean Sea",
    price: 1099,
    tag: "Meet me by the blue",
    rating: "4.8",
    days: "6 days / 5 nights",
    description:
      "Whitewashed villages, volcanic beaches, and blue that stretches as far as the eye can see.",
    includes: "Island stay, breakfast, transfers & a sunset cruise",
  },
  {
    id: "turkey",
    name: "Cappadocia",
    country: "Türkiye",
    region: "Middle East",
    image: "/images/turkey.jpg",
    alt: "Hot air balloons above the rock formations of Cappadocia",
    price: 899,
    tag: "Wake up somewhere wonderful",
    rating: "4.9",
    days: "5 days / 4 nights",
    description:
      "Sleep in a cave suite, wander otherworldly valleys, and watch the sky fill with color at dawn.",
    includes: "Cave hotel, breakfast, airport transfers & a valley tour",
  },
] as const;

export type Destination = (typeof destinations)[number];
export type SearchQuery = {
  service: Service;
  destination: string;
  origin: string;
  date: string;
  endDate: string;
  travelers: number;
};
export type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  unit: string;
  details: string[];
};

export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function validateSearch(
  query: SearchQuery,
  today = localDate(),
): string | null {
  if (!query.destination || !query.date)
    return "Choose a destination and a travel date.";
  if (query.date < today) return "Please choose today or a future travel date.";
  if (
    (query.service === "Hotels" || query.service === "Car rental") &&
    (!query.endDate || query.endDate <= query.date)
  )
    return "Your end date must be after your start date.";
  if (query.service === "Flights" && !query.origin.trim())
    return "Choose your departure city.";
  if (
    !Number.isInteger(query.travelers) ||
    query.travelers < 1 ||
    query.travelers > 6
  )
    return "Choose between 1 and 6 travelers.";
  if (!destinations.some((item) => item.id === query.destination))
    return "Please choose one of our available destinations.";
  return null;
}

export function searchTravel(query: SearchQuery): SearchResult[] {
  const destination = destinations.find(
    (item) => item.id === query.destination,
  );
  if (!destination) return [];
  const city = destination.name;
  const totalDays = Math.max(
    1,
    Math.round(
      (Date.parse(query.endDate) - Date.parse(query.date)) / 86400000,
    ) || 1,
  );
  switch (query.service) {
    case "Flights":
      return [
        {
          id: "flight-1",
          title: `${query.origin} → ${city}`,
          subtitle: "Roam Air · Economy",
          price: Math.round(destination.price * 0.55) * query.travelers,
          unit: `total for ${query.travelers} traveler${query.travelers > 1 ? "s" : ""}`,
          details: [
            "08:30 – 16:45 · 1 stop",
            "23 kg checked baggage",
            "Flexible date option",
          ],
        },
        {
          id: "flight-2",
          title: `${query.origin} → ${city}`,
          subtitle: "Horizon Airways · Premium economy",
          price: Math.round(destination.price * 0.78) * query.travelers,
          unit: `total for ${query.travelers} traveler${query.travelers > 1 ? "s" : ""}`,
          details: [
            "13:15 – 21:00 · 1 stop",
            "30 kg checked baggage",
            "Extra legroom included",
          ],
        },
      ];
    case "Hotels":
      return [
        {
          id: "hotel-1",
          title: `The Hideaway, ${city}`,
          subtitle: "Boutique hotel · 4.8 guest rating",
          price: 119 * totalDays * Math.ceil(query.travelers / 2),
          unit: `${totalDays} night${totalDays > 1 ? "s" : ""} · ${Math.ceil(query.travelers / 2)} room(s)`,
          details: [
            "Breakfast included",
            "Pool & wellness space",
            "Free cancellation up to 48h before arrival",
          ],
        },
        {
          id: "hotel-2",
          title: `${city} Garden Retreat`,
          subtitle: "Premium resort · 4.9 guest rating",
          price: 189 * totalDays * Math.ceil(query.travelers / 2),
          unit: `${totalDays} night${totalDays > 1 ? "s" : ""} · ${Math.ceil(query.travelers / 2)} room(s)`,
          details: [
            "Breakfast & airport pickup",
            "Private terrace",
            "Refundable rate",
          ],
        },
      ];
    case "Visa":
      return [
        {
          id: "visa-1",
          title: `${destination.country} tourist visa assistance`,
          subtitle: "Personal guidance, from checklist to submission",
          price: 89 * query.travelers,
          unit: `service fee for ${query.travelers} applicant(s)`,
          details: [
            "Document checklist & review",
            "Application preparation support",
            "Government fees excluded · Approval is not guaranteed",
          ],
        },
      ];
    case "Car rental":
      return [
        {
          id: "car-1",
          title: "Compact explorer",
          subtitle: `${city} · Toyota Yaris or similar`,
          price: 39 * totalDays,
          unit: `${totalDays} rental day(s)`,
          details: [
            "5 seats · Automatic · 2 bags",
            "Standard insurance included",
            ...(query.travelers > 5
              ? ["Your party needs a larger vehicle; choose the SUV below."]
              : ["Airport pickup available"]),
          ],
        },
        {
          id: "car-2",
          title: "Room for adventure",
          subtitle: `${city} · Premium SUV or similar`,
          price: 79 * totalDays,
          unit: `${totalDays} rental day(s)`,
          details: [
            "7 seats · Automatic · 4 bags",
            "Standard insurance included",
            "Unlimited mileage",
          ],
        },
      ].filter((item) => query.travelers <= 5 || item.id === "car-2");
  }
}

export const money = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
