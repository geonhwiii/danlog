const withTwin = require('./withTwin.js');
/** @type {import('next').NextConfig} */
const nextConfig = withTwin({
  reactStrictMode: true,
  transpilePackages: ['@danlog/common'],
});

module.exports = nextConfig;
