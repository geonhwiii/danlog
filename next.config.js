const {withContentlayer} = require("next-contentlayer")
const withTwin = require('./withTwin.js');

/** @type {import('next').NextConfig} */
const nextConfig = withContentlayer(withTwin({
  reactStrictMode: true,
  transpilePackages: ['@danlog/common'],
  images: {
    domains: [
      'imgur.com',
      'i.imgur.com',
    ],
  },
  experimental: {
    fontLoaders: [
      { loader: '@next/font/google', options: { weight: '400', style: 'normal', variable: '--firamono', subsets: ['latin'] } },
    ],
  },
}));

module.exports = nextConfig;
