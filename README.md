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
- `GET /api/cars?make=Honda&maxPrice=25000&minScore=90`
- `GET /api/cars/:id`
- `POST /api/listings` with JSON fields `year`, `make`, `model`, `mileage`, and optional `price`

## Demo limitations / production checklist
- Listing inventory, AI scores, history notes, and price range are sample data. The app does not connect to live market feeds, vehicle-history databases, VIN providers, or a real LLM.
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
- Listing photos and seller profiles are illustrative. Seller messaging is a demo
  assistant for drafting messages; no message is sent to a seller.
- The frontend uses sample inventory directly. The API is a separately testable starter;
  API draft creation returns a response without storing the draft.

## GitHub preparation

Generated files, dependencies, logs, and local environment secrets are excluded by
`.gitignore`. Commit the lockfile so installs are reproducible. Configure the desired
GitHub remote before pushing. No remote URL is included in this project.
