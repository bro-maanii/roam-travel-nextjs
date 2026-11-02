import { Asterisk } from "lucide-react";

export default function Loading() {
  return (
    <main className="route-loading" role="status" aria-live="polite">
      <Asterisk size={44} className="loading-spinner" />
      <p>Finding your next chapter…</p>
      <span className="sr-only">Page loading</span>
    </main>
  );
}
