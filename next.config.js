/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,

  images: {
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

    return config;
  },
};

module.exports = nextConfig;