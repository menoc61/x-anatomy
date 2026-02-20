#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -f ".env.local" ]; then
  cp .env.example .env.local
  echo "Created .env.local from .env.example"
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is required for local launch but was not found in PATH."
  exit 1
fi

echo "Starting local infrastructure (PostgreSQL + Redis)..."
docker compose up -d

echo "Applying Prisma schema..."
pnpm prisma db push

echo "Seeding local database..."
pnpm seed

echo "Starting Next.js development server..."
pnpm dev
