import { config } from 'dotenv';
// Load environment variables at module level
try {
  config({ path: '.env.local' });
} catch {
  console.warn('Could not load .env.local');
}

// Get Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://smakmuyzyaoifhpjapkj.supabase.co';
const SUPABASE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'media';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    console.log('🔧 Configuring Supabase rewrites...');
    console.log('📍 Supabase URL:', SUPABASE_URL);
    console.log('🪣 Bucket:', SUPABASE_BUCKET);
    
    if (!SUPABASE_URL || SUPABASE_URL === 'undefined') {
      console.warn('❌ NEXT_PUBLIC_SUPABASE_URL not found, skipping Supabase rewrites');
      return [];
    }

    try {
      const supabaseHost = new URL(SUPABASE_URL).host;
      
      const rewrites = [
        {
          source: '/media/:path*',
          destination: `https://${supabaseHost}/storage/v1/object/public/${SUPABASE_BUCKET}/:path*`,
        },
      ];
      
      console.log('✅ Supabase rewrites configured successfully');
      console.log('🔄 Rewrite rule:', `/media/:path* → https://${supabaseHost}/storage/v1/object/public/${SUPABASE_BUCKET}/:path*`);
      
      return rewrites;
    } catch (error) {
      console.error('❌ Error configuring Supabase rewrites:', error.message);
      return [];
    }
  },
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
    remotePatterns: (() => {
      const patterns = [
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
          hostname: 'i.ytimg.com',
        },
        {
          protocol: 'https',
          hostname: 'img.youtube.com',
        },
        {
          protocol: 'https',
          hostname: '*.youtube.com',
        },
        {
          protocol: 'https',
          hostname: '*.supabase.co',
        }
      ];

      // Add dynamic Supabase configuration using module-level variables
      if (SUPABASE_URL && SUPABASE_URL !== 'undefined') {
        try {
          const supabaseHost = new URL(SUPABASE_URL).host;
          patterns.push({
            protocol: 'https',
            hostname: supabaseHost,
            pathname: `/storage/v1/object/public/${SUPABASE_BUCKET}/**`,
          });
          console.log('✅ Supabase images pattern added:', supabaseHost);
        } catch (error) {
          console.warn('⚠️ Could not add Supabase images pattern:', error.message);
        }
      }

      return patterns;
    })()
  },
  reactStrictMode: true
};

export default nextConfig; 
