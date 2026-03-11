# Local Development Runbook

This project supports a local-first flow with PostgreSQL + Redis.

## Quick start

```bash
pnpm install
cp .env.example .env.local
pnpm local:launch
```

`pnpm local:launch` will automatically:
1. Start Docker services (`postgres`, `redis`)
2. Push Prisma schema
3. Seed demo data
4. Start Next.js dev server

## Seed data details
The seed process is deterministic for local debugging:
- It clears existing app tables first.
- It recreates demo users, subscriptions, muscles, conditions, comments, and videos.
- It prints demo credentials at the end.

## Health checks
- API: `GET /api/health/local`
- UI: **Admin → Settings → Environment → Infrastructure**

## Helpful scripts
- `pnpm infra:up` / `pnpm infra:down`
- `pnpm db:push`
- `pnpm seed`
- `pnpm local:launch`
