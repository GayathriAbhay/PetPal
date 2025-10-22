# PetPal

PetPal is a pet adoption and care app (frontend built with Vite + React). This repository includes an optional Express server that provides authentication (email + credentials) and a real database integration using TiDB (Prisma + TiDB adapter).

Server (API)
- Location: `server/`
- Run steps:
  1. Install server deps: `cd server && npm install`
  2. Ensure root `.env` or environment variables are set (DATABASE_URL, MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD, MAIL_FROM_ADDRESS, NEXTAUTH_URL or FRONTEND_URL, JWT_SECRET)
  3. Generate Prisma client & push/migrate schema from project root:
     - `npx prisma generate`
     - `npx prisma db push` (or create migrations if preferred)
  4. Start server: `cd server && npm run start` (or `npm run dev` during development)

API endpoints (server runs on PORT 4000 by default):
- POST /api/auth/register { name, email, password }
- POST /api/auth/login { email, password }
- POST /api/auth/logout
- POST /api/auth/forgot { email }
- GET /api/pets
- POST /api/pets (requires auth cookie)
- GET /api/medical-records
- POST /api/medical-records (requires auth)
- GET /api/posts
- POST /api/posts (requires auth)

Frontend integration
- The frontend can call these endpoints (e.g. `http://localhost:4000/api/pets`). The server sets an HttpOnly cookie named `petpal_token` when logging in.

Notes
- The server uses TiDB via the `@tidbcloud/prisma-adapter` and `@tidbcloud/serverless` packages. Make sure `DATABASE_URL` contains the proper TiDB connection string.
- Emails are sent via SMTP using the provided MAIL_* env vars (Brevo). Ensure credentials are valid.

If you want, I can now:
- Add frontend hooks/services to call the new server endpoints (auth, pets, medical records, forum).
- Add UI for sign-in/register/reset flows and wire logout/login state.

Reply which frontend integrations you'd like me to add next.




https://pet-pal-seven.vercel.app