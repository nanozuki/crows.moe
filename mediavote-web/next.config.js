/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  output: 'standalone',
  webpack(config) {
    config.plugins.push(
      require('unplugin-icons/webpack')({
        compiler: 'jsx',
        jsx: 'react',
        autoInstall: true,
      })
    );
    return config;
  },
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
