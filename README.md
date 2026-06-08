# Budgetly — Deployment Guide

## Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database / Auth**: Neon Tech (serverless Postgres)
- **PWA**: Service Worker + Web App Manifest

---

## Step 1 — Create a Neon database

1. Go to https://neon.tech and sign up (free tier is enough)
2. Create a new **Project** (e.g. "budgetly")
3. Neon auto-creates a default database called `neondb`
4. Go to **Connection Details** → copy the **Connection string**
   It looks like:
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. That's your `DATABASE_URL` — save it, you'll need it in Step 3

> The app auto-creates all tables (`users`, `transactions`, `budgets`) on first request.
> You don't need to run any SQL manually.

---

## Step 2 — Generate a JWT secret

Run this in your terminal to generate a secure random secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output — that's your `JWT_SECRET`.

---

## Step 3 — Deploy to Vercel

### Option A: Deploy via Vercel CLI (recommended)
```bash
npm install -g vercel
cd budgetly
vercel
```
Follow the prompts. When asked for environment variables, add:
- `DATABASE_URL` → your Neon connection string
- `JWT_SECRET`   → your generated secret

### Option B: Deploy via GitHub
1. Push this repo to GitHub
2. Go to https://vercel.com → Import Project → select your repo
3. Vercel auto-detects Vite. Framework preset: **Vite**
4. Before deploying, go to **Environment Variables** and add:
   - `DATABASE_URL`
   - `JWT_SECRET`
5. Click **Deploy**

---

## Step 4 — PWA icons (optional but recommended)

Place two PNG files in the `/public` folder:
- `icon-192.png` — 192×192 px app icon
- `icon-512.png` — 512×512 px app icon

These are used for "Add to Home Screen" on iOS and Android.

---

## Local development

```bash
cp .env.example .env.local
# Fill in DATABASE_URL and JWT_SECRET in .env.local

npm install
npm run dev
```

The Vite dev server proxies `/api/*` to localhost:3000.
For local API testing, use `vercel dev` instead of `npm run dev`.

---

## Environment Variables Summary

| Variable       | Description                          | Where to get it            |
|----------------|--------------------------------------|----------------------------|
| `DATABASE_URL` | Neon Postgres connection string      | Neon dashboard             |
| `JWT_SECRET`   | Random 64-byte hex string for JWT    | Generate with node command |

---

## Bugs fixed from original

- Income transactions no longer double-counted in expense analytics
- Expense distribution chart only shows expense categories (income excluded)
- Burn rate calculated correctly: expenses ÷ income × 100
- Net balance = income − expenses (not running total)
- Vazirmatn font properly loaded via Google Fonts for Persian/Arabic
- Hindi translation typo fixed: परिवहन (transport)
- jsPDF pinned to 2.5.1 (no more @latest breakage risk)
- Amount input handles multiple decimal points safely
- Budget modal scrollable with save button always visible
- Transaction delete with confirmation dialog
- Reset also resets budgets to defaults
- PWA manifest, service worker, and meta tags added
- Real Neon auth (bcrypt + JWT, 30-day sessions)
- Session persists across page refreshes via localStorage token verify
- All API calls authenticated server-side
- Category options correctly filtered: income type → income/other; expense type → expense categories only
