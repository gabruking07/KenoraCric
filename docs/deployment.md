# Deployment

Build the web client with pnpm --filter @kenoracric/web build and deploy as a Vite SPA with rewrite-to-index routing. Deploy API as a Node service with MongoDB and a required JWT secret. Configure VITE_API_URL, MONGODB_URI, JWT_ACCESS_SECRET, and CLIENT_URL in the hosting environment. Expo EAS profiles and production signing are not configured yet.
