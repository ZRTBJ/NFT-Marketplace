/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'storage.googleapis.com',
      'crastonic.mypinata.cloud',
      'decir.mypinata.cloud',
      'web2api-dev.decir.io',
    ],
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.csv$/,
      loader: 'csv-loader',
      options: {
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true,
      },
    });

    return config;
  },
  output: 'standalone',
};

module.exports = nextConfig;
