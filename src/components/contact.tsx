"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpRight,
  LoaderCircle,
  Mail,
  MapPin,
  Plus,
  Minus,
} from "lucide-react";
import { CONTACT_EMAIL, LOCATION, faqs } from "@/lib/site";
import {
  contactServices,
  validateContact,
  type ContactErrors,
  type ContactPayload,
} from "@/lib/contact-validation";

export function Contact({ enquiry }: { enquiry: string }) {
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const fields = new FormData(event.currentTarget);
    const payload: ContactPayload = {
      name: String(fields.get("name") || "").trim(),
      email: String(fields.get("email") || "").trim(),
      service: String(fields.get("service") || ""),
      message: String(fields.get("message") || "").trim(),
      website: String(fields.get("website") || ""),
    };
    const validation = validateContact(payload);
    setErrors(validation);
    setError("");
    if (Object.keys(validation).length) {
      const first = Object.keys(validation)[0];
      (form.current?.elements.namedItem(first) as HTMLElement)?.focus();
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        setErrors(result.errors || {});
        setError(
          result.error ||
            "We couldn’t send your message. Please try again or email us directly.",
        );
        return;
      }
      router.push("/thank-you");
    } catch {
      setError(
        "We couldn’t confirm the send. Check your connection and try again, or email us directly.",
      );
    } finally {
      setPending(false);
    }
  }
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
          <a href={`mailto:${CONTACT_EMAIL}`}>
            <Mail size={18} /> {CONTACT_EMAIL}
          </a>
          <span>
            <MapPin size={18} /> {LOCATION}
          </span>
        </div>
        <div className="faq-list" id="faq">
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
        <form ref={form} onSubmit={submit} noValidate aria-busy={pending}>
          <h3>Tell us a little about your escape.</h3>
          <div className="form-row">
            <label htmlFor="contact-name">
              Your name
              <input
                id="contact-name"
                name="name"
                placeholder="Alex Morgan"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <span id="name-error" className="field-error">
                  {errors.name}
                </span>
              )}
            </label>
            <label htmlFor="contact-email">
              Email address
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="alex@example.com"
                autoComplete="email"
                required
                maxLength={150}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <span id="email-error" className="field-error">
                  {errors.email}
                </span>
              )}
            </label>
          </div>
          <label htmlFor="contact-service">
            I’m interested in
            <select
              id="contact-service"
              name="service"
              defaultValue="A complete trip"
              aria-invalid={!!errors.service}
              aria-describedby={errors.service ? "service-error" : undefined}
            >
              {contactServices.map((service) => (
                <option key={service}>{service}</option>
              ))}
            </select>
            {errors.service && (
              <span className="field-error" id="service-error">
                {errors.service}
              </span>
            )}
          </label>
          <label htmlFor="contact-message">
            What does your dream trip look like?
            <textarea
              id="contact-message"
              key={enquiry}
              name="message"
              rows={4}
              placeholder="A week somewhere sunny, a trip with the family..."
              defaultValue={enquiry}
              required
              minLength={10}
              maxLength={2000}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message && (
              <span id="message-error" className="field-error">
                {errors.message}
              </span>
            )}
          </label>
          <div className="form-trap" aria-hidden="true">
            <label>
              Leave this field empty
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          {error && (
            <div className="contact-error" role="alert">
              <p>{error}</p>
              <a href={`mailto:${CONTACT_EMAIL}`}>Email {CONTACT_EMAIL}</a>
            </div>
          )}
          <button
            type="submit"
            className="button button-dark"
            disabled={pending}
          >
            {pending ? (
              <>
                Sending your enquiry…
                <LoaderCircle size={18} className="loading-spinner" />
              </>
            ) : (
              <>
                Let’s start something good
                <ArrowUpRight size={18} />
              </>
            )}
          </button>
          <p className="contact-disclaimer">
            We’ll use these details to respond to your enquiry. Please read our{" "}
            <Link href="/privacy">privacy policy</Link>. Sending an enquiry does
            not confirm a booking.
          </p>
        </form>
      </div>
    </section>
  );
}
