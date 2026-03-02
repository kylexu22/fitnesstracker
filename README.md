## Fitness Tracker MVP

Personal web-based fitness tracker built with:

- Next.js (App Router)
- Tailwind CSS
- Supabase Postgres
- Vercel-ready deployment
- PWA basics (manifest + service worker)

### Implemented MVP Features

- Exercise library management
- Workout split template creation
- Template exercise ordering
- Start session from template (exercise snapshot)
- Live set logging (reps, weight, RPE, notes)
- Session completion
- Workout history and per-session detail
- 30-day analytics summary (sessions, sets, reps, tonnage, top exercises)
- Basic installable PWA setup

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
DATABASE_URL=postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres
```

3. Run database migration:

```bash
npm run db:migrate
```

4. Start development server:

```bash
npm run dev
```

5. Build for production check:

```bash
npm run build
```

## Scripts

- `npm run dev` - start local development
- `npm run lint` - lint project
- `npm run build` - production build
- `npm run db:migrate` - apply SQL schema from `db/schema.sql`