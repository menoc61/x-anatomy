let userConfig = undefined;
try {
  userConfig = await import('./v0-user-next.config');
} catch (e) {
  // ignore error
}

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
  experimental: {
    webpackBuildWorker: true,
    optimizeCss: true,
    largePageDataBytes: 128000,
  },

  // IMPORTANT: Required for Prisma on Vercel
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
        source: '/learn',
        destination: '/account/downloads',
        permanent: true,
      }
    ];
  },
};

// Merge user config last (keeps your override logic intact)
mergeConfig(nextConfig, userConfig);

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) return;

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === "object" &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
}

export default nextConfig;
