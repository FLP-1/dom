/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  i18n,
  webpack: (config, { isServer, dev }) => {
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    
    // Configuração específica para Material-UI
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mui/material': path.resolve(__dirname, 'node_modules/@mui/material'),
      '@mui/icons-material': path.resolve(__dirname, 'node_modules/@mui/icons-material'),
    };
    
    // Desabilita completamente barrel optimization
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
    
    // Suprime todos os warnings
    config.infrastructureLogging = {
      level: 'error',
    };
    
    // Configuração para suprimir warnings específicos
    config.stats = {
      warnings: false,
      errors: true,
    };
    
    // Desabilita warnings do webpack
    config.ignoreWarnings = [
      /Critical dependency/,
      /Module not found/,
      /Can't resolve/,
      /__barrel_optimize__/,
    ];
    
    return config;
  },
  // Configurações para otimizar o build
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Desabilita experimental features
  experimental: {
    optimizePackageImports: [],
  },
  // Configuração para suprimir warnings
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig
