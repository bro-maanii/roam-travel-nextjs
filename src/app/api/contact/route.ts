import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createHash } from "node:crypto";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";
import { validateContact, type ContactPayload } from "@/lib/contact-validation";

export const runtime = "nodejs";
const attempts = new Map<string, { count: number; expires: number }>();
const json = (body: object, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = new Set([SITE_URL, new URL(request.url).origin]);
  if (!origin || !allowed.has(origin))
    return json(
      { error: "Please submit your enquiry from this website." },
      403,
    );
  if (!request.headers.get("content-type")?.includes("application/json"))
    return json({ error: "Please send a valid enquiry." }, 415);
  let payload: Partial<ContactPayload>;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw) > 8192)
      return json(
        { error: "Your enquiry is too long. Please shorten the message." },
        413,
      );
    payload = JSON.parse(raw);
    if (!payload || typeof payload !== "object" || Array.isArray(payload))
      return json({ error: "Please check your enquiry details." }, 400);
  } catch {
    return json({ error: "Please check your enquiry details." }, 400);
  }
  if (payload.website) return json({ ok: true });
  const errors = validateContact(payload);
  if (Object.keys(errors).length)
    return json({ error: "Please check the highlighted fields.", errors }, 400);
  const now = Date.now();
  for (const [key, entry] of attempts)
    if (entry.expires <= now) attempts.delete(key);
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = createHash("sha256").update(ip).digest("hex");
  const entry = attempts.get(key) || {
    count: 0,
    expires: now + 10 * 60 * 1000,
  };
  if (entry.count >= 5)
    return json(
      {
        error:
          "You’ve sent several enquiries. Please wait a few minutes or email us directly.",
      },
      429,
    );
  const sender = process.env.CONTACT_FROM_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;
  const smtpReady =
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD;
  if (!sender || (!resendKey && !smtpReady))
    return json(
      {
        error: `Email delivery is temporarily unavailable. Please email ${CONTACT_EMAIL} directly; your form has not been sent.`,
      },
      503,
    );
  if (attempts.size < 5000 || attempts.has(key))
    attempts.set(key, { ...entry, count: entry.count + 1 });
  const data = payload as ContactPayload;
  const text = `New Roam travel enquiry\n\nName: ${data.name.trim()}\nEmail: ${data.email.trim()}\nService: ${data.service}\n\nTravel plans:\n${data.message.trim()}\n\nSent from ${SITE_URL}`;
  const subject = `Travel enquiry: ${data.service}`;
  try {
    if (resendKey) {
      const id = request.headers.get("idempotency-key");
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
          ...(id && /^[a-f0-9-]{36}$/i.test(id)
            ? { "Idempotency-Key": id }
            : {}),
        },
        body: JSON.stringify({
          from: sender,
          to: [CONTACT_EMAIL],
          reply_to: data.email.trim(),
          subject,
          text,
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok)
        return json(
          {
            error:
              "We couldn’t send your enquiry. Please try again or use the email link below.",
          },
          502,
        );
      const result = await response.json();
      if (!result.id)
        return json(
          {
            error:
              "The email service did not confirm your enquiry. Please contact us directly.",
          },
          502,
        );
    } else {
      const port = Number(process.env.SMTP_PORT || 587);
      if (!Number.isInteger(port) || port < 1 || port > 65535)
        throw new Error("Invalid SMTP configuration");
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        requireTLS: port !== 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
        connectionTimeout: 10000,
        socketTimeout: 15000,
      });
      try {
        const result = await transport.sendMail({
          from: sender,
          to: CONTACT_EMAIL,
          replyTo: data.email.trim(),
          subject,
          text,
        });
        if (!result.accepted?.length) throw new Error("Email was not accepted");
      } finally {
        transport.close();
      }
    }
    return json({ ok: true });
  } catch {
    return json(
      {
        error:
          "The email service is taking a little longer. Please try again, or email us directly. We haven’t confirmed a send.",
      },
      502,
    );
  }
}
