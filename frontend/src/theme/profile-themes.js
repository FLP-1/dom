/**
 * @fileoverview Configurações de tema por perfil de usuário
 * @directory src/theme
 * @description Definições de cores, fontes e espaçamentos adaptados por perfil
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

export const profileThemes = {
  empregador: {
    primaryColor: '#2E7D32',
    textSize: {
      small: '0.75rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '2rem'
    },
    spacing: 'compact',
    iconSize: '1.25rem',
    avatarSize: 48,
    cardStyle: {
      background: 'linear-gradient(135deg, #2E7D3215, #2E7D3205)',
      border: '1px solid #2E7D3230'
    },
    description: 'Interface eficiente para mulheres ocupadas, foco em produtividade'
  },
  empregado: {
    primaryColor: '#FF6B35',
    textSize: {
      small: '0.875rem',
      medium: '1.125rem',
      large: '1.5rem',
      xlarge: '2.5rem'
    },
    spacing: 'generous',
    iconSize: '1.5rem',
    avatarSize: 56,
    cardStyle: {
      background: 'linear-gradient(135deg, #FF6B3515, #FF6B3505)',
      border: '1px solid #FF6B3530'
    },
    description: 'Interface simples com textos grandes e botões grandes'
  },
  familiar: {
    primaryColor: '#9C27B0',
    textSize: {
      small: '0.8rem',
      medium: '1rem',
      large: '1.375rem',
      xlarge: '2.25rem'
    },
    spacing: 'medium',
    iconSize: '1.375rem',
    avatarSize: 52,
    cardStyle: {
      background: 'linear-gradient(135deg, #9C27B015, #9C27B005)',
      border: '1px solid #9C27B030'
    },
    description: 'Interface adaptável por idade, compartilhamento fácil'
  },
  parceiro: {
    primaryColor: '#1565C0',
    secondaryColor: '#424242',
    textSize: {
      small: '0.75rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '2rem'
    },
    spacing: 'compact',
    iconSize: '1.25rem',
    avatarSize: 48,
    cardStyle: {
      background: 'linear-gradient(135deg, #1565C015, #1565C005)',
      border: '1px solid #1565C030'
    },
    description: 'Interface empresarial com métricas em destaque'
  },
  subordinado: {
    primaryColor: '#388E3C',
    secondaryColor: '#FFA000',
    textSize: {
      small: '0.75rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '2rem'
    },
    spacing: 'compact',
    iconSize: '1.25rem',
    avatarSize: 48,
    cardStyle: {
      background: 'linear-gradient(135deg, #388E3C15, #388E3C05)',
      border: '1px solid #388E3C30'
    },
    description: 'Interface operacional com clareza de responsabilidades'
  },
  admin: {
    primaryColor: '#D32F2F',
    textSize: {
      small: '0.7rem',
      medium: '0.9rem',
      large: '1.1rem',
      xlarge: '1.8rem'
    },
    spacing: 'dense',
    iconSize: '1.1rem',
    avatarSize: 44,
    cardStyle: {
      background: 'linear-gradient(135deg, #D32F2F15, #D32F2F05)',
      border: '1px solid #D32F2F30'
    },
    description: 'Interface técnica com máxima informação e acesso rápido'
  },
  owner: {
    primaryColor: '#000000',
    secondaryColor: '#FFD700',
    textSize: {
      small: '0.75rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '2rem'
    },
    spacing: 'premium',
    iconSize: '1.25rem',
    avatarSize: 48,
    cardStyle: {
      background: 'linear-gradient(135deg, #00000015, #00000005)',
      border: '1px solid #00000030'
    },
    description: 'Interface premium com visão estratégica e acesso completo'
  }
}

export const getProfileTheme = (profile) => {
  return profileThemes[profile] || profileThemes.empregador
}

export const getProfileColor = (profile) => {
  return getProfileTheme(profile).primaryColor
}

export const getProfileFontSize = (profile, size = 'medium') => {
  return getProfileTheme(profile).textSize[size]
}

export const getProfileSpacing = (profile) => {
  return getProfileTheme(profile).spacing
}

export const getProfileIconSize = (profile) => {
  return getProfileTheme(profile).iconSize
}

export const getProfileAvatarSize = (profile) => {
  return getProfileTheme(profile).avatarSize
}

export const getProfileCardStyle = (profile) => {
  return getProfileTheme(profile).cardStyle
} 