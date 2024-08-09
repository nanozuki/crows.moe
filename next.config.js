/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  experimental: {
    appDir: true,
    mdxRs: true,
  },
  reactStrictMode: true,
  images: {
    loader: 'custom',
    loaderFile: './static-loader.ts',
  }
};

const withMDX = require('@next/mdx')();
module.exports = withMDX(nextConfig);
