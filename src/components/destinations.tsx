"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Heart,
  MapPin,
  Star,
  X,
} from "lucide-react";
import {
  destinations,
  money,
  type Destination,
  type Region,
} from "@/lib/travel-data";

const regions: Region[] = ["All places", "Asia", "Europe", "Middle East"];

export function Destinations({
  onEnquire,
}: {
  onEnquire: (subject: string) => void;
}) {
  const [region, setRegion] = useState<Region>("All places");
  const [showAll, setShowAll] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [selected, setSelected] = useState<Destination | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const filtered = destinations.filter(
    (destination) => region === "All places" || destination.region === region,
  );
  const visible =
    showAll || region !== "All places" ? filtered : filtered.slice(0, 3);

  useEffect(() => {
    if (selected) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <section id="destinations" className="section destinations-section">
      <div className="section-heading" data-reveal>
        <div>
          <span className="eyebrow">
            <span className="tiny-line" /> THE WORLD IS CALLING
          </span>
          <h2>
            Find your kind of <span className="serif">somewhere.</span>
          </h2>
        </div>
        <p>
          Far-flung adventures or a little closer to home.
          <br className="desktop-break" /> Let’s find the place that feels like
          you.
        </p>
      </div>
      <div className="destination-toolbar">
        <div className="filter-tabs" aria-label="Filter destinations">
          {regions.map((item) => (
            <button
              type="button"
              aria-pressed={region === item}
              key={item}
              className={region === item ? "active" : ""}
              onClick={() => setRegion(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="text-link"
          onClick={() => {
            setShowAll(!showAll);
            setRegion("All places");
          }}
        >
          {showAll ? "Show highlights" : "Explore all destinations"}
          <ArrowUpRight size={17} />
        </button>
      </div>
      <div className="destination-grid">
        {visible.map((destination, index) => (
          <article className="destination-card" data-hover key={destination.id}>
            <div className="destination-image">
              <button
                type="button"
                className="destination-open"
                aria-label={`Explore ${destination.name}`}
                onClick={() => setSelected(destination)}
              >
                <Image
                  src={destination.image}
                  alt={destination.alt}
                  fill
                  sizes="(max-width: 600px) 90vw, (max-width: 900px) 46vw, 31vw"
                  className="object-cover"
                />
              </button>
              <span className="destination-tag">
                {index === 0 && region === "All places"
                  ? "Traveler favorite"
                  : destination.tag}
              </span>
              <button
                type="button"
                className={`save-button ${saved.includes(destination.id) ? "saved" : ""}`}
                aria-label={`${saved.includes(destination.id) ? "Unsave" : "Save"} ${destination.name}`}
                aria-pressed={saved.includes(destination.id)}
                onClick={() =>
                  setSaved((current) =>
                    current.includes(destination.id)
                      ? current.filter((id) => id !== destination.id)
                      : [...current, destination.id],
                  )
                }
              >
                <Heart
                  size={18}
                  fill={
                    saved.includes(destination.id) ? "currentColor" : "none"
                  }
                />
              </button>
              <div className="image-caption">
                <span>
                  <MapPin size={13} /> {destination.country}
                </span>
                <span>
                  <Star size={12} fill="currentColor" /> {destination.rating}
                </span>
              </div>
            </div>
            <div className="destination-info">
              <div>
                <button
                  type="button"
                  className="destination-title"
                  onClick={() => setSelected(destination)}
                >
                  {destination.name}
                  <ArrowUpRight size={21} />
                </button>
                <p>{destination.days}</p>
              </div>
              <div className="destination-price">
                <small>from</small>
                <strong>
                  {money(destination.price)}
                  <span> / person</span>
                </strong>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="destination-footnote">
        A little inspiration for your next escape. All packages and prices are
        illustrative.
      </p>
      <dialog
        ref={dialog}
        className="trip-dialog"
        onCancel={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelected(null);
        }}
        aria-labelledby="trip-title"
      >
        {selected && (
          <>
            <div className="dialog-image">
              <Image
                src={selected.image}
                alt={selected.alt}
                fill
                sizes="600px"
                className="object-cover"
              />
              <button
                type="button"
                className="icon-button dialog-close"
                aria-label="Close trip details"
                onClick={() => setSelected(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="dialog-content">
              <span className="eyebrow">
                {selected.country} · {selected.days}
              </span>
              <h2 id="trip-title">A little more {selected.name}.</h2>
              <p>{selected.description}</p>
              <div className="dialog-includes">
                <Check size={18} />
                <p>{selected.includes}.</p>
              </div>
              <p className="demo-notice">
                Illustrative package. No payment or reservation is made.
              </p>
              <div className="dialog-bottom">
                <div>
                  <small>From, per person</small>
                  <strong>{money(selected.price)}</strong>
                </div>
                <button
                  type="button"
                  className="button button-lime"
                  onClick={() => {
                    onEnquire(
                      `${selected.name} escape — ${selected.days}, from ${money(selected.price)} per person`,
                    );
                    setSelected(null);
                  }}
                >
                  Make it my next chapter
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
