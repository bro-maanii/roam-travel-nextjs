"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Plane,
  BedDouble,
  BadgeCheck,
  CarFront,
  MapPin,
  CalendarDays,
  UsersRound,
  Search,
  Check,
  Sparkles,
  X,
} from "lucide-react";
import {
  destinations,
  localDate,
  money,
  searchTravel,
  validateSearch,
  type SearchQuery,
  type SearchResult,
  type Service,
} from "@/lib/travel-data";

const tabs = [
  { name: "Flights", icon: Plane },
  { name: "Hotels", icon: BedDouble },
  { name: "Visa", icon: BadgeCheck },
  { name: "Car rental", icon: CarFront },
] as const;

export function SearchPanel({
  onEnquire,
  activeService,
  onServiceChange,
}: {
  onEnquire: (subject: string) => void;
  activeService: Service;
  onServiceChange: (service: Service) => void;
}) {
  const [destination, setDestination] = useState("bali");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [origin, setOrigin] = useState("Karachi");
  const [travelers, setTravelers] = useState(2);
  const [error, setError] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [submitted, setSubmitted] = useState<SearchQuery | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const hasEndDate =
    activeService === "Hotels" || activeService === "Car rental";

  useEffect(() => {
    setResults(null);
    setError("");
  }, [activeService]);

  function switchTab(service: Service) {
    onServiceChange(service);
    setResults(null);
    setError("");
  }
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = {
      service: activeService,
      destination,
      date,
      endDate,
      origin,
      travelers,
    };
    const validation = validateSearch(query);
    if (validation) {
      setError(validation);
      return;
    }
    setError("");
    setSubmitted(query);
    setResults(searchTravel(query));
    requestAnimationFrame(() =>
      resultsRef.current?.focus({ preventScroll: true }),
    );
  }

  return (
    <section
      id="search"
      className="search-wrapper"
      aria-label="Plan your travel"
    >
      <div className="search-panel" data-hero>
        <div className="search-topline">
          <div
            className="search-tabs"
            role="tablist"
            aria-label="Travel service"
          >
            {tabs.map(({ name, icon: Icon }, index) => (
              <button
                key={name}
                type="button"
                role="tab"
                id={`tab-${index}`}
                aria-controls="search-form-panel"
                aria-selected={activeService === name}
                tabIndex={activeService === name ? 0 : -1}
                className={activeService === name ? "active" : ""}
                onClick={() => switchTab(name)}
                onKeyDown={(event) => {
                  let next: number | undefined;
                  if (event.key === "ArrowRight")
                    next = (index + 1) % tabs.length;
                  if (event.key === "ArrowLeft")
                    next = (index + tabs.length - 1) % tabs.length;
                  if (event.key === "Home") next = 0;
                  if (event.key === "End") next = tabs.length - 1;
                  if (next !== undefined) {
                    event.preventDefault();
                    switchTab(tabs[next].name);
                    document.getElementById(`tab-${next}`)?.focus();
                  }
                }}
              >
                <Icon size={18} />
                <span>{name}</span>
              </button>
            ))}
          </div>
          <span className="search-note">
            <Sparkles size={13} /> A good trip starts right here
          </span>
        </div>
        <div
          role="tabpanel"
          id="search-form-panel"
          aria-labelledby={`tab-${tabs.findIndex((item) => item.name === activeService)}`}
        >
          <form
            className={`search-fields ${hasEndDate ? "with-end-date" : ""}`}
            onSubmit={handleSubmit}
          >
            {activeService === "Flights" && (
              <label className="search-field">
                <span>
                  <Plane size={15} /> Flying from
                </span>
                <select
                  value={origin}
                  onChange={(event) => setOrigin(event.target.value)}
                >
                  <option>Karachi</option>
                  <option>Lahore</option>
                  <option>Islamabad</option>
                  <option>London</option>
                  <option>New York</option>
                </select>
              </label>
            )}
            <label className="search-field">
              <span>
                <MapPin size={15} />
                {activeService === "Flights"
                  ? "Flying to"
                  : activeService === "Visa"
                    ? "Where are you headed?"
                    : activeService === "Car rental"
                      ? "Pickup location"
                      : "Where to?"}
              </span>
              <select
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
              >
                {destinations.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}, {item.country}
                  </option>
                ))}
              </select>
            </label>
            <label className="search-field">
              <span>
                <CalendarDays size={15} />
                {activeService === "Hotels"
                  ? "Check-in"
                  : activeService === "Car rental"
                    ? "Pickup date"
                    : "Departure date"}
              </span>
              <input
                aria-label={
                  activeService === "Hotels"
                    ? "Check-in date"
                    : activeService === "Car rental"
                      ? "Pickup date"
                      : "Departure date"
                }
                type="date"
                required
                min={localDate()}
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>
            {hasEndDate && (
              <label className="search-field">
                <span>
                  <CalendarDays size={15} />
                  {activeService === "Hotels" ? "Check-out" : "Return date"}
                </span>
                <input
                  aria-label={
                    activeService === "Hotels"
                      ? "Check-out date"
                      : "Return date"
                  }
                  type="date"
                  required
                  min={date || localDate()}
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </label>
            )}
            <label className="search-field travelers-field">
              <span>
                <UsersRound size={15} />
                {activeService === "Visa" ? "Applicants" : "Travelers"}
              </span>
              <select
                value={travelers}
                onChange={(event) => setTravelers(Number(event.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map((number) => (
                  <option key={number} value={number}>
                    {number} {activeService === "Visa" ? "applicant" : "adult"}
                    {number > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </label>
            <button className="button button-lime search-submit" type="submit">
              <Search size={19} />
              <span>Let’s explore</span>
            </button>
          </form>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
      {results && submitted && (
        <div
          className="search-results"
          ref={resultsRef}
          tabIndex={-1}
          aria-label="Search results"
        >
          <div className="results-heading">
            <div>
              <span className="eyebrow">A FEW POSSIBILITIES</span>
              <h3>{submitted.service} for your next adventure</h3>
              <p>
                {new Date(`${submitted.date}T12:00:00`).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" },
                )}{" "}
                · {submitted.travelers} traveler(s)
              </p>
            </div>
            <button
              type="button"
              className="icon-button"
              onClick={() => setResults(null)}
              aria-label="Close search results"
            >
              <X size={20} />
            </button>
          </div>
          <p className="demo-notice">
            Demo results · Sample prices in USD. Availability and bookings are
            simulated.
          </p>
          {results.length ? (
            <div className="results-grid">
              {results.map((result) => (
                <article className="result-card" key={result.id}>
                  <span className="result-service">{submitted.service}</span>
                  <h4>{result.title}</h4>
                  <p>{result.subtitle}</p>
                  <ul>
                    {result.details.map((detail) => (
                      <li key={detail}>
                        <Check size={14} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <div className="result-bottom">
                    <div>
                      <strong>{money(result.price)}</strong>
                      <small>{result.unit}</small>
                    </div>
                    <button
                      type="button"
                      className="button button-dark"
                      onClick={() =>
                        onEnquire(
                          `${submitted.service}: ${result.title} — ${submitted.date}${submitted.service === "Hotels" || submitted.service === "Car rental" ? ` to ${submitted.endDate}` : ""}, ${submitted.travelers} traveler(s), ${money(result.price)} sample quote`,
                        )
                      }
                    >
                      Enquire <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p>No matching options just yet. Try another destination.</p>
          )}
        </div>
      )}
    </section>
  );
}
