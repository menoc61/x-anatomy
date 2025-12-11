/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // ✔ Migrate to next js 16
  turbopack: {},

  experimental: {
    webpackBuildWorker: true,
    optimizeCss: true,
    largePageDataBytes: 128000,
  },

  output: "standalone",

  webpack: (config) => {
    config.cache = true;
    config.parallelism = 1;

    // REQUIRED FIX FOR PRISMA CLIENT
    config.externals.push(".prisma/client");

    return config;
  },

  async redirects() {
    return [
      {
        source: "/learn",
        destination: "/account/downloads",
        permanent: true,
      },
    ];
  },
};
