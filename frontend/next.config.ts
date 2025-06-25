const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/usuarios/**',
      },
    ],
  },
};

module.exports = nextConfig;