/**
 * @fileoverview Configuração global do i18next
 * @directory frontend/src/utils
 * @description Instância global do i18next para resolver warnings
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM v1 Team
 */

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Mensagens em português
const ptBRMessages = {
  common: {
    save: 'Salvar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Excluir',
    confirm: 'Confirmar',
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    close: 'Fechar',
    back: 'Voltar',
    next: 'Próximo',
    previous: 'Anterior',
    search: 'Buscar',
    filter: 'Filtrar',
    clear: 'Limpar',
    all: 'Todos',
    none: 'Nenhum',
    yes: 'Sim',
    no: 'Não',
    ok: 'OK'
  },
  auth: {
    login: 'Entrar',
    logout: 'Sair',
    email: 'E-mail',
    password: 'Senha',
    forgotPassword: 'Esqueci minha senha',
    rememberMe: 'Lembrar de mim',
    loginError: 'Erro ao fazer login',
    invalidCredentials: 'Credenciais inválidas',
    sessionExpired: 'Sessão expirada'
  },
  dashboard: {
    title: 'Painel Principal',
    welcome: 'Bem-vindo',
    stats: 'Estatísticas',
    recentActivity: 'Atividade Recente',
    quickActions: 'Ações Rápidas'
  },
  navigation: {
    dashboard: 'Painel',
    people: 'Pessoas',
    tasks: 'Tarefas',
    groups: 'Grupos',
    notifications: 'Notificações',
    settings: 'Configurações',
    profile: 'Perfil'
  },
  empregador: {
    dashboard: {
      title: 'Meu Painel',
      stats: 'Estatísticas do Grupo',
      recentTasks: 'Tarefas Recentes',
      pendingApprovals: 'Aprovações Pendentes'
    },
    people: {
      title: 'Gerenciar Pessoas',
      addPerson: 'Adicionar Pessoa',
      editPerson: 'Editar Pessoa',
      viewProfile: 'Ver Perfil'
    },
    tasks: {
      title: 'Gerenciar Tarefas',
      createTask: 'Criar Tarefa',
      assignTask: 'Atribuir Tarefa',
      trackProgress: 'Acompanhar Progresso'
    }
  },
  empregado: {
    dashboard: {
      title: 'Minhas Tarefas',
      todayTasks: 'Tarefas de Hoje',
      completedTasks: 'Tarefas Concluídas',
      pendingTasks: 'Tarefas Pendentes'
    },
    tasks: {
      title: 'Minhas Tarefas',
      startTask: 'Iniciar Tarefa',
      completeTask: 'Concluir Tarefa',
      reportIssue: 'Reportar Problema'
    }
  },
  familiar: {
    dashboard: {
      title: 'Acompanhamento Familiar',
      familyOverview: 'Visão Geral da Família',
      sharedTasks: 'Tarefas Compartilhadas'
    },
    people: {
      title: 'Família',
      viewFamily: 'Ver Família',
      helpWithTasks: 'Ajudar com Tarefas'
    }
  }
}

// Mensagens em inglês
const enMessages = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    all: 'All',
    none: 'None',
    yes: 'Yes',
    no: 'No',
    ok: 'OK'
  },
  auth: {
    login: 'Login',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password',
    rememberMe: 'Remember Me',
    loginError: 'Login Error',
    invalidCredentials: 'Invalid Credentials',
    sessionExpired: 'Session Expired'
  },
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome',
    stats: 'Statistics',
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions'
  },
  navigation: {
    dashboard: 'Dashboard',
    people: 'People',
    tasks: 'Tasks',
    groups: 'Groups',
    notifications: 'Notifications',
    settings: 'Settings',
    profile: 'Profile'
  }
}

// Configuração do i18next
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        'pt-BR': {
          translation: ptBRMessages
        },
        'en': {
          translation: enMessages
        }
      },
      lng: 'pt-BR', // idioma padrão
      fallbackLng: 'pt-BR',
      debug: process.env.NODE_ENV === 'development',
      
      interpolation: {
        escapeValue: false, // React já escapa valores
      },
      
      react: {
        useSuspense: false, // Importante para SSR
      },
      
      // Configurações de detecção de idioma
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
      }
    })
}

export default i18n 