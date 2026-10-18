# AutoMatch AI

Responsive P2P used-car marketplace prototype built with React, Vite, custom CSS, Express, and Lucide icons.

## Features
- Responsive discovery page with make, model, budget, and AI-score filters
- Listing cards with save/favorite interactions and AI deal-score styling
- Listing detail view with seller profile, vehicle specs, and an illustrative vehicle health/value audit
- AI concierge sidebar with prompt starters for common vehicle issues, negotiation messages, and price context
- Multi-step sell flow with simulated VIN autofill, local image previews, AI-assisted description generation, and a sample price range
- Express API starter for health checks, inventory filtering, detail lookup, and draft listing submission

## Run locally

Requirements: Node.js 22.12+ (Node.js 24 recommended)

```bash
npm ci
npm run dev
```

Vite prints the local development URL. In another terminal, start the API with:

```bash
npm run server
```

API endpoints:
- `GET /api/health`
- `GET /api/cars?make=Honda&maxPrice=300000000&minScore=90`
- `GET /api/cars/:id`
- `POST /api/listings` with JSON fields `year`, `make`, `model`, `mileage`, and optional `price`

## Demo limitations / production checklist
- Inventory prices are a manually researched CarsDB asking-price snapshot; AI scores remain illustrative. The app does not connect to live market feeds, vehicle-history databases, VIN providers, or a real LLM.
- Chat responses are local demo responses, not a live AI integration.
- Photos are previewed in the browser only. Uploads are not stored.
- Add authentication, database persistence, image storage, VIN decoding, moderation, rate limiting, CSRF/security headers, privacy/consent flows, and a real AI provider before production.
- Price and vehicle-history statements must be verified with trustworthy external data. Never present the demo audit as a mechanical diagnosis or a verified history report.

## Checks and production build

Run `npm run check` to execute the API integration tests and build the frontend.
GitHub Actions runs these checks on pushes and pull requests.

`npm audit` checks the locked dependencies for known vulnerabilities.

For a local production preview:

```bash
npm ci
npm run build
node --env-file=.env.example server.js
```

Open http://localhost:3001. The Express server serves the built app and API.
Alternatively, copy `.env.example` to `.env` and run `npm start`.
Development uses two terminals (`npm run dev` and `npm run server`);
Vite proxies `/api` requests to port 3001. If you change the API port,
update the proxy in `vite.config.js` too.

## Working demo behavior

- Saved toggles a view of favorited cars; favorites last for the current session.
- Sort by AI score, asking price, or mileage.
- Save draft stores vehicle details and description in this browser's local storage
  and restores them on reload. Photos are temporary previews and are not saved.
- Photo selection accepts up to 10 JPG/PNG images, at most 10 MB each.
- Distance filtering is disabled because the sample data has no distance coordinates.
- Listing photos are illustrative stock images, not photos of the sourced cars. Seller messaging is a demo
  assistant for drafting messages; no message is sent to a seller.
- The frontend and API use the same researched inventory snapshot. The API is a separately testable starter;
  API draft creation returns a response without storing the draft.

## GitHub preparation

Generated files, dependencies, logs, and local environment secrets are excluded by
`.gitignore`. Commit the lockfile so installs are reproducible. Configure the desired
GitHub remote before pushing. No remote URL is included in this project.

All prices, budget filters, and listing drafts use Myanmar kyat (MMK). Published prices in lakhs are multiplied by 100,000; no foreign exchange conversion is used. Previously saved drafts without an MMK currency marker require re-entering the asking price.

## Price research — checked 18 October 2026

This is a static snapshot of published Myanmar asking prices, not a live feed or confirmation that a car remains available. Some ads were last edited months ago; the check date does not imply the seller refreshed the price. View the source and confirm with the seller. Mileage ranges are seller-reported; numeric mileage uses the range lower bound for sorting. AI scores and photos are illustrative.

| Vehicle | Published lakhs | MMK | Source |
| --- | ---: | ---: | --- |
| 2018 Honda CR-V | 2800 | 280,000,000 | [CarsDB](https://www.carsdb.com/en/car-listings/2018-honda-cr-v-778738) |
| 2008 Toyota Alphard GL | 3200 | 320,000,000 | [CarsDB](https://www.carsdb.com/en/car-listings/2008-toyota-alphard-789994) |
| 2018 Mazda CX-5 | 1580 | 158,000,000 | [CarsDB](https://www.carsdb.com/en/car-listings/2018-mazda-cx-5-788324) |
| 2014 BMW 528i Luxury Line | 2550 | 255,000,000 | [CarsDB](https://www.carsdb.com/en/car-listings/2014-bmw-528i-782698) |
| 2024 Ford Ranger | 4320 | 432,000,000 | [CarsDB](https://www.carsdb.com/en/car-listings/2024-ford-ranger-790156) |
| 2023 Hongqi EQM5 | 1850 | 185,000,000 | [CarsDB](https://www.carsdb.com/en/car-listings/2023-hongqi-eqm5-775330) |

Mazda and Ford prices were read from CarsDB search/home listing summaries; their individual detail pages could not be fetched during research. All other prices were also checked on the individual listing pages. Source edit ages are retained where available in src/inventory.js.
