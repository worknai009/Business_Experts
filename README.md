# Business Experts — Business Ecosystem Platform

A premium MERN platform where businesses, startups, investors, professionals and communities connect. Every piece of content on the website is managed from the Admin Panel — nothing is hardcoded.

## Apps

| App | URL (dev) | Description |
|---|---|---|
| `frontend/` | http://localhost:5173 | Public website (React 19, TailwindCSS 4, Framer Motion) |
| `admin/` | http://localhost:5174 | Admin panel (JWT-protected CMS + dashboard) |
| `backend/` | http://localhost:5000 | Express + MongoDB API |

## Quick start

```bash
npm install
npm run dev        # starts backend + frontend + admin together
```

Requires Node 20+ and a local MongoDB on `mongodb://127.0.0.1:27017` (configurable in `backend/.env`). On first run the database is seeded automatically with default content, media and the admin user.

**Admin login** (change in `backend/.env`):

- Email: `admin@businessexperts.asia`
- Password: `admin123`

## What the admin controls

Hero (text, buttons, image, stats) · Services · Projects (cover, gallery, video, logo, tech, status, URLs, featured, order) · Events (banner, date, venue, seats, registration, gallery) · Memberships (5 programs) · Testimonials (incl. video reviews) · Gallery (photos/videos, categories) · Blog (SEO fields, tags, publish date) · FAQs · Team · Partners & Sponsors · Contact details (email, phone, WhatsApp, address, map) · Footer (links, newsletter, copyright) · Announcement bar · Popup · Homepage section order & visibility · Theme colors · SEO/meta · Messages & membership applications · Newsletter subscribers.

Changes publish to the website instantly — the frontend reads everything from the API.

## Media uploads

Uploads work out of the box (stored in `backend/uploads/`, served at `/api/media/uploads/...`). To use Cloudinary instead, set in `backend/.env`:

```
CLOUDINARY_CLOUD_NAME=…
CLOUDINARY_API_KEY=…
CLOUDINARY_API_SECRET=…
```

## Production build

```bash
npm run build      # builds frontend/dist and admin/dist
npm start          # runs the API
```

Serve the two `dist/` folders behind any static host and proxy `/api` to the backend.
