/** @type {import('next').NextConfig} */
const path = require('path');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: false,

  // Enable production optimizations
  compress: true,
  swcMinify: true,
  productionBrowserSourceMaps: false,

  // Optimize fonts
  optimizeFonts: true,

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Modularize imports for better tree-shaking
  modularizeImports: {
    'react-icons': {
      transform: 'react-icons/{{member}}',
    },
  },

  transpilePackages: [
    'rc-util',
    'rc-picker',
    'rc-tree',
    'rc-table',
    'rc-input',
    'rc-pagination',
    '@ant-design/icons',
    '@ant-design/icons-svg',
    'next-sanity',
    '@portabletext/react'
  ],
  experimental: {
    esmExternals: 'loose', // important for Vercel builds!
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/sanity/:slug*',
        destination: '/sanity',
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
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
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
      // Cache static assets aggressively
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ },
        use: ['@svgr/webpack'],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    config.module.rules.forEach(rule => {
      if (!rule.oneOf) return;

      rule.oneOf.forEach(one => {
        if (!`${one.issuer?.and}`.includes('_app')) return;
        one.issuer.and = [path.resolve(__dirname)];
      });
    });

    config.resolve.extensions.push('.js', '.mjs');


    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);