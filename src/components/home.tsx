"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Asterisk,
  BadgeCheck,
  BedDouble,
  CarFront,
  Check,
  Compass,
  Globe2,
  Headphones,
  HeartHandshake,
  Leaf,
  Plane,
  ShieldCheck,
} from "lucide-react";
import { type Service } from "@/lib/travel-data";
import { Brand } from "./brand";
import { Header } from "./header";
import { Motion } from "./motion";
import { SearchPanel } from "./search-panel";
import { Destinations } from "./destinations";
import { Contact } from "./contact";
import Link from "next/link";
import { CookiePreferencesButton } from "./consent-manager";

const services = [
  {
    name: "Visa assistance",
    service: "Visa",
    icon: BadgeCheck,
    number: "01",
    text: "Less paperwork. More possibilities. A little guidance for a smoother way there.",
    link: "Find your way in",
  },
  {
    name: "Flight booking",
    service: "Flights",
    icon: Plane,
    number: "02",
    text: "The right flight, at the right price. Your next adventure is just a takeoff away.",
    link: "Find your flight",
  },
  {
    name: "Hotel booking",
    service: "Hotels",
    icon: BedDouble,
    number: "03",
    text: "More than a place to sleep. Discover stays that become part of the story.",
    link: "Find your stay",
  },
  {
    name: "Car rental",
    service: "Car rental",
    icon: CarFront,
    number: "04",
    text: "Take the scenic route. The freedom to explore, entirely at your own pace.",
    link: "Find your ride",
  },
] as const;

const testimonials = [
  {
    quote:
      "The kind of trip you keep talking about long after you’re home. Every little detail just felt right.",
    name: "Sarah Mitchell",
    trip: "A week in Bali",
    initials: "SM",
    color: "#e3c6b7",
  },
  {
    quote:
      "Flights, visa, the most beautiful little hotel. Everything came together so effortlessly. We just showed up and made memories.",
    name: "Hamza & Ayesha",
    trip: "An Italian escape",
    initials: "HA",
    color: "#c9d5bb",
  },
  {
    quote:
      "We went for the adventure. We came back with a new favorite place in the world. Already dreaming about the next one.",
    name: "James Parker",
    trip: "Exploring Cappadocia",
    initials: "JP",
    color: "#d5ccbc",
  },
];

