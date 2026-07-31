/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/HaopengLiuPortfolio',
  assetPrefix: '/HaopengLiuPortfolio/',
  trailingSlash: true,
};

module.exports = nextConfig;
