import Link from "next/link";
import { Compass, ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Page Not Found",
  "This route has taken a detour. Return to Roam Travel to explore destinations and plan your next trip.",
  "/404",
  false,
);

export default function NotFound() {
  return (
    <PageShell>
      <div className="status-page">
        <span className="status-icon">
          <Compass size={42} strokeWidth={1.2} />
        </span>
        <span className="eyebrow">404 · A LITTLE OFF THE BEATEN PATH</span>
        <h1>
          Even good trips
          <br />
          take a <span className="serif">wrong turn.</span>
        </h1>
        <p>
          We couldn’t find this page. There’s plenty of the world left to
          discover back at the beginning.
        </p>
        <Link href="/" className="button button-dark">
          Find your way home
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </PageShell>
  );
}
