/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
    // ✅ Use environment variable safely in ESM
    typeCheck: typeof process !== 'undefined' && !process.env.SKIP_TYPES,
  },
  images: {
    unoptimized: true,
  },

  // ✔ Turbopack (Next.js 15+)
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

export default nextConfig;