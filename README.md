# BYC Codex

Starter Node.js/Express stack with member/public/admin portals and SQL Server schema for the BYC feature set.

## Backend
- Express API with controllers, services, and in-memory seed data for auth, roles, events + RSVPs, documents/newsletters, member directory, docks, and public content.
- Security: JWT auth, role-based middleware, bcrypt password hashing, validation (express-validator), helmet, CORS, and rate limiting.
- Environment configuration lives in `.env` (see `.env.example`).

## Frontend
- Static HTML/CSS/JS single-page shell served from `/frontend`.
- Routes cover public pages (Home, About, Membership, Events, Contact, Login), member dashboard (announcements, events/RSVPs, documents/newsletters, dock layout, directory, profile), and admin tools (content, events, documents, docks, users/roles) wired to API calls.

## Database
- `sql/schema.sql` defines users/roles, sessions/tokens, events/RSVPs, documents/newsletters, profiles with privacy, boats/docks/slips, announcements/pages/content settings, and audit/login history with indexes and constraints.
- `sql/seed.sql` inserts sample roles, users, content, events, docs, docks, boats, profiles, and settings.

## Getting Started
1. Copy `.env.example` to `.env` and adjust secrets/paths.
2. Install dependencies: `npm install` (may require registry access).
3. Run the API & frontend: `npm start` then open `http://localhost:3000/`.
4. Load SQL schema/seed into SQL Server to persist data and replace sample password hashes with real hashed values.

Default sample users: `admin@byc.test` / `AdminPass123!`, `member@byc.test` / `MemberPass123!` (JWT only, no session UI included).
