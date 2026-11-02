import Link from "next/link";
import { Header } from "./header";
import { Brand } from "./brand";
import { CONTACT_EMAIL, LOCATION } from "@/lib/site";
import { CookiePreferencesButton } from "./consent-manager";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" className="document-main section">
        {children}
      </main>
      <footer className="document-footer">
        <div className="section">
          <Brand />
          <p>
            {LOCATION} · <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
          <nav aria-label="Footer navigation">
            <Link href="/">Home</Link>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms</Link>
            <CookiePreferencesButton />
          </nav>
        </div>
      </footer>
    </>
  );
}
