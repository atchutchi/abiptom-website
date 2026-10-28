import { and, eq, sql } from "drizzle-orm";
import { dbAdmin } from "@/core/lib/db";
import { securityRateLimits } from "@/core/lib/db/schema";
import {
  hashRateLimitSubject,
  nextRateLimitState,
  type RateLimitDecision,
} from "@/core/lib/security/rate-limit";

export type ConsumeRateLimitInput = {
  action: string;
  subject: string;
  limit: number;
  windowMs: number;
  blockMs: number;
  now?: Date;
};

export async function consumeRateLimit({
  action,
  subject,
  limit,
  windowMs,
  blockMs,
  now = new Date(),
}: ConsumeRateLimitInput): Promise<RateLimitDecision> {
  const subjectHash = hashRateLimitSubject(subject);
  const lockKey = `${action}:${subjectHash}`;

  return dbAdmin.transaction(async (tx) => {
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${lockKey}, 0))`,
    );

    const current = await tx.query.securityRateLimits.findFirst({
      where: and(
        eq(securityRateLimits.action, action),
        eq(securityRateLimits.subjectHash, subjectHash),
      ),
    });

    const decision = nextRateLimitState({
      attempts: current?.attempts ?? 0,
      limit,
      windowStartedAt: current?.windowStartedAt ?? now,
      blockedUntil: current?.blockedUntil ?? null,
      now,
      windowMs,
      blockMs,
    });

    await tx
      .insert(securityRateLimits)
      .values({
        action,
        subjectHash,
        attempts: decision.attempts,
        windowStartedAt: decision.windowStartedAt,
        blockedUntil: decision.blockedUntil,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [securityRateLimits.action, securityRateLimits.subjectHash],
        set: {
          attempts: decision.attempts,
          windowStartedAt: decision.windowStartedAt,
          blockedUntil: decision.blockedUntil,
          updatedAt: now,
        },
      });

    return decision;
  });
}
