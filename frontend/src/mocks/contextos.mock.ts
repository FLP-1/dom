/**
 * @fileoverview Mock de contextos de usuário para testes de UI
 * @directory src/mocks
 * @description Simula resposta do endpoint /api/auth/contexts
 * @created 2024-12-19
 * @author DOM Team
 */

import { ContextOption } from '@/components/ContextSelectModal'

export const mockContextos: ContextOption[] = [
  {
    groupId: 'group-1',
    groupName: 'Casa da Maria',
    role: 'empregador',
    profile: 'empregador'
  },
  {
    groupId: 'group-2',
    groupName: 'Casa dos Pais de João',
    role: 'familiar',
    profile: 'familiar'
  },
  {
    groupId: 'group-3',
    groupName: 'Casa da Ana',
    role: 'empregado',
    profile: 'empregado'
  }
] 