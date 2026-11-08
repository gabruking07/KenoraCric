# KenoraCric — Broadcast Pro

KenoraCric is a TypeScript monorepo for a cricket match centre, scoring API, shared scoring rules package, and Expo Android client. The supplied brand images are retained under assets; the web currently uses a replaceable text mark.

## Workspace

- apps/web: React, Vite, typed pages, match centre, and scorer workspace.
- apps/mobile: Expo Router Android client, match centre, scorer sign-in, scoring workspace, and SQLite event queue.
- apps/api: the single Express/MongoDB server used by both clients, with JWT authentication and Socket.IO match updates.
- packages/contracts: shared request schemas and response types for the server and both clients.
- packages/api-client: shared typed HTTP client used by Web and Android to call the same API routes.
- packages/cricket-engine: reusable pure TypeScript innings calculations.

## Run locally

Prerequisites: Node.js 22+, pnpm 9+, and MongoDB. If Corepack is missing, install pnpm from PowerShell with npm.cmd install --global pnpm@9.15.4. Copy apps/api/.env.example to apps/api/.env and set a random JWT_ACCESS_SECRET of at least 24 characters. Copy apps/web/.env.example to apps/web/.env. Start MongoDB.

    pnpm.cmd install
    pnpm.cmd dev

Web is at http://localhost:5173 and API health is at http://localhost:5000/health. Run Android with pnpm.cmd --filter @kenoracric/mobile start and open the project in an Android emulator. On a physical device, set EXPO_PUBLIC_API_URL to the development computer's LAN address. Set VITE_API_URL to that same API server base when the web client is deployed elsewhere.

## API outline

- POST /api/v1/auth/register and /login
- GET /api/v1/matches and GET /api/v1/matches/:id
- POST /api/v1/matches (admin/scorer JWT)
- POST /api/v1/matches/:id/events (assigned scorer JWT, unique event ID and strict sequence)
- Socket.IO match:join / match:leave; score:update broadcasts

MongoDB collections: users, matches, scoreevents. Auth tokens are short lived; account recovery, verification, refresh tokens and managed sessions need mail delivery and a follow-up implementation.

## Checks

    pnpm.cmd --filter @kenoracric/cricket-engine test
    pnpm.cmd typecheck
    pnpm.cmd build

## Configuration

API: PORT, MONGODB_URI, JWT_ACCESS_SECRET, CLIENT_URL. Web: VITE_API_URL and VITE_SOCKET_URL. Mobile: EXPO_PUBLIC_API_URL. App-level .env.example files contain local placeholders only.

Both clients connect to one server at /api/v1. Set VITE_API_URL for the web client and EXPO_PUBLIC_API_URL for Android to the same API base URL; use the computer's LAN address for a phone during local testing. Match administration, tournament/team/player CRUD, complete scorecards, automatic offline queue replay and handover, notifications, image uploads, production deployment, and the broader requested test matrix remain future work. No sample records are seeded into production.
