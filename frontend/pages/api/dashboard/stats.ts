/**
 * @fileoverview Endpoint de estatísticas do dashboard
 * @directory pages/api/dashboard
 * @description Retorna estatísticas reais do dashboard do banco de dados, adaptadas por perfil de usuário
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { spawn } from 'child_process'
import path from 'path'

interface DashboardStats {
  task_stats: {
    total_tarefas: number
    tarefas_pendentes: number
    tarefas_em_andamento: number
    tarefas_concluidas: number
    tarefas_atrasadas: number
    tarefas_hoje: number
    tarefas_semana: number
  }
  notification_stats: {
    total_notificacoes: number
    notificacoes_nao_lidas: number
    notificacoes_hoje: number
    notificacoes_semana: number
    notificacoes_urgentes: number
    notificacoes_por_tipo: Record<string, number>
  }
  users_online: number
  profile: string
  last_updated: string
  is_fallback?: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardStats | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { profile = 'empregador', user_id = 'user_123' } = req.query

    // Valida perfil
    const validProfiles = ['empregador', 'empregado', 'familiar', 'parceiro', 'subordinado', 'admin', 'owner']
    if (!validProfiles.includes(String(profile))) {
      return res.status(400).json({ error: 'Perfil inválido' })
    }

    // Busca dados do banco usando Python
    const stats = await getStatsFromDatabase(String(profile), String(user_id))
    
    return res.status(200).json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function getStatsFromDatabase(profile: string, user_id: string): Promise<DashboardStats> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(process.cwd(), '..', 'domcore', 'get_dashboard_stats.py')
    
    const pythonProcess = spawn('python', [pythonScript, profile, user_id])
    
    let data = ''
    let error = ''
    
    pythonProcess.stdout.on('data', (chunk) => {
      data += chunk.toString()
    })
    
    pythonProcess.stderr.on('data', (chunk) => {
      error += chunk.toString()
    })
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Erro no script Python:', error)
        console.error('Dados recebidos:', data)
        // Retorna dados simulados em caso de erro
        resolve(getFallbackStats(profile))
        return
      }
      
      // Limpa dados de saída (remove logs do Python)
      const cleanData = data.trim()
      const jsonStart = cleanData.indexOf('{')
      const jsonEnd = cleanData.lastIndexOf('}') + 1
      
      if (jsonStart === -1 || jsonEnd === 0) {
        console.error('Nenhum JSON encontrado nos dados:', cleanData)
        resolve(getFallbackStats(profile))
        return
      }
      
      const jsonData = cleanData.substring(jsonStart, jsonEnd)
      
      try {
        const stats = JSON.parse(jsonData)
        resolve(stats)
      } catch (parseError) {
        console.error('Erro ao fazer parse dos dados:', parseError)
        console.error('Dados que falharam no parse:', jsonData)
        resolve(getFallbackStats(profile))
      }
    })
    
    pythonProcess.on('error', (err) => {
      console.error('Erro ao executar script Python:', err)
      resolve(getFallbackStats(profile))
    })
  })
}

function getFallbackStats(profile: string): DashboardStats {
  // Dados simulados por perfil
  const fallbackData: Record<string, DashboardStats> = {
    empregador: {
      task_stats: {
        total_tarefas: 12,
        tarefas_pendentes: 8,
        tarefas_em_andamento: 3,
        tarefas_concluidas: 1,
        tarefas_atrasadas: 0,
        tarefas_hoje: 2,
        tarefas_semana: 7
      },
      notification_stats: {
        total_notificacoes: 15,
        notificacoes_nao_lidas: 5,
        notificacoes_hoje: 2,
        notificacoes_semana: 8,
        notificacoes_urgentes: 1,
        notificacoes_por_tipo: {
          task_created: 8,
          task_completed: 4,
          payment_due: 3
        }
      },
      users_online: 2,
      profile: 'empregador',
      last_updated: new Date().toISOString(),
      is_fallback: true
    },
    empregado: {
      task_stats: {
        total_tarefas: 5,
        tarefas_pendentes: 3,
        tarefas_em_andamento: 1,
        tarefas_concluidas: 1,
        tarefas_atrasadas: 0,
        tarefas_hoje: 1,
        tarefas_semana: 3
      },
      notification_stats: {
        total_notificacoes: 8,
        notificacoes_nao_lidas: 3,
        notificacoes_hoje: 1,
        notificacoes_semana: 4,
        notificacoes_urgentes: 0,
        notificacoes_por_tipo: {
          task_created: 5,
          task_completed: 3
        }
      },
      users_online: 1,
      profile: 'empregado',
      last_updated: new Date().toISOString(),
      is_fallback: true
    },
    familiar: {
      task_stats: {
        total_tarefas: 2,
        tarefas_pendentes: 1,
        tarefas_em_andamento: 0,
        tarefas_concluidas: 1,
        tarefas_atrasadas: 0,
        tarefas_hoje: 0,
        tarefas_semana: 1
      },
      notification_stats: {
        total_notificacoes: 3,
        notificacoes_nao_lidas: 1,
        notificacoes_hoje: 0,
        notificacoes_semana: 2,
        notificacoes_urgentes: 0,
        notificacoes_por_tipo: {
          family_share: 3
        }
      },
      users_online: 1,
      profile: 'familiar',
      last_updated: new Date().toISOString(),
      is_fallback: true
    },
    parceiro: {
      task_stats: {
        total_tarefas: 20,
        tarefas_pendentes: 12,
        tarefas_em_andamento: 5,
        tarefas_concluidas: 3,
        tarefas_atrasadas: 1,
        tarefas_hoje: 4,
        tarefas_semana: 10
      },
      notification_stats: {
        total_notificacoes: 25,
        notificacoes_nao_lidas: 8,
        notificacoes_hoje: 3,
        notificacoes_semana: 12,
        notificacoes_urgentes: 2,
        notificacoes_por_tipo: {
          task_created: 12,
          payment_received: 8,
          system_alert: 5
        }
      },
      users_online: 4,
      profile: 'parceiro',
      last_updated: new Date().toISOString(),
      is_fallback: true
    },
    subordinado: {
      task_stats: {
        total_tarefas: 8,
        tarefas_pendentes: 5,
        tarefas_em_andamento: 2,
        tarefas_concluidas: 1,
        tarefas_atrasadas: 0,
        tarefas_hoje: 2,
        tarefas_semana: 5
      },
      notification_stats: {
        total_notificacoes: 12,
        notificacoes_nao_lidas: 4,
        notificacoes_hoje: 2,
        notificacoes_semana: 6,
        notificacoes_urgentes: 1,
        notificacoes_por_tipo: {
          task_created: 7,
          task_completed: 3,
          system_alert: 2
        }
      },
      users_online: 2,
      profile: 'subordinado',
      last_updated: new Date().toISOString(),
      is_fallback: true
    },
    admin: {
      task_stats: {
        total_tarefas: 30,
        tarefas_pendentes: 15,
        tarefas_em_andamento: 8,
        tarefas_concluidas: 7,
        tarefas_atrasadas: 2,
        tarefas_hoje: 6,
        tarefas_semana: 15
      },
      notification_stats: {
        total_notificacoes: 40,
        notificacoes_nao_lidas: 12,
        notificacoes_hoje: 5,
        notificacoes_semana: 20,
        notificacoes_urgentes: 3,
        notificacoes_por_tipo: {
          system_alert: 15,
          task_created: 12,
          payment_due: 8,
          task_completed: 5
        }
      },
      users_online: 6,
      profile: 'admin',
      last_updated: new Date().toISOString(),
      is_fallback: true
    },
    owner: {
      task_stats: {
        total_tarefas: 50,
        tarefas_pendentes: 20,
        tarefas_em_andamento: 15,
        tarefas_concluidas: 15,
        tarefas_atrasadas: 3,
        tarefas_hoje: 10,
        tarefas_semana: 25
      },
      notification_stats: {
        total_notificacoes: 60,
        notificacoes_nao_lidas: 15,
        notificacoes_hoje: 8,
        notificacoes_semana: 30,
        notificacoes_urgentes: 5,
        notificacoes_por_tipo: {
          system_alert: 25,
          task_created: 15,
          payment_received: 12,
          task_completed: 8
        }
      },
      users_online: 10,
      profile: 'owner',
      last_updated: new Date().toISOString(),
      is_fallback: true
    }
  }

  return fallbackData[profile] || fallbackData.empregador
} 