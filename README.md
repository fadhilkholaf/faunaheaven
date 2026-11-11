# FaunaHeaven

FaunaHeaven is a wildlife education platform built with Next.js App Router, TypeScript, PostgreSQL, Prisma, Better Auth, Tailwind CSS, shadcn/ui, and Zod.

## Getting started

1. Copy `.env` values for `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL`.
2. Install dependencies with `npm install` or `bun install`.
3. Apply the database schema:

```bash
npx prisma migrate dev
npx prisma db seed
```

4. Start the app:

```bash
npm run dev
```

## Architecture

- Public reads are rendered from server components and Prisma queries.
- Auth uses Better Auth email/password sessions backed by the Prisma adapter.
- Mutations live under `src/app/api` and validate inputs with Zod.
- `src/lib/learning.ts` owns enrollment, module completion, course rewards, and quiz reward transactions.
- Business state is stored in PostgreSQL. Only non-critical UI preferences may use browser storage.

## Permissions

Guests can browse the course catalog, public course details, journal articles, and FAQ. Authenticated users can enroll, learn, submit quizzes, earn coins, and edit their profile. Admin roles are present in the schema for the next milestone; the admin interface is intentionally deferred.

## Core flows

- Course completion is idempotent and awards the configured course reward once through `CourseReward` and `CoinTransaction` unique constraints.
- Quiz scores are calculated from server-side answer keys. The client submits only selected option indexes.
- Wallet updates and reward transactions run in Prisma transactions.
- Seed data includes six courses, modules, journal articles, quizzes, categories, and FAQ content.

## Verification

```bash
npm run typecheck
npm run lint
npx prisma validate
npm run build
```

The current milestone includes the learner slice. EcoKuji, FaunaDex, daily missions, promo codes, and admin CRUD are prepared as the next milestone.
