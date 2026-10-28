import { describe, expect, it } from "vitest";
import { buildSecurityHeaders } from "@/core/lib/security/headers";

describe("buildSecurityHeaders", () => {
  it("impede enquadramento e reduz capacidades do navegador", () => {
    const headers = Object.fromEntries(
      buildSecurityHeaders().map(({ key, value }) => [key, value]),
    );

    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["Permissions-Policy"]).toContain("camera=()");
    expect(headers["Permissions-Policy"]).toContain("microphone=()");
    expect(headers["Content-Security-Policy"]).toContain(
      "frame-ancestors 'none'",
    );
    expect(headers["Content-Security-Policy"]).toContain("object-src 'none'");
    expect(headers["Content-Security-Policy"]).not.toContain("unsafe-eval");
  });
});
