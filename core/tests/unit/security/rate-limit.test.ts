import { afterEach, describe, expect, it, vi } from "vitest";
import {
  hashRateLimitSubject,
  nextRateLimitState,
} from "@/core/lib/security/rate-limit";

describe("nextRateLimitState", () => {
  it("bloqueia a tentativa que atinge o limite", () => {
    const decision = nextRateLimitState({
      attempts: 4,
      limit: 5,
      windowStartedAt: new Date("2026-07-30T10:00:00Z"),
      blockedUntil: null,
      now: new Date("2026-07-30T10:01:00Z"),
      windowMs: 15 * 60_000,
      blockMs: 15 * 60_000,
    });

    expect(decision.allowed).toBe(false);
    expect(decision.attempts).toBe(5);
    expect(decision.blockedUntil?.toISOString()).toBe(
      "2026-07-30T10:16:00.000Z",
    );
    expect(decision.retryAfterSeconds).toBe(900);
  });

  it("mantém um bloqueio ainda activo sem aumentar as tentativas", () => {
    const decision = nextRateLimitState({
      attempts: 5,
      limit: 5,
      windowStartedAt: new Date("2026-07-30T10:00:00Z"),
      blockedUntil: new Date("2026-07-30T10:16:00Z"),
      now: new Date("2026-07-30T10:10:30Z"),
      windowMs: 15 * 60_000,
      blockMs: 15 * 60_000,
    });

    expect(decision).toMatchObject({
      allowed: false,
      attempts: 5,
      retryAfterSeconds: 330,
    });
  });

  it("abre uma nova janela depois de expirar a janela anterior", () => {
    const now = new Date("2026-07-30T10:20:00Z");
    const decision = nextRateLimitState({
      attempts: 4,
      limit: 5,
      windowStartedAt: new Date("2026-07-30T10:00:00Z"),
      blockedUntil: null,
      now,
      windowMs: 15 * 60_000,
      blockMs: 15 * 60_000,
    });

    expect(decision).toEqual({
      allowed: true,
      attempts: 1,
      windowStartedAt: now,
      blockedUntil: null,
      retryAfterSeconds: 0,
    });
  });

  it("permite uma nova tentativa depois de terminar o bloqueio", () => {
    const now = new Date("2026-07-30T10:16:01Z");
    const decision = nextRateLimitState({
      attempts: 5,
      limit: 5,
      windowStartedAt: new Date("2026-07-30T10:05:00Z"),
      blockedUntil: new Date("2026-07-30T10:16:00Z"),
      now,
      windowMs: 30 * 60_000,
      blockMs: 15 * 60_000,
    });

    expect(decision).toEqual({
      allowed: true,
      attempts: 1,
      windowStartedAt: now,
      blockedUntil: null,
      retryAfterSeconds: 0,
    });
  });
});

describe("hashRateLimitSubject", () => {
  afterEach(() => vi.unstubAllEnvs());

  it.each([undefined, "curto", "x".repeat(31)])(
    "recusa configuração ausente ou curta antes do login (%s)",
    (secret) => {
      vi.stubEnv("SECURITY_RATE_LIMIT_SECRET", secret);
      expect(() => hashRateLimitSubject("teste@example.test")).toThrow(
        "SECURITY_RATE_LIMIT_SECRET tem de ter pelo menos 32 caracteres.",
      );
    },
  );

  it("aceita um segredo de ambiente com 32 caracteres", () => {
    vi.stubEnv("SECURITY_RATE_LIMIT_SECRET", "x".repeat(32));
    expect(hashRateLimitSubject("teste@example.test")).toMatch(/^[a-f0-9]{64}$/);
  });

  it("produz um HMAC estável sem guardar o identificador original", () => {
    const hash = hashRateLimitSubject(
      "The quick brown fox jumps over the lazy dog",
      "key",
    );

    expect(hash).toBe(
      "f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8",
    );
    expect(hash).not.toContain("brown fox");
  });
});
