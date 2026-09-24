# A,A JOS COMM — Website & Business Management System

Official website and admin dashboard for **A,A JOS COMM**, a mobile phone and
technology retail business in Pantami, Gombe, Nigeria, led by **Abdul Jos**
(Abdurrahman Muhammad Al Amin).

Built with Next.js 14 (App Router) + TypeScript + Tailwind CSS + PostgreSQL
(Prisma ORM). Deployable to Netlify.

---

## 1. What's included

- **Public website**: home, phone showroom with search/filters, individual
  product pages, EasyBuy, About, Gallery, Contact — all mobile-first.
- **No public prices** — every product shows "Get current price", which opens
  WhatsApp with a message pre-filled with that exact product's name.
- **Admin dashboard** (`/admin`) — add/edit/delete products, mark
  available/out-of-stock, feature products, toggle EasyBuy, hide/show
  products, manage the gallery, and edit all business settings (phone,
  WhatsApp, hours, address, socials, payment accounts) — no code required.
- **Secure authentication** — admin passwords are hashed (bcrypt), sessions
  are signed JWTs in an httpOnly cookie, and all `/admin` routes are
  protected by middleware.
- **PostgreSQL + Prisma** — full schema in `prisma/schema.prisma`.
- **WhatsApp utility** (`src/lib/whatsapp.ts`) — converts your local number
  format to the international format WhatsApp links require, and builds the
  pre-filled messages used across the site.
- **SEO** — metadata, Open Graph, sitemap.xml, robots.txt.
- Nothing on this site is invented: no fake prices, reviews, statistics, or
  EasyBuy terms. Anything not explicitly provided is left as a plain,
  editable field in the admin.

---

## 2. Real assets already in the project

Your supplied images are already placed at:

```
public/images/logo/aajoscomm-logo.jpg      — the A,A JOS COMM / AA JOS GLOBAL LINKS logo
public/images/shop/shop-team.jpg           — shop photo (used in gallery + as a starter OG image)
public/images/ceo/abdul-jos-portrait.jpg   — Abdul Jos, formal portrait (used in the hero + About)
public/images/ceo/abdul-jos-candid.jpg     — Abdul Jos, candid photo (used in About / homepage)
```

The shop video is embedded directly from the YouTube Shorts link you gave
(`https://youtube.com/shorts/jAYhDnpf-ms`) — no download needed, and it's
editable from **Admin → Settings → Shop video URL**.

**To add more real photos** (more shop photos, more of Abdul Jos, product
photos), use **Admin → Gallery** to upload them, or **Admin → Products** when
adding a phone. You do not need to touch the file system — uploads go
straight to Supabase Storage (see §5).

`public/images/og/cover.jpg` is currently a copy of the shop photo as a
placeholder social-sharing image. Replace it with a proper 1200×630 crop
when you have one ready.

---

## 3. Local setup

```bash
npm install
cp .env.example .env
# edit .env with your real DATABASE_URL, AUTH_SECRET, and Supabase keys

npx prisma migrate dev --name init
npm run db:seed                 # seeds the 12 phone brands + default settings row
npm run admin:create -- "Abdul Jos" "admin@aajoscomm.com" "a-strong-password-here"

npm run dev                     # http://localhost:3000
```

Generate a strong `AUTH_SECRET` with:

```bash
openssl rand -base64 48
```

---

## Running without a database

`DATABASE_URL` is optional. Without it the app still builds and starts, and
stays online:

- Public pages (home, phones, EasyBuy, About, Gallery, Contact) render with the
  business details from the schema defaults; the catalogue is empty and the
  gallery shows the starter photos. Official payment accounts are hidden.
- Database-backed API routes and admin sign-in respond with `503` and a JSON
  message instead of crashing.
- Pages are rendered per request, so as soon as `DATABASE_URL` is set (and the
  migration has been run) the live data appears — no rebuild needed.

---

## 4. Deploying to Netlify

1. **Push this project to a GitHub/GitLab/Bitbucket repository.**
2. **Create a PostgreSQL database.** Any managed Postgres works — Neon,
   Supabase, Railway, and Render all have generous free tiers that work well
   with serverless functions. Copy the connection string it gives you.
3. **In Netlify: "Add new site" → "Import an existing project"** and pick
   your repository. Netlify will detect `netlify.toml` and the
   `@netlify/plugin-nextjs` plugin automatically.
4. **Set environment variables** in Netlify → Site configuration →
   Environment variables. Add every key from `.env.example`:
   - `DATABASE_URL` (and `DIRECT_URL` if your provider needs a separate one)
   - `AUTH_SECRET`
   - `AUTH_SESSION_HOURS` (optional, defaults to 12)
   - `NEXT_PUBLIC_SITE_URL` (your Netlify URL, e.g. `https://aajoscomm.netlify.app`)
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_PHONE_NUMBER`
   - `SUPABASE_URL`, `SUPABASE_SECRET_KEY` (and `SUPABASE_STORAGE_BUCKET` if
     you didn't use the default `aajoscomm-uploads` bucket name) — server-side
     only, never prefix these with `NEXT_PUBLIC_`
5. **Run the database migration against your production database** (from
   your own machine, with `DATABASE_URL` pointed at production):
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```
6. **Create your first admin account** the same way, against production:
   ```bash
   npm run admin:create -- "Abdul Jos" "admin@aajoscomm.com" "a-strong-password-here"
   ```
7. **Trigger a deploy** in Netlify (it will run automatically on push, or
   click "Deploy site" manually).
8. **Verify:**
   - Visit the homepage and confirm the hero, About, and gallery images load.
   - Visit `/admin/login` and sign in with the account you created.
   - Add a test product from `/admin/products/new`, confirm it appears at
     `/phones`, and that "Get current price" opens WhatsApp with the right
     message pre-filled.
   - Check `/sitemap.xml` and `/robots.txt` both load.
