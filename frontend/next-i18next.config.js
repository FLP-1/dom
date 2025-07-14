/**
 * @fileoverview Configuração do next-i18next
 * @directory frontend
 * @description Configuração para internacionalização com Next.js
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM v1 Team
 */

module.exports = {
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR', 'en', 'es'],
  },
  
  // Configuração do i18next
  react: {
    useSuspense: false,
  },
  
  // Configuração de fallback
  fallbackLng: 'pt-BR',
  
  // Configuração de interpolação
  interpolation: {
    escapeValue: false,
  }
} 