# KenoraCric â€” Broadcast Pro

KenoraCric is a TypeScript monorepo for a cricket match centre, scoring API, shared scoring rules package, and native React Native Android client. The supplied brand images are retained under web/assets; the web currently uses a replaceable text mark.

## Workspace

- web: React, Vite, typed pages, match centre, and scorer workspace.
- android: native React Native Android client, match centre, scorer sign-in, and scoring workspace with a local pending event queue.
- windows: reserved for a future Windows desktop client.
- server: the single Express/MongoDB backend used by both clients, with JWT authentication and Socket.IO match updates.
- secret: local ignored environment files. Keep actual credentials here and out of Git.
- server/packages/contracts: shared request schemas and response types for the server and both clients.
- server/packages/api-client: shared typed HTTP client used by Web and Android to call the same API routes.
- server/packages/cricket-engine: reusable pure TypeScript innings calculations.

## Run locally

Prerequisites: Node.js 22+ (which includes npm) and MongoDB. Copy `secret/server/env/server.env.example` to `secret/server/env/server.env`, set a random `JWT_ACCESS_SECRET` of at least 24 characters, then create `server/.env` as a hard link to it. Copy the web and Android templates to `secret/server/env/web.env` and `secret/server/env/android.env`, then create matching `.env` hard links in `web` and `android`. Start MongoDB.

    npm.cmd install
    npm.cmd run dev

Web is at http://localhost:5173 and API health is at http://localhost:5000/health. Run Metro with `npm.cmd run android` and run the Android app from Android Studio or with `npm.cmd run android --workspace=@kenoracric/mobile`. Set `MOBILE_API_URL` in `secret/env/android.env` to the development computer's LAN address for a physical phone. Set `VITE_API_URL` in `secret/env/web.env` to that same API server base when the web client is deployed elsewhere.

## API outline

- POST /api/v1/auth/register and /login
- GET /api/v1/matches and GET /api/v1/matches/:id
- POST /api/v1/matches (admin/scorer JWT)
- POST /api/v1/matches/:id/events (assigned scorer JWT, unique event ID and strict sequence)
- Socket.IO match:join / match:leave; score:update broadcasts

MongoDB collections: users, matches, scoreevents. Auth tokens are short lived; account recovery, verification, refresh tokens and managed sessions need mail delivery and a follow-up implementation.

## Checks

    npm.cmd test --workspace=@kenoracric/cricket-engine
    npm.cmd run typecheck
    npm.cmd run build

## Configuration

API: PORT, MONGODB_URI, JWT_ACCESS_SECRET, CLIENT_URL. Web: VITE_API_URL and VITE_SOCKET_URL. Android: MOBILE_API_URL. Environment files are stored in `secret/env`; real values are ignored by Git, while example templates are tracked.

Both clients connect to one server at /api/v1. Set VITE_API_URL for the web client and MOBILE_API_URL for Android to the same API base URL; use the computer's LAN address for a phone during local testing. Match administration, tournament/team/player CRUD, complete scorecards, automatic offline queue replay and handover, notifications, image uploads, production deployment, and the broader requested test matrix remain future work. No sample records are seeded into production.


