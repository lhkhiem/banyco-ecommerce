/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static export to allow dynamic pages
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: process.env.NEXT_PUBLIC_API_PORT || '3012',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: process.env.NEXT_PUBLIC_API_PORT || '3012',
        pathname: '**',
      },
      // ✅ Add API domain from env (if set)
      ...(process.env.NEXT_PUBLIC_API_DOMAIN ? [
        {
          protocol: 'http',
          hostname: process.env.NEXT_PUBLIC_API_DOMAIN,
          pathname: '**',
        },
        {
          protocol: 'https',
          hostname: process.env.NEXT_PUBLIC_API_DOMAIN,
          pathname: '**',
        },
      ] : []),
    ],
    formats: ['image/webp', 'image/avif'],
    // Optimize image sizes for mobile performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Enable compression and optimization
  compress: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Note: optimizeCss requires Next.js 15+ or critters package, disabled for Next.js 14
  
  // ✅ SECURITY: Security headers để chống các tấn công phổ biến
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
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
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://connect.facebook.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "img-src 'self' data: https: http:",
              "connect-src 'self' https: http:",
              "frame-src 'self' https://www.google.com",
              "frame-ancestors 'self'"
            ].join('; ')
          }
        ]
      }
    ];
  }
}

export default nextConfig
