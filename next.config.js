/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    appDir: true,
  },
  webpack: (config, { isServer }) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    });
    if (!isServer) {
      config.resolve.fallback = {
        "fs": false,
        "net": false,
        "tls": false
      }
    }
    return config;
  },
};

module.exports = nextConfig;
