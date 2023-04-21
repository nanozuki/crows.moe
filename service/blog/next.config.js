/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    mdxRs: true,
  },
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'strapi.us-east-1.linodeobjects.com',
      },
    ],
  },
};

const withMDX = require('@next/mdx')();
module.exports = withMDX(nextConfig);
