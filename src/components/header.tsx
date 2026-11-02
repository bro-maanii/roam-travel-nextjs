"use client";

import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Brand } from "./brand";

const links = [
  { label: "Destinations", href: "/#destinations" },
  { label: "Our services", href: "/#services" },
  { label: "Why Roam", href: "/#about" },
  { label: "Travel stories", href: "/#stories" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav aria-label="Main navigation" className="desktop-nav">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a href="/#contact" className="button button-dark header-cta">
          Let’s plan a trip <ArrowUpRight size={17} />
        </a>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="mobile-nav"
        >
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
              <ArrowUpRight size={18} />
            </a>
          ))}
          <a href="/#contact" onClick={() => setOpen(false)}>
            Let’s plan a trip <ArrowUpRight size={18} />
          </a>
        </nav>
      )}
    </header>
  );
}