export function Home() {
  const [service, setService] = useState<Service>("Flights");
  const [enquiry, setEnquiry] = useState("");

  function handleEnquire(subject: string) {
    setEnquiry(
      `Hi Roam! I’m interested in ${subject}. Please help me plan this trip.`,
    );
    requestAnimationFrame(() =>
      document.getElementById("contact")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      }),
    );
  }
  function chooseService(nextService: Service) {
    setService(nextService);
    document.getElementById("search")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "center",
    });
  }

  return (
    <Motion>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div id="home">
        <Header />
      </div>
      <main id="main" className="min-w-0">
        <section className="hero" aria-label="Discover your next adventure">
          <Image
            src="/images/hero.jpg"
            alt="Sunlit colorful villages along the rugged Italian Riviera, overlooking turquoise Mediterranean water"
            fill
            priority
            sizes="100vw"
            className="hero-image object-cover"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <span className="hero-eyebrow" data-hero>
              <span /> FOR THE PLACES YOU’LL NEVER FORGET
            </span>
            <h1 data-hero>
              Go somewhere
              <br />
              that <span className="serif">stays with you.</span>
            </h1>
            <p data-hero>
              New places. Different perspectives. Stories worth telling.
              <br className="desktop-break" /> We take care of the details. You
              make the memories.
            </p>
            <a
              href="#destinations"
              className="button button-lime hero-button"
              data-hero
            >
              Find your next adventure
              <ArrowUpRight size={19} />
            </a>
            <div className="hero-social" data-hero>
              <div className="avatar-stack">
                <span>AM</span>
                <span>JL</span>
                <span>SK</span>
                <span>
                  <HeartHandshake size={15} />
                </span>
              </div>
              <div>
                <div className="hero-stars" aria-label="5 stars">
                  ★★★★★
                </div>
                <span>Good company. Great adventures.</span>
              </div>
            </div>
          </div>
          <div className="hero-location" data-hero>
            <span className="location-icon">
              <Compass size={24} strokeWidth={1.2} />
            </span>
            <div>
              <span>A LITTLE POSTCARD FROM</span>
              <strong>Cinque Terre, Italy</strong>
            </div>
            <ArrowUpRight size={19} />
          </div>
          <a
            href="#search"
            className="hero-scroll"
            aria-label="Scroll to travel search"
          >
            <ArrowDown size={16} />
          </a>
          <span className="hero-coordinate">44°07′ N &nbsp; 09°42′ E</span>
        </section>
        <SearchPanel
          onEnquire={handleEnquire}
          activeService={service}
          onServiceChange={setService}
        />
        <div className="assurance-strip">
          <span>
            <ShieldCheck size={17} /> Thoughtfully planned
          </span>
          <span>
            <Globe2 size={17} /> A world of possibilities
          </span>
          <span>
            <Headphones size={17} /> A real human, always
          </span>
          <span>
            <Leaf size={17} /> More meaningful journeys
          </span>
        </div>
        <Destinations onEnquire={handleEnquire} />

        <section id="services" className="services-section">
          <div className="section">
            <div className="section-heading" data-reveal>
              <div>
                <span className="eyebrow">
                  <span className="tiny-line" /> LESS PLANNING. MORE LIVING.
                </span>
                <h2>
                  Every detail.
                  <br />
                  <span className="serif">Already thought of.</span>
                </h2>
              </div>
              <p>
                From the first “what if” to the last flight home.
                <br className="desktop-break" /> All the travel essentials, in
                one happy place.
              </p>
            </div>
            <div className="services-grid">
              {services.map(
                ({
                  name,
                  service: itemService,
                  icon: Icon,
                  number,
                  text,
                  link,
                }) => (
                  <article
                    className="service-card"
                    key={name}
                    data-reveal
                    data-hover
                  >
                    <div className="service-card-top">
                      <span className="service-icon">
                        <Icon size={25} strokeWidth={1.4} />
                      </span>
                      <span className="service-number">/ {number}</span>
                    </div>
                    <h3>{name}</h3>
                    <p>{text}</p>
                    <button
                      type="button"
                      onClick={() => chooseService(itemService)}
                    >
                      {link}
                      <ArrowUpRight size={18} />
                    </button>
                  </article>
                ),
              )}
            </div>
          </div>
        </section>

        <section id="about" className="about-section section">
          <div className="about-visual" data-reveal>
            <Image
              src="/images/about.jpg"
              alt="A quiet wooden boat on a clear alpine lake surrounded by dramatic mountains"
              fill
              sizes="(max-width: 800px) 90vw, 45vw"
              className="object-cover"
            />
            <div className="about-stamp">
              <Asterisk size={27} strokeWidth={1.4} />
              <span>
                LESS ORDINARY.
                <br />
                MORE YOU.
              </span>
            </div>
            <span className="photo-label">
              Take a breath. You’re somewhere new.
            </span>
          </div>
          <div className="about-copy" data-reveal>
            <span className="eyebrow">
              <span className="tiny-line" /> A DIFFERENT WAY TO GET AWAY
            </span>
            <h2>
              We believe the best trips
              <br />
              make you <span className="serif">feel something.</span>
            </h2>
            <p>
              That first glimpse of the ocean. A wrong turn that becomes your
              favorite memory. A place that feels like you, even though you’ve
              never been.
            </p>
            <p>
              That’s why we’re here. To make getting there feel as good as being
              there, with thoughtful advice and the little details that make a
              big difference.
            </p>
            <div className="about-points">
              <span>
                <Check size={16} /> Made around you, never one-size-fits-all
              </span>
              <span>
                <Check size={16} /> Clear prices. No last-minute surprises.
              </span>
              <span>
                <Check size={16} /> People who care, every step of the way
              </span>
            </div>
            <a href="#contact" className="text-link">
              Get to know your next adventure
              <ArrowUpRight size={18} />
            </a>
          </div>
        </section>

        <div
          className="stats-section section"
          aria-label="Illustrative company statistics"
        >
          <div className="stats-intro">
            <Asterisk size={29} />
            <p>
              Small details.
              <br />
              <span className="serif">Big, beautiful experiences.</span>
            </p>
            <small>Illustrative demo figures</small>
          </div>
          <div className="stat">
            <strong>
              <span data-count="12">12</span>k
              <span className="stat-plus">+</span>
            </strong>
            <span>happy wanderers</span>
          </div>
          <div className="stat">
            <strong>
              <span data-count="40">40</span>
              <span className="stat-plus">+</span>
            </strong>
            <span>countries to fall for</span>
          </div>
          <div className="stat">
            <strong>
              <span data-count="98">98</span>
              <span className="stat-plus">%</span>
            </strong>
            <span>smiles all the way home</span>
          </div>
        </div>

        <section id="stories" className="stories-section section">
          <div className="section-heading" data-reveal>
            <div>
              <span className="eyebrow">
                <span className="tiny-line" /> POSTCARDS FROM HAPPY PLACES
              </span>
              <h2>
                Good trips. <span className="serif">Even better stories.</span>
              </h2>
            </div>
            <div className="testimonial-rating">
              <span className="rating-stars">★★★★★</span>
              <span>A little love from our sample travelers</span>
            </div>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((review) => (
              <article className="testimonial" key={review.name} data-reveal>
                <div className="review-top">
                  <span className="rating-stars" aria-label="5 out of 5 stars">
                    ★★★★★
                  </span>
                  <span className="quote-mark" aria-hidden="true">
                    “
                  </span>
                </div>
                <blockquote>{review.quote}</blockquote>
                <div className="review-person">
                  <span
                    className="review-avatar"
                    style={{ background: review.color }}
                  >
                    {review.initials}
                  </span>
                  <div>
                    <strong>{review.name}</strong>
                    <span>{review.trip}</span>
                  </div>
                  <BadgeCheck size={18} className="review-check" />
                </div>
              </article>
            ))}
          </div>
          <p className="destination-footnote">
            These stories and traveler profiles are fictional examples created
            for this demo.
          </p>
        </section>

        <section className="escape-banner" data-reveal>
          <Image
            src="/images/banner.jpg"
            alt="Sunlit red sandstone buttes in a wide desert landscape"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="banner-shade" />
          <div className="escape-content">
            <span className="eyebrow">SOMEDAY LOOKS GOOD ON YOU.</span>
            <h2>
              Make room for <span className="serif">a little wonder.</span>
            </h2>
            <p>The world isn’t going to explore itself.</p>
            <a href="#contact" className="button button-lime">
              Let’s make someday happen
              <ArrowUpRight size={18} />
            </a>
          </div>
          <Asterisk
            className="banner-asterisk"
            strokeWidth={0.65}
            aria-hidden="true"
          />
        </section>
        <Contact key={enquiry} enquiry={enquiry} />
      </main>
      <footer className="footer">
        <div className="footer-main section">
          <div className="footer-brand">
            <Brand light />
            <p>
              For the places you’ll go.
              <br />
              And the person you’ll become.
            </p>
            <span className="footer-made">
              A little curiosity goes a long way.
              <Asterisk size={15} />
            </span>
          </div>
          <div className="footer-links">
            <h3>Go somewhere</h3>
            <a href="#destinations">Find your destination</a>
            {services.map((item) => (
              <a
                key={item.service}
                href="#search"
                onClick={() => chooseService(item.service)}
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="footer-links">
            <h3>A little about us</h3>
            <a href="#about">The Roam way</a>
            <a href="#stories">Traveler stories</a>
            <a href="#contact">Let’s talk travel</a>
            <a href="#contact">Your questions, answered</a>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms of use</Link>
            <CookiePreferencesButton />
          </div>
          <div className="footer-note">
            <Globe2 size={30} strokeWidth={1} />
            <h3>
              The world is wide.
              <br />
              <span className="serif">Stay curious.</span>
            </h3>
            <a href="#home">
              Back to the beginning
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="footer-bottom section">
          <span>
            © {new Date().getFullYear()} Roam Travel. Made for the journey.
          </span>
          <span>Travel made personal. Karachi, Pakistan.</span>
          <span>
            Designed with a little wanderlust <Asterisk size={13} />
          </span>
        </div>
      </footer>
    </Motion>
  );
}
