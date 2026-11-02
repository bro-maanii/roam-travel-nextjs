"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Mail,
  MapPin,
  Plus,
  Minus,
} from "lucide-react";

const faqs = [
  {
    question: "Can you help plan my entire trip?",
    answer:
      "Absolutely. Choose a destination or tell us what you have in mind. Our demo planner brings flights, visa assistance, hotel stays, and car rentals into one simple enquiry.",
  },
  {
    question: "Are the prices and bookings real?",
    answer:
      "This is a frontend assessment project. All packages, availability, prices, reviews, and company figures are sample data. No payment is taken and no booking or message is sent.",
  },
  {
    question: "What does visa assistance include?",
    answer:
      "The sample service covers a document checklist, application preparation, and review. Government fees are separate, and visa approval always rests with the relevant authorities.",
  },
];

export function Contact({ enquiry }: { enquiry: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  return (
    <section id="contact" className="contact-section section">
      <div className="contact-copy" data-reveal>
        <span className="eyebrow">
          <span className="tiny-line" /> LET’S MAKE IT HAPPEN
        </span>
        <h2>
          Your next chapter
          <br />
          starts with a <span className="serif">hello.</span>
        </h2>
        <p>
          A rough idea, a dream destination, or absolutely no plan.
          <br />
          We’d love to hear where you want to go.
        </p>
        <div className="contact-details">
          <span>
            <Mail size={18} /> hello@roam.example
          </span>
          <span>
            <MapPin size={18} /> Based in Pakistan. Curious about everywhere.
          </span>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div className="faq-item" key={faq.question}>
              <h3>
                <button
                  type="button"
                  aria-expanded={openFaq === index}
                  aria-controls={`faq-${index}`}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  {faq.question}
                  {openFaq === index ? <Minus size={17} /> : <Plus size={17} />}
                </button>
              </h3>
              <div id={`faq-${index}`} hidden={openFaq !== index}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="contact-card" data-reveal>
        {sent ? (
          <div className="contact-success" role="status">
            <CheckCircle2 size={44} />
            <span className="eyebrow">ONE STEP CLOSER</span>
            <h3>You’re going places, {name.split(" ")[0]}.</h3>
            <p>
              Your demo enquiry is complete. In a live website, our travel team
              would take it from here.
            </p>
            <p className="demo-notice">
              This is a demonstration. Your details haven’t been sent or stored.
            </p>
            <button
              type="button"
              className="button button-dark"
              onClick={() => setSent(false)}
            >
              Plan another adventure
              <ArrowUpRight size={17} />
            </button>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            <h3>Tell us a little about your escape.</h3>
            <div className="form-row">
              <label>
                Your name
                <input
                  name="name"
                  placeholder="Alex Morgan"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={80}
                  pattern=".*\S.*"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  placeholder="alex@example.com"
                  autoComplete="email"
                  required
                  maxLength={150}
                />
              </label>
            </div>
            <label>
              I’m interested in
              <select name="service" defaultValue="A complete trip">
                <option>A complete trip</option>
                <option>Flight booking</option>
                <option>Hotel booking</option>
                <option>Visa assistance</option>
                <option>Car rental</option>
              </select>
            </label>
            <label>
              What does your dream trip look like?
              <textarea
                key={enquiry}
                name="message"
                rows={4}
                placeholder="A week somewhere sunny, a trip with the family..."
                defaultValue={enquiry}
                required
                minLength={10}
                maxLength={2000}
              />
            </label>
            <button type="submit" className="button button-dark">
              Let’s start something good
              <ArrowUpRight size={18} />
            </button>
            <p className="contact-disclaimer">
              Just a demo, just a little wanderlust. This form doesn’t send or
              store your information.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
