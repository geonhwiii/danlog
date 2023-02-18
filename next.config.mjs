import withTwin from './withTwin.js';

/** @type {import('next').NextConfig} */
const nextConfig = withTwin({
  reactStrictMode: true,
  transpilePackages: ['@danlog/common'],
});

export default nextConfig;
