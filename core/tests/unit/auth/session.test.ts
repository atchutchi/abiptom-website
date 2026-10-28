import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getUser: vi.fn(), repair: vi.fn() }));
vi.mock("@/core/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser: mocks.getUser } }),
}));
vi.mock("@/core/lib/users/auth-link", () => ({ repairInternalUserFromAuth: mocks.repair }));
import { getCurrentUser } from "@/core/lib/auth/session";

describe("session diagnostics", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it("diagnoses a rejected auth session without logging credentials or the raw error", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: {
      code: "session_not_found", status: 401, message: "private-token-and-email",
    } });
    expect(await getCurrentUser()).toEqual({ user: null, dbUser: null });
    expect(warn).toHaveBeenCalledWith("auth.session.unavailable", expect.objectContaining({
      reason: "auth_error", code: "session_not_found", status: 401,
    }));
    expect(JSON.stringify(warn.mock.calls)).not.toContain("private-token-and-email");
    expect(mocks.repair).not.toHaveBeenCalled();
  });

  it("distinguishes an inactive internal profile from an invalid auth session", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const user = { id: "user-1", email: "private@example.test" };
    mocks.getUser.mockResolvedValue({ data: { user }, error: null });
    mocks.repair.mockResolvedValue({ id: "internal-1", activo: false });
    expect(await getCurrentUser()).toEqual({ user, dbUser: null });
    expect(warn).toHaveBeenCalledWith("auth.session.unavailable", expect.objectContaining({ reason: "inactive_profile" }));
    expect(JSON.stringify(warn.mock.calls)).not.toContain(user.email);
  });

  it("returns an active authenticated user without logging a failure", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const user = { id: "user-1" };
    const dbUser = { id: "internal-1", activo: true };
    mocks.getUser.mockResolvedValue({ data: { user }, error: null });
    mocks.repair.mockResolvedValue(dbUser);
    expect(await getCurrentUser()).toEqual({ user, dbUser });
    expect(warn).not.toHaveBeenCalled();
  });

  it("retries one transient authentication timeout before rejecting the session", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const user = { id: "user-1" };
    const dbUser = { id: "internal-1", activo: true };
    mocks.getUser
      .mockResolvedValueOnce({
        data: { user: null },
        error: { code: undefined, status: 504, message: "upstream timeout" },
      })
      .mockResolvedValueOnce({ data: { user }, error: null });
    mocks.repair.mockResolvedValue(dbUser);

    expect(await getCurrentUser()).toEqual({ user, dbUser });
    expect(mocks.getUser).toHaveBeenCalledTimes(2);
    expect(warn).not.toHaveBeenCalledWith(
      "auth.session.unavailable",
      expect.anything(),
    );
  });
});
