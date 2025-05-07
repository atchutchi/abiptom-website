/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https://www.google-analytics.com;
              font-src 'self';
              connect-src 'self' https://www.google-analytics.com;
              frame-src 'self' https://www.google.com https://*.google.com https://www.youtube.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'self';
              block-all-mixed-content;
              upgrade-insecure-requests;
            `.replace(/\s{2,}/g, ' ').trim()
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)'
          }
        ]
      }
    ];
  },
  images: {
    domains: ['www.google-analytics.com'],
  },
  reactStrictMode: true
};

export default nextConfig; 