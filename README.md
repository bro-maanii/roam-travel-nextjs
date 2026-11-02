# Roam — Travel Agency Website

A complete frontend technical assessment built with **Next.js App Router, TypeScript, Tailwind CSS 4, and GSAP**. Roam pairs an editorial travel aesthetic with practical, accessible booking discovery.

## Project links

- **GitHub:** https://github.com/bro-maanii/roam-travel-nextjs
- **Live website:** https://roam-travel-nextjs.vercel.app
- **Upload-ready submission:** [Roam Assessment Submission (PDF)](submission/Roam-Assessment-Submission.pdf)

## Run locally

Requires **Node.js 22.13+** and npm. No API keys, environment variables, database, or backend services are needed.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. For a production build:

```bash
npm run build
npm start
```

## Features

- Four working service forms: **flights, hotels, visa assistance, and car rental**.
- Deterministic, locally generated results based on the selected destination, dates, and traveler count.
- Flight quotes price the whole party; hotel quotes account for nights and two guests per room; rental quotes account for days and vehicle capacity; visa service fees account for applicants.
- Required fields, future-date validation, date range validation, and party size limits.
- Six destinations with regional filters, expanded browsing, session-only saved favorites, and accessible trip detail dialogs.
- Search results and destination packages feed a prefilled enquiry into the contact form.
- Validated contact form with an explicit simulated success state, and FAQ accordions.
- Responsive mobile, tablet, and desktop layouts with a mobile navigation menu.
- GSAP hero entrance, ScrollTrigger reveals, animated statistics, and card/image hover effects.
- Reduced-motion support, semantic landmarks, keyboard-operable tabs, visible focus styles, a skip link, native modal focus handling, and meaningful image descriptions.
- Next.js optimized local images, metadata, Open Graph metadata, and an SVG favicon.

**Demo boundaries:** All prices, availability, testimonials, profiles, statistics, and packages are sample data. There are no real bookings, payments, messages, or visa applications. Contact information is neither transmitted nor persisted. Images are bundled locally; no third-party API is called at runtime. The favorite state resets when the page is reloaded.

## Try the site

1. Choose a service, destination, future date, and traveler count; submit **Let’s explore**.
2. For hotels and car rentals, choose an end date after the start date.
3. Click **Enquire** on a result to populate the contact form.
4. Filter destinations by region, save a favorite, or open a destination for package details.
5. Submit a valid contact form to view the demonstration confirmation.

## Structure

```text
src/
  app/                  # App Router entry point, metadata, design tokens and styles
  components/
    brand.tsx           # Shared wordmark
    header.tsx          # Desktop and mobile navigation
    home.tsx            # Page composition and shared enquiry state
    motion.tsx          # Scoped GSAP animations and cleanup
    search-panel.tsx    # Service tabs, forms and mock result cards
    destinations.tsx    # Regional browsing, favorites and trip modal
    contact.tsx         # Enquiry form, success state and FAQ
  lib/travel-data.ts    # Typed sample data, search validation and quote calculations
public/                 # Bundled photography and favicon
tests/
  search.test.ts        # Quote calculation and validation tests
  e2e/travel.spec.ts    # Browser workflows, responsive and accessibility checks
```

The visual system uses warm ivory, forest green, lime accents, sans-serif text, and italic serif headings. Tailwind utilities and `@apply` are combined with reusable, token-based CSS classes for the custom editorial layouts. It draws inspiration from image-forward destination card patterns found on 21st.dev; application components are custom implementations.

## Verification

```bash
npm run typecheck
npm test
npm run build

# Install the browser once, then run browser tests against a production build:
npx playwright install chromium
npm run test:e2e
```

Playwright starts a local production server on port 3001. The suite checks all service searches, enquiry handoff, destination filtering and saving, modal behavior, contact validation, mobile navigation, keyboard tabs, horizontal overflow at 320/390/768/1024/1440px, runtime errors, and automated accessibility rules. It also saves desktop and mobile screenshots to `artifacts/`.

To test an existing deployment instead:

```powershell
$env:PLAYWRIGHT_BASE_URL="https://your-deployment.vercel.app"
npm run test:e2e
```

Use `npm run format` to format project files.

## Deploy to Vercel

Import the GitHub repository into Vercel, select the **Next.js** framework preset, and deploy. The default install (`npm ci`) and build (`npm run build`) commands work without environment variables. Alternatively, use the Vercel CLI:

```bash
npx vercel --prod
```

## Asset credits

Photography is sourced from [Unsplash](https://unsplash.com) and bundled in `public/images`. Exact source image URLs are listed in [ASSETS.md](ASSETS.md). Icons are from [Lucide](https://lucide.dev), licensed under ISC. Roam is a fictional brand created for this assessment.
