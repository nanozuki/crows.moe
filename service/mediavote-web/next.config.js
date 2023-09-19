/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/mediavote/v1/:path*',
        destination: 'http://localhost:8080/mediavote/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