9. **Configure your domain** under Netlify → Domain management, once you're
   ready to move off the default `*.netlify.app` address.

---

## 4b. Deploying to Render + Supabase

This project also deploys cleanly to **Render** (persistent Node server) with
**Supabase** as the Postgres provider — and, per §5, Supabase Storage for
uploads. Nothing else about the architecture changes — same Prisma schema,
same routes.

1. **Create a Supabase project** at supabase.com. In **Project Settings →
   Database → Connection string**, copy both:
   - the **pooled** connection (port `6543`, "Transaction" mode) → this is
     your `DATABASE_URL`. Append `?pgbouncer=true&connection_limit=1`.
   - the **direct** connection (port `5432`) → this is your `DIRECT_URL`
     (Prisma needs a non-pooled connection to run migrations).
   - See `.env.example` for the exact shape of both.
2. **Push this project to GitHub/GitLab.**
3. **In Render: New → Blueprint**, point it at your repo. Render will detect
   `render.yaml` and create the web service automatically.
4. **Set the secret environment variables** Render leaves blank
   (`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SITE_URL`,
   `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_PHONE_NUMBER`,
   `SUPABASE_URL`, `SUPABASE_SECRET_KEY`) — Render dashboard → your service →
   Environment. `AUTH_SECRET` is generated for you by the blueprint.
5. **Run the migration against Supabase** (from your own machine, with
   `DATABASE_URL`/`DIRECT_URL` pointed at Supabase):
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   npm run admin:create -- "Abdul Jos" "admin@aajoscomm.com" "a-strong-password-here"
   ```
   > **Already have data in this Supabase database?** (e.g. tables were
   > created earlier with `prisma db push`, or you're migrating an existing
   > production database.) Do **not** run `migrate deploy` blind — it will
   > try to `CREATE TABLE` on tables that already exist and fail (which is
   > safe — it won't drop anything), but the proper fix is to tell Prisma
   > those tables are already up to date first:
   > ```bash
   > npx prisma migrate resolve --applied 20260924000000_init
   > ```
   > Then future `prisma migrate dev` runs will generate clean diffs against
   > this baseline instead of trying to recreate existing tables.
6. **Trigger a deploy** in Render (automatic on push, or "Manual Deploy").
7. **Verify** the same checklist as step 8 in the Netlify section above.

Render can also run migrations automatically on every deploy if you'd rather
not run them by hand: set the service's build command to
`npm run render-build` instead of the default (it runs `prisma migrate
deploy` before `next build`). Left as opt-in here since auto-running
migrations against production on every push is a deliberate choice, not a
default you want by accident.

### Why Supabase Storage for images?

Netlify's deployed functions run on a read-only, ephemeral filesystem, so
files uploaded through `/admin` can't be saved into `/public` at runtime.
This project uploads product and gallery photos to a public Supabase
Storage bucket instead and stores the resulting HTTPS URL in the database.
The server talks to Supabase using the `SUPABASE_SECRET_KEY` service-role
key, which is never sent to the browser — uploads go through the
`POST /api/upload` route, which runs only on the server (`runtime =
"nodejs"`) and requires an authenticated admin session.

If you'd rather use S3 or another provider, everything routes through the
single `uploadImage()` function in `src/lib/upload.ts` — swap its contents
and nothing else needs to change.

---

## 5. Day-to-day admin tasks

All of this is done at `/admin` — no code, no redeploys.

**Add the first phone:**
`/admin/products/new` → pick brand + category, fill in the model name, short
description, full description, RAM/storage/color if relevant, upload one or
more real photos, tick "Available"/"Featured"/"EasyBuy" as applicable → Add
product. It appears on `/phones` immediately.

**Mark a phone unavailable / featured / EasyBuy / hidden:**
`/admin/products` → use the pill buttons next to each product. Each toggle
saves instantly.

**Update business info (phone, WhatsApp, hours, address, socials, payment
accounts, EasyBuy description):**
`/admin/settings` → edit any field → Save settings. The live site updates
immediately.

**Manage the gallery:**
`/admin/gallery` → upload photos, tag them with a category, hide or delete
any image.

**Add a second admin user or reset a password:**
Run `npm run admin:create -- "Name" "email@example.com" "new-password"`
again — it updates the password if that email already exists.

---

## 6. Project structure

```
prisma/schema.prisma        Database schema (Products, Brands, GalleryImage,
                             BusinessSettings, AdminUser)
prisma/seed.ts               Seeds brand list + default settings (no fake products)
scripts/create-admin.ts      CLI to create/update an admin user
src/lib/                     prisma client, auth (JWT sessions), whatsapp
                             link builder, Supabase admin client + storage
                             upload adapter, zod validation schemas,
                             settings helper
src/middleware.ts            Protects all /admin routes
src/app/(site)/              Public website (home, phones, easybuy, about,
                             gallery, contact) — shares Navbar/Footer/mobile
                             action bar via (site)/layout.tsx
src/app/admin/               Admin dashboard: /admin/login is public; every
                             route inside admin/(dashboard)/ requires login
src/app/api/                 REST endpoints backing both the public site and
                             the admin dashboard
```

---

## 7. What was deliberately left out

Per your brief, nothing was invented. These are intentionally absent and
should be filled in as real information becomes available:

- Product prices (by design — always "Get current price" via WhatsApp)
- EasyBuy deposit %, interest, repayment duration, fees, eligibility —
  confirm these directly with customers on WhatsApp until you decide to
  publish fixed terms
- Customer reviews/testimonials, sales statistics, years-in-business claims,
  awards, or branch counts
- Exact GPS coordinates for the shop (add a Google Maps link any time from
  Admin → Settings → "Google Maps link")
