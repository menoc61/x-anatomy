import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { pingRedis } from "@/lib/redis-health";

export async function GET() {
  const startedAt = Date.now();

  const [database, redis] = await Promise.allSettled([
    prisma.$queryRaw<Array<{ now: Date }>>`SELECT NOW() as now`,
    pingRedis(),
  ]);

  const dbOk = database.status === "fulfilled";
  const redisOk = redis.status === "fulfilled" && redis.value.ok;

  return NextResponse.json(
    {
      ok: dbOk && redisOk,
      elapsedMs: Date.now() - startedAt,
      postgres:
        database.status === "fulfilled"
          ? {
              ok: true,
              message: "PostgreSQL query succeeded",
              timestamp: database.value[0]?.now ?? null,
            }
          : {
              ok: false,
              message: database.reason instanceof Error ? database.reason.message : "Unknown database error",
            },
      redis:
        redis.status === "fulfilled"
          ? redis.value
          : {
              ok: false,
              message: redis.reason instanceof Error ? redis.reason.message : "Unknown redis error",
              host: process.env.REDIS_HOST ?? "127.0.0.1",
              port: Number(process.env.REDIS_PORT ?? 6379),
            },
    },
    { status: dbOk && redisOk ? 200 : 503 },
  );
}
