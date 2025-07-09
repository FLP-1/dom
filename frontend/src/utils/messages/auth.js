/**
 * @fileoverview Traduções para autenticação
 * @directory src/utils/messages
 * @description Mensagens centralizadas para autenticação e autorização
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

export const authMessages = {
  'pt-BR': {
    // Tokens e autenticação
    'token_not_found': 'Token não encontrado',
    'token_invalid': 'Token inválido',
    'token_expired': 'Token expirado',
    'token_not_provided': 'Token de autenticação não fornecido',
    'refresh_failed': 'Falha ao fazer refresh do token',
    'refresh_error': 'Erro ao renovar token',
    'refresh_success': 'Token renovado com sucesso',
    
    // Login/Logout
    'login_success': 'Login realizado com sucesso',
    'login_failed': 'Credenciais inválidas',
    'login_error': 'Erro no login',
    'logout_success': 'Logout realizado com sucesso',
    'logout_error': 'Erro no logout',
    'session_expired': 'Sessão expirada',
    'unauthorized': 'Não autorizado',
    
    // Permissões e acesso
    'access_denied': 'Acesso Negado',
    'no_permission': 'Você não tem permissão para acessar esta página.',
    'your_profile': 'Seu perfil:',
    'allowed_profiles': 'Perfis permitidos:',
    'not_defined': 'Não definido',
    'insufficient_permissions': 'Permissões insuficientes',
    
    // Navegação
    'go_back': 'Voltar',
    'go_dashboard': 'Ir para Dashboard',
    'go_login': 'Ir para Login',
    
    // Estados
    'loading': 'Carregando...',
    'authenticating': 'Autenticando...',
    'checking_permissions': 'Verificando permissões...',
    
    // Erros gerais
    'server_error': 'Erro interno do servidor',
    'network_error': 'Erro de conexão',
    'validation_error': 'Erro de validação',
    'unknown_error': 'Erro desconhecido'
  },
  'en': {
    // Tokens and authentication
    'token_not_found': 'Token not found',
    'token_invalid': 'Invalid token',
    'token_expired': 'Token expired',
    'token_not_provided': 'Authentication token not provided',
    'refresh_failed': 'Failed to refresh token',
    'refresh_error': 'Error refreshing token',
    'refresh_success': 'Token refreshed successfully',
    
    // Login/Logout
    'login_success': 'Login successful',
    'login_failed': 'Invalid credentials',
    'login_error': 'Login error',
    'logout_success': 'Logout successful',
    'logout_error': 'Logout error',
    'session_expired': 'Session expired',
    'unauthorized': 'Unauthorized',
    
    // Permissions and access
    'access_denied': 'Access Denied',
    'no_permission': 'You do not have permission to access this page.',
    'your_profile': 'Your profile:',
    'allowed_profiles': 'Allowed profiles:',
    'not_defined': 'Not defined',
    'insufficient_permissions': 'Insufficient permissions',
    
    // Navigation
    'go_back': 'Back',
    'go_dashboard': 'Go to Dashboard',
    'go_login': 'Go to Login',
    
    // States
    'loading': 'Loading...',
    'authenticating': 'Authenticating...',
    'checking_permissions': 'Checking permissions...',
    
    // General errors
    'server_error': 'Internal server error',
    'network_error': 'Connection error',
    'validation_error': 'Validation error',
    'unknown_error': 'Unknown error'
  },
  'es': {
    // Tokens y autenticación
    'token_not_found': 'Token no encontrado',
    'token_invalid': 'Token inválido',
    'token_expired': 'Token expirado',
    'token_not_provided': 'Token de autenticación no proporcionado',
    'refresh_failed': 'Error al renovar el token',
    'refresh_error': 'Error al renovar el token',
    'refresh_success': 'Token renovado exitosamente',
    
    // Login/Logout
    'login_success': 'Inicio de sesión exitoso',
    'login_failed': 'Credenciales inválidas',
    'login_error': 'Error en el inicio de sesión',
    'logout_success': 'Cierre de sesión exitoso',
    'logout_error': 'Error en el cierre de sesión',
    'session_expired': 'Sesión expirada',
    'unauthorized': 'No autorizado',
    
    // Permisos y acceso
    'access_denied': 'Acceso Denegado',
    'no_permission': 'No tienes permiso para acceder a esta página.',
    'your_profile': 'Tu perfil:',
    'allowed_profiles': 'Perfiles permitidos:',
    'not_defined': 'No definido',
    'insufficient_permissions': 'Permisos insuficientes',
    
    // Navegación
    'go_back': 'Volver',
    'go_dashboard': 'Ir al Dashboard',
    'go_login': 'Ir al Login',
    
    // Estados
    'loading': 'Cargando...',
    'authenticating': 'Autenticando...',
    'checking_permissions': 'Verificando permisos...',
    
    // Errores generales
    'server_error': 'Error interno del servidor',
    'network_error': 'Error de conexión',
    'validation_error': 'Error de validación',
    'unknown_error': 'Error desconocido'
  }
}

/**
 * Obtém mensagem de autenticação por idioma e chave
 * @param {string} key - Chave da mensagem
 * @param {string} language - Idioma (pt-BR, en, es)
 * @param {Object} variables - Variáveis para substituição
 * @returns {string} Mensagem traduzida
 */
export const getAuthMessage = (key, language = 'pt-BR', variables = {}) => {
  const message = authMessages[language]?.[key] || authMessages['pt-BR'][key] || key
  
  if (variables && Object.keys(variables).length > 0) {
    return message.replace(/\{(\w+)\}/g, (match, variable) => {
      return variables[variable] || match
    })
  }
  
  return message
}

/**
 * Hook para usar mensagens de autenticação
 * @param {string} language - Idioma
 * @returns {Object} Funções de tradução
 */
export const useAuthMessages = (language = 'pt-BR') => {
  return {
    t: (key, variables) => getAuthMessage(key, language, variables),
    getLanguage: () => language,
    setLanguage: (newLanguage) => {
      language = newLanguage
    }
  }
} 