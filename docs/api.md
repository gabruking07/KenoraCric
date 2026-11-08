# API

There is one Express API used by both Web and Android. The shared client package supplies the same methods and request types to both apps. The server is mounted under /api/v1. Health: GET /health. Authentication: register and login. Matches: list, detail, create. Scoring: submit a UUID event with the expected next sequence. Shared Zod contracts validate registration, login, match creation, and scoring payloads on the server. Scorer/admin roles are enforced by API middleware; assigned scorer ownership is checked for event submission.
