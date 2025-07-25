/**
 * @fileoverview Wrapper temporário para useTranslation
 * @directory src/utils
 * @description Wrapper para evitar problemas com next-i18next durante desenvolvimento
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM v1 Team
 */

// Wrapper temporário para useTranslation
export const useTranslation = (namespace = 'common') => {
  // Função de tradução simples que retorna a chave se não encontrar tradução
  const t = (key) => {
    // Mapeamento básico de traduções para evitar erros
    const translations = {
      'common.loading': 'Carregando...',
      'common.error': 'Erro',
      'common.success': 'Sucesso',
      'common.save': 'Salvar',
      'common.cancel': 'Cancelar',
      'common.edit': 'Editar',
      'common.delete': 'Excluir',
      'common.create': 'Criar',
      'common.search': 'Pesquisar',
      'common.filter': 'Filtrar',
      'common.clear': 'Limpar',
      'common.close': 'Fechar',
      'common.back': 'Voltar',
      'common.next': 'Próximo',
      'common.previous': 'Anterior',
      'dashboard.welcome': 'Bem-vindo ao Dashboard',
      'dashboard.total_tasks': 'Total de Tarefas',
      'dashboard.pending_tasks': 'Tarefas Pendentes',
      'dashboard.completed_tasks': 'Tarefas Concluídas',
      'dashboard.total_users': 'Total de Usuários',
      'dashboard.active_users': 'Usuários Ativos',
      'dashboard.total_groups': 'Total de Grupos',
      'dashboard.active_groups': 'Grupos Ativos',
      'tasks.title': 'Tarefas',
      'tasks.new': 'Nova Tarefa',
      'tasks.edit': 'Editar Tarefa',
      'tasks.details': 'Detalhes da Tarefa',
      'tasks.status': 'Status da Tarefa',
      'tasks.priority': 'Prioridade',
      'tasks.category': 'Categoria',
      'tasks.responsible': 'Responsável',
      'tasks.creator': 'Criador',
      'tasks.deadline': 'Prazo',
      'tasks.description': 'Descrição',
      'tasks.tags': 'Tags',
      'tasks.created': 'Tarefa criada com sucesso',
      'tasks.updated': 'Tarefa atualizada com sucesso',
      'tasks.deleted': 'Tarefa excluída com sucesso',
      'tasks.status_updated': 'Status da tarefa atualizado',
      'tasks.loading': 'Carregando tarefas...',
      'tasks.error_loading': 'Erro ao carregar tarefas',
      'tasks.error_creating': 'Erro ao criar tarefa',
      'tasks.error_updating': 'Erro ao atualizar tarefa',
      'tasks.error_deleting': 'Erro ao excluir tarefa',
      'tasks.no_tasks': 'Nenhuma tarefa encontrada',
      'tasks.filter_applied': 'Filtro aplicado',
      'tasks.filter_cleared': 'Filtro removido',
      'users.title': 'Usuários',
      'users.new': 'Novo Usuário',
      'users.edit': 'Editar Usuário',
      'users.details': 'Detalhes do Usuário',
      'users.name': 'Nome',
      'users.email': 'E-mail',
      'users.cpf': 'CPF',
      'users.phone': 'Telefone',
      'users.status': 'Status',
      'users.profile': 'Perfil',
      'users.created': 'Usuário criado com sucesso',
      'users.updated': 'Usuário atualizado com sucesso',
      'users.deleted': 'Usuário excluído com sucesso',
      'users.loading': 'Carregando usuários...',
      'users.error_loading': 'Erro ao carregar usuários',
      'users.no_users': 'Nenhum usuário encontrado',
      'groups.title': 'Grupos',
      'groups.new': 'Novo Grupo',
      'groups.edit': 'Editar Grupo',
      'groups.details': 'Detalhes do Grupo',
      'groups.name': 'Nome',
      'groups.description': 'Descrição',
      'groups.owner': 'Proprietário',
      'groups.members': 'Membros',
      'groups.created': 'Grupo criado com sucesso',
      'groups.updated': 'Grupo atualizado com sucesso',
      'groups.deleted': 'Grupo excluído com sucesso',
      'groups.loading': 'Carregando grupos...',
      'groups.error_loading': 'Erro ao carregar grupos',
      'groups.no_groups': 'Nenhum grupo encontrado',
      'notifications.title': 'Notificações',
      'notifications.mark_all_read': 'Marcar todas como lidas',
      'notifications.no_notifications': 'Nenhuma notificação',
      'notifications.loading': 'Carregando notificações...',
      'notifications.error_loading': 'Erro ao carregar notificações',
      'auth.login_success': 'Login realizado com sucesso',
      'auth.login_failed': 'Credenciais inválidas',
      'auth.logout_success': 'Logout realizado com sucesso',
      'auth.session_expired': 'Sessão expirada',
      'auth.unauthorized': 'Não autorizado',
      'auth.access_denied': 'Acesso Negado',
      'auth.no_permission': 'Você não tem permissão para acessar esta página.',
      'errors.validation_error': 'Erro de validação',
      'errors.not_found': 'Recurso não encontrado',
      'errors.permission_denied': 'Permissão negada',
      'errors.server_error': 'Erro interno do servidor',
      'errors.network_error': 'Erro de conexão',
      'errors.timeout': 'Tempo limite excedido',
      'errors.invalid_data': 'Dados inválidos',
      'errors.unknown_error': 'Erro desconhecido',
      'success.operation_completed': 'Operação concluída com sucesso',
      'success.data_saved': 'Dados salvos com sucesso',
      'success.data_updated': 'Dados atualizados com sucesso',
      'success.data_deleted': 'Dados excluídos com sucesso',
      'success.changes_saved': 'Alterações salvas'
    }
    
    return translations[key] || key
  }
  
  return { t }
} 