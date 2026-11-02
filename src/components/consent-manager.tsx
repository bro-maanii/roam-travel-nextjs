"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "roam-privacy-v1";
type Choice = "accepted" | "essential";
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      className="cookie-settings-button"
      onClick={() => window.dispatchEvent(new Event("roam:privacy-settings"))}
    >
      Cookie preferences
    </button>
  );
}

export function ConsentManager() {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [visible, setVisible] = useState(false);
  const consent = useRef<Choice | null>(null);
  useEffect(() => {
    const restore = () => {
      let next: Choice | null = null;
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        if (
          saved &&
          (saved.choice === "accepted" || saved.choice === "essential") &&
          saved.expires > Date.now()
        )
          next = saved.choice;
      } catch {
        /* Storage can be disabled; keep optional analytics off. */
      }
      consent.current = next;
      setChoice(next);
      setVisible(!next);
    };
    const open = () => setVisible(true);
    const sync = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) restore();
    };
    restore();
    window.addEventListener("roam:privacy-settings", open);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("roam:privacy-settings", open);
      window.removeEventListener("storage", sync);
    };
  }, []);
  function save(next: Choice) {
    consent.current = next;
    setChoice(next);
    setVisible(false);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ choice: next, expires: Date.now() + MAX_AGE }),
      );
    } catch {
      /* The current page still respects the choice. */
    }
  }
  return (
    <>
      {choice === "accepted" && (
        <Analytics
          beforeSend={(event) => {
            if (consent.current !== "accepted") return null;
            const url = new URL(event.url);
            url.search = "";
            url.hash = "";
            return { ...event, url: url.toString() };
          }}
        />
      )}
      {visible && (
        <aside className="cookie-banner" aria-label="Privacy preferences">
          <div className="cookie-banner-title">
            <Cookie size={20} />
            <h2>A little choice. Your privacy.</h2>
          </div>
          <p>
            We remember your preference in this browser. Optional, cookie-free
            analytics help us understand how the site is used. Your enquiry
            works either way.{" "}
            <Link href="/privacy">Read our privacy policy.</Link>
          </p>
          <div className="cookie-actions">
            <button
              className="button cookie-essential"
              type="button"
              onClick={() => save("essential")}
            >
              Essential only
            </button>
            <button
              className="button button-dark"
              type="button"
              onClick={() => save("accepted")}
            >
              Accept analytics
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
