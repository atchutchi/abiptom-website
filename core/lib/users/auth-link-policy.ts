import type { UserRole } from "@/core/lib/db/schema";

type AuthLinkSnapshot = {
  authUserId: string;
};

export function buildAuthLinkUpdatePayload({
  requestedAuthUserId,
  authSnapshot,
}: {
  requestedAuthUserId: string;
  authSnapshot: AuthLinkSnapshot | null;
}) {
  return {
    authUserId: authSnapshot?.authUserId ?? requestedAuthUserId,
  };
}

export function buildAuthAppMetadataUpdatePayload({
  role,
  active,
  mfaEnabled,
}: {
  role: UserRole;
  active: boolean;
  mfaEnabled: boolean;
}) {
  return {
    app_metadata: {
      role,
      active,
      mfa_enabled: mfaEnabled,
    },
  };
}
