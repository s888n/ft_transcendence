const NEXT_PUBLIC_SERVER_ENDPOINT = process.env.NEXT_PUBLIC_SERVER_ENDPOINT

const nextConfig = {
  reactStrictMode: false,
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
      resolveExtensions: [
        '.mdx',
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
        '.mjs',
        '.json',
      ],
    },
  },
  transpilePackages: ['three'],
  output: "standalone",
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: NEXT_PUBLIC_SERVER_ENDPOINT },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
        ]
      }
    ]
  }
};

module.exports = nextConfig;