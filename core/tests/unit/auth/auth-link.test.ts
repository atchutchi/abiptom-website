import { describe, expect, it } from "vitest";
import {
  buildAuthAppMetadataUpdatePayload,
  buildAuthLinkUpdatePayload,
} from "@/core/lib/users/auth-link-policy";

describe("buildAuthLinkUpdatePayload", () => {
  it("corrige apenas authUserId e nao copia active ou mfa de metadata Auth", () => {
    const payload = buildAuthLinkUpdatePayload({
      requestedAuthUserId: "requested-auth-id",
      authSnapshot: {
        authUserId: "real-auth-id",
      },
    });

    expect(payload).toEqual({ authUserId: "real-auth-id" });
    expect(payload).not.toHaveProperty("activo");
    expect(payload).not.toHaveProperty("mfaEnabled");
  });

  it("usa o authUserId autenticado quando nao existe snapshot adicional", () => {
    expect(
      buildAuthLinkUpdatePayload({
        requestedAuthUserId: "session-auth-id",
        authSnapshot: null,
      })
    ).toEqual({ authUserId: "session-auth-id" });
  });
});

describe("buildAuthAppMetadataUpdatePayload", () => {
  it("guarda papel e estado em app_metadata, nao em user_metadata", () => {
    const payload = buildAuthAppMetadataUpdatePayload({
      role: "dg",
      active: false,
      mfaEnabled: true,
    });

    expect(payload).toEqual({
      app_metadata: {
        role: "dg",
        active: false,
        mfa_enabled: true,
      },
    });
    expect(payload).not.toHaveProperty("user_metadata");
  });
});
