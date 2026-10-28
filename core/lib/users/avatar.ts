import { createAdminClient } from "@/core/lib/supabase/admin";

export const AVATAR_BUCKET = "avatars";

const AVATAR_TTL_SECONDS = 60 * 60;

export function getUserInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getAvatarExtension(mimeType: string) {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return null;
  }
}

export async function ensureAvatarBucket() {
  const admin = createAdminClient();
  const { data, error } = await admin.storage.getBucket(AVATAR_BUCKET);

  if (!error && data) {
    return;
  }

  const message = error?.message?.toLowerCase() ?? "";
  const bucketMissing =
    message.includes("not found") ||
    message.includes("does not exist") ||
    message.includes("no rows");

  if (!bucketMissing) {
    throw error;
  }

  const { error: createError } = await admin.storage.createBucket(AVATAR_BUCKET, {
    public: false,
    fileSizeLimit: 2 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  });

  if (createError && !createError.message?.toLowerCase().includes("already exists")) {
    throw createError;
  }
}

export async function getAvatarUrl(storagePath: string | null | undefined) {
  if (!storagePath) {
    return null;
  }

  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(storagePath, AVATAR_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
}
