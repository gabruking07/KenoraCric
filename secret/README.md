# Local secrets and environment files

Keep machine-specific environment files in `secret/env`. The real `server.env`, `web.env`, and `android.env` files are ignored by Git; the `*.env.example` templates are safe to track. The API, web, and Android tools read `.env` from their project roots. Those files are hard links to the matching files in `secret/env`.
