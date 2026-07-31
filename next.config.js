/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GH_PAGES === 'true';
const basePath = isGithubPages ? '/HaopengLiuPortfolio' : '';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

module.exports = nextConfig;
