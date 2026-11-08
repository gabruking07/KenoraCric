# Architecture

npm workspace with a Vite React web client, native React Native Android client, a single Express/Mongoose backend, shared request contracts, shared typed API client, and shared scoring package. Web and Android call the same /api/v1 routes; each app only supplies its base URL for its runtime. The server owns authorization and MongoDB persistence. Scoring events have UUID idempotency keys and monotonically increasing match sequences; Socket.IO publishes accepted score state to match rooms. Backend configuration, database connection, models, auth middleware, business routes, and socket setup live in separate modules under server/src. Local ignored environment files are kept in secret/.


