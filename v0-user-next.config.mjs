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
              script-src 'self' 'unsafe-inline' 'unsafe-eval' 
                https://www.googletagmanager.com 
                https://www.google-analytics.com 
                https://www.youtube.com 
                https://*.youtube.com 
                https://maps.googleapis.com 
                https://*.googleapis.com
                https://cdn.jsdelivr.net;
              style-src 'self' 'unsafe-inline' 
                https://fonts.googleapis.com 
                https://*.googleapis.com;
              img-src 'self' data: blob: 
                https://www.google-analytics.com 
                https://maps.googleapis.com 
                https://*.googleapis.com 
                https://img.youtube.com 
                https://*.ytimg.com
                https://i.ytimg.com
                https://smakmuyzyaoifhpjapkj.supabase.co;
              font-src 'self' 
                https://fonts.gstatic.com 
                https://fonts.googleapis.com;
              connect-src 'self' 
                https://www.google-analytics.com 
                https://maps.googleapis.com 
                https://*.googleapis.com
                https://smakmuyzyaoifhpjapkj.supabase.co;
              frame-src 'self' 
                https://www.google.com 
                https://*.google.com 
                https://www.youtube.com 
                https://*.youtube.com 
                https://youtube.com
                https://maps.google.com
                https://www.google.com/maps;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              upgrade-insecure-requests;
            `.replace(/\s{2,}/g, ' ').trim()
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
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
    domains: [
      'www.google-analytics.com',
      'maps.googleapis.com',
      'img.youtube.com',
      'i.ytimg.com',
      'smakmuyzyaoifhpjapkj.supabase.co'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '*.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: '*.youtube.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      }
    ]
  },
  reactStrictMode: true
};

export default nextConfig; 