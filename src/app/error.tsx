"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main" className="status-page section">
      <span className="eyebrow">A SMALL DETOUR</span>
      <h1>
        Let’s try <span className="serif">that again.</span>
      </h1>
      <p>
        Something interrupted this page. Try loading it again, or head back to
        the beginning.
      </p>
      <div className="status-actions">
        <button type="button" className="button button-dark" onClick={reset}>
          Try again
        </button>
        <Link href="/" className="button button-lime">
          Back to Roam
        </Link>
      </div>
    </main>
  );
}
