import { createHmac } from "node:crypto";

export type RateLimitStateInput = {
  attempts: number;
  limit: number;
  windowStartedAt: Date;
  blockedUntil: Date | null;
  now: Date;
  windowMs: number;
  blockMs: number;
};

export type RateLimitDecision = {
  allowed: boolean;
  attempts: number;
  windowStartedAt: Date;
  blockedUntil: Date | null;
  retryAfterSeconds: number;
};

function startNewWindow(now: Date): RateLimitDecision {
  return {
    allowed: true,
    attempts: 1,
    windowStartedAt: now,
    blockedUntil: null,
    retryAfterSeconds: 0,
  };
}

export function nextRateLimitState({
  attempts,
  limit,
  windowStartedAt,
  blockedUntil,
  now,
  windowMs,
  blockMs,
}: RateLimitStateInput): RateLimitDecision {
  if (blockedUntil && blockedUntil.getTime() > now.getTime()) {
    return {
      allowed: false,
      attempts,
      windowStartedAt,
      blockedUntil,
      retryAfterSeconds: Math.ceil(
        (blockedUntil.getTime() - now.getTime()) / 1_000,
      ),
    };
  }

  if (
    (blockedUntil && blockedUntil.getTime() <= now.getTime()) ||
    now.getTime() - windowStartedAt.getTime() >= windowMs
  ) {
    return startNewWindow(now);
  }

  const nextAttempts = attempts + 1;
  if (nextAttempts >= limit) {
    const nextBlockedUntil = new Date(now.getTime() + blockMs);
    return {
      allowed: false,
      attempts: nextAttempts,
      windowStartedAt,
      blockedUntil: nextBlockedUntil,
      retryAfterSeconds: Math.ceil(blockMs / 1_000),
    };
  }

  return {
    allowed: true,
    attempts: nextAttempts,
    windowStartedAt,
    blockedUntil: null,
    retryAfterSeconds: 0,
  };
}

function getRateLimitSecret(explicitSecret?: string): string {
  if (explicitSecret !== undefined) return explicitSecret;

  const secret = process.env.SECURITY_RATE_LIMIT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SECURITY_RATE_LIMIT_SECRET tem de ter pelo menos 32 caracteres.",
    );
  }

  return secret;
}

export function hashRateLimitSubject(
  value: string,
  explicitSecret?: string,
): string {
  return createHmac("sha256", getRateLimitSecret(explicitSecret))
    .update(value)
    .digest("hex");
}
