const {withContentlayer} = require("next-contentlayer")
const withTwin = require('./withTwin.js');

/** @type {import('next').NextConfig} */
const nextConfig = withContentlayer(withTwin({
  reactStrictMode: true,
  transpilePackages: ['@danlog/common'],
}));

module.exports = nextConfig;
