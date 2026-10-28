export type SecurityHeader = {
  key: string;
  value: string;
};

export function buildSecurityHeaders({ nonce, development = false, supabaseUrl }: { nonce?: string; development?: boolean; supabaseUrl?: string } = {}): SecurityHeader[] {
  const origin = supabaseUrl ? new URL(supabaseUrl).origin : '';
  const contentSecurityPolicy = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    `script-src 'self'${nonce ? ` 'nonce-${nonce}' 'strict-dynamic'` : ''}${development ? " 'unsafe-eval'" : ''}`,
    `connect-src 'self' ${origin} ${origin.replace('https:', 'wss:')}${development ? ' ws://localhost:* ws://127.0.0.1:*' : ''}`,
    "media-src 'self' blob:",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    ...(!development ? ["upgrade-insecure-requests"] : []),
  ].join("; ");

  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=()",
    },
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    },
  ];
}
