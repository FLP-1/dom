/** @type {import('next').NextConfig} */
const path = require('path');
const { i18n } = require('./next-i18next.config.js');

const nextConfig = {
  reactStrictMode: true,
  i18n,
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    
    // Otimizações apenas para client-side (não SSR)
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
  // Otimizações de build
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Configuração para suprimir warnings específicos
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Rewrites
  async rewrites() {
    return [
      {
        source: '/api/auth/login',
        destination: 'http://localhost:8000/auth/login',
      },
      {
        source: '/api/tasks',
        destination: 'http://localhost:8000/tasks',
      },
      {
        source: '/api/tasks/:id',
        destination: 'http://localhost:8000/tasks/:id',
      },
      {
        source: '/api/tasks/:id/status',
        destination: 'http://localhost:8000/tasks/:id/status',
      },
      // ... outros rewrites se necessário ...
    ]
  },
}

module.exports = nextConfig
