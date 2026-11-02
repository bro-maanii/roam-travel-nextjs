"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/site";

export function MobileCta() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return (
    <nav className="mobile-sticky-cta" aria-label="Quick travel contact">
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="mobile-email"
        aria-label="Email Roam"
      >
        <Mail size={20} />
      </a>
      <Link href="/#contact" className="button button-dark">
        Plan my trip
        <ArrowUpRight size={18} />
      </Link>
    </nav>
  );
}
