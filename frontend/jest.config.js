/**
 * @fileoverview Configuração do Jest para testes
 * @directory frontend
 * @description Configuração completa do Jest para testes unitários e de integração
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM v1 Team
 */

const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Fornece o caminho para o app Next.js para carregar next.config.js e .env
  dir: './',
})

// Configuração customizada do Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    'pages/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}',
    '<rootDir>/pages/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/pages/**/*.{test,spec}.{js,jsx}',
  ],
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
}

module.exports = createJestConfig(customJestConfig) 