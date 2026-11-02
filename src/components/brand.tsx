import { Asterisk } from "lucide-react";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <a
      href="#home"
      aria-label="Roam home"
      className={`brand ${light ? "brand-light" : ""}`}
    >
      <Asterisk aria-hidden="true" strokeWidth={2.4} />
      <span>
        roam<span className="brand-dot">.</span>
      </span>
    </a>
  );
}
