/**
 * @fileoverview Utilitário de logout global
 * @directory src
 * @description Função para limpar localStorage e redirecionar para login
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

export function logout() {
  localStorage.removeItem('userToken')
  localStorage.removeItem('userData')
  localStorage.removeItem('activeContext')
  window.location.href = '/login'
}

export function logoutAndGoHome() {
  localStorage.removeItem('userToken')
  localStorage.removeItem('userData')
  localStorage.removeItem('activeContext')
  window.location.href = '/login'
} 