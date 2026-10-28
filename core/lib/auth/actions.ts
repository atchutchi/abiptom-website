"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { buildAppUrl } from "@/core/lib/app-url";
import { getPostLoginRedirectPath } from "@/core/lib/auth/redirects";
import {
  getRequestIp,
  normalizeAuthEmail,
} from "@/core/lib/auth/request-security";
import { consumeRateLimit } from "@/core/lib/security/rate-limit-db";
import { hashRateLimitSubject } from "@/core/lib/security/rate-limit";
import { recordSecurityEvent } from "@/core/lib/security/events";
import { createClient } from "@/core/lib/supabase/server";
import {
  repairInternalUserFromAuth,
  syncAuthMetadataForDbUser,
} from "@/core/lib/users/auth-link";
import { getCurrentUser as readCurrentUser } from "./session";

export type AuthActionState = {
  error: string;
  success: string;
};

const LOGIN_ERROR = "Email ou palavra-passe incorrectos.";
const LIMIT_ERROR = "Demasiadas tentativas. Tenta novamente mais tarde.";
const RESET_SUCCESS =
  "Se existir uma conta com esse email, enviámos um link para redefinir a palavra-passe.";

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = normalizeAuthEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "") || null;
  const requestHeaders = await headers();
  const requestIp = getRequestIp(requestHeaders);
  const emailHash = hashRateLimitSubject(email || "empty");

  const [ipDecision, emailDecision] = await Promise.all([
    consumeRateLimit({
      action: "login-ip",
      subject: requestIp,
      limit: 20,
      windowMs: 15 * 60_000,
      blockMs: 15 * 60_000,
    }),
    consumeRateLimit({
      action: "login-email",
      subject: email || "empty",
      limit: 5,
      windowMs: 15 * 60_000,
      blockMs: 15 * 60_000,
    }),
  ]);

  if (!ipDecision.allowed || !emailDecision.allowed) {
    await recordSecurityEvent({
      action: "auth.login",
      entity: "authentication",
      result: "blocked",
      severity: "warning",
      requestHeaders,
      after: { emailHash },
    });
    return { error: LIMIT_ERROR, success: "" };
  }

  if (!email || !password) {
    await recordSecurityEvent({
      action: "auth.login",
      entity: "authentication",
      result: "failure",
      severity: "warning",
      requestHeaders,
      after: { emailHash },
    });
    return { error: LOGIN_ERROR, success: "" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    await recordSecurityEvent({
      action: "auth.login",
      entity: "authentication",
      result: "failure",
      severity: "warning",
      requestHeaders,
      after: { emailHash },
    });
    return { error: LOGIN_ERROR, success: "" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    await recordSecurityEvent({
      action: "auth.login",
      entity: "authentication",
      result: "failure",
      severity: "warning",
      requestHeaders,
      after: { emailHash },
    });
    return { error: LOGIN_ERROR, success: "" };
  }

  const dbUser = await repairInternalUserFromAuth({
    authUserId: user.id,
    email: user.email,
  });
  if (!dbUser || !dbUser.activo) {
    await supabase.auth.signOut();
    await recordSecurityEvent({
      action: "auth.login",
      entity: "authentication",
      result: "denied",
      severity: "warning",
      requestHeaders,
      after: { emailHash },
    });
    return { error: LOGIN_ERROR, success: "" };
  }

  try {
    await syncAuthMetadataForDbUser(dbUser);
  } catch (syncError) {
    console.error("Falha ao sincronizar metadata Auth no login", syncError);
  }

  await recordSecurityEvent({
    actorId: dbUser.id,
    action: "auth.login",
    entity: "authentication",
    entityId: dbUser.id,
    result: "success",
    requestHeaders,
  });
  revalidatePath("/", "layout");
  redirect(getPostLoginRedirectPath(dbUser.role, nextPath));
}

export async function requestPasswordResetAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = normalizeAuthEmail(String(formData.get("email") ?? ""));
  const requestHeaders = await headers();
  const requestIp = getRequestIp(requestHeaders);
  const emailHash = hashRateLimitSubject(email || "empty");

  const [ipDecision, emailDecision] = await Promise.all([
    consumeRateLimit({
      action: "password-reset-ip",
      subject: requestIp,
      limit: 6,
      windowMs: 60 * 60_000,
      blockMs: 60 * 60_000,
    }),
    consumeRateLimit({
      action: "password-reset-email",
      subject: email || "empty",
      limit: 3,
      windowMs: 60 * 60_000,
      blockMs: 60 * 60_000,
    }),
  ]);

  if (!ipDecision.allowed || !emailDecision.allowed) {
    await recordSecurityEvent({
      action: "auth.password_reset",
      entity: "authentication",
      result: "blocked",
      severity: "warning",
      requestHeaders,
      after: { emailHash },
    });
    return { error: LIMIT_ERROR, success: "" };
  }

  let resetFailed = false;
  if (email) {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: buildAppUrl("/auth/confirm?next=/update-password"),
    });
    resetFailed = Boolean(error);
  }

  await recordSecurityEvent({
    action: "auth.password_reset",
    entity: "authentication",
    result: resetFailed ? "failure" : "success",
    severity: resetFailed ? "warning" : "info",
    requestHeaders,
    after: { emailHash },
  });

  return { error: "", success: RESET_SUCCESS };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function getCurrentUser() {
  return readCurrentUser();
}
