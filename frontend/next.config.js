/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR', 'en', 'es']
  },
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
}

module.exports = nextConfig
