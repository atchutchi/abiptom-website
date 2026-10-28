const DEFAULT_LOCAL_URL = "http://localhost:3000";

function normalizeBaseUrl(value: string) {
  let url = value.trim();

  if (!url) {
    return DEFAULT_LOCAL_URL;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = url.includes("localhost") || url.startsWith("127.0.0.1")
      ? `http://${url}`
      : `https://${url}`;
  }

  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function getAppBaseUrl() {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  return normalizeBaseUrl(
    process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.NEXT_PUBLIC_VERCEL_URL ??
      process.env.VERCEL_URL ??
      DEFAULT_LOCAL_URL
  );
}

export function buildAppUrl(path = "/") {
  return new URL(path, `${getAppBaseUrl()}/`).toString();
}
