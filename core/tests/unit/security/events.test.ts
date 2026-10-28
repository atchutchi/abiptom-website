import { describe, expect, it } from "vitest";
import {
  maskIpAddress,
  sanitizeAuditDetails,
} from "@/core/lib/security/events";

describe("sanitizeAuditDetails", () => {
  it("remove segredos e credenciais em qualquer profundidade", () => {
    expect(
      sanitizeAuditDetails({
        email: "user@example.com",
        password: "secret",
        profile: {
          token: "token-value",
          result: "denied",
        },
        attempts: [
          { authorization: "Bearer secret", status: 401 },
          { cookie: "session=value", status: 403 },
        ],
      }),
    ).toEqual({
      email: "user@example.com",
      profile: { result: "denied" },
      attempts: [{ status: 401 }, { status: 403 }],
    });
  });
});

describe("maskIpAddress", () => {
  it("mascara IPv4 e IPv6 antes de apresentar o histórico", () => {
    expect(maskIpAddress("203.0.113.42")).toBe("203.0.113.x");
    expect(maskIpAddress("2001:db8:abcd:1234::1")).toBe("2001:db8:abcd:1234::");
    expect(maskIpAddress("unknown")).toBe("unknown");
  });
});
