/**
 * @fileoverview Endpoint para listar notificações
 * @directory pages/api/notifications
 * @description API para buscar e filtrar notificações do usuário
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */

export default async function handler(req, res) {
  const { method } = req

  try {
    // Verifica autenticação simples via header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Token de autenticação não fornecido'
      })
    }

    // Para simplificar, vamos usar um token fixo por enquanto
    const token = authHeader.split(' ')[1]
    if (token !== 'test-token') {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Token inválido'
      })
    }

    // Mock user para desenvolvimento
    const user = {
      id: req.headers['x-user-id'] || 'f16c4010-2cad-4bb7-9229-5e0b63ddd0d2',
      profile: req.headers['x-user-profile'] || 'empregador'
    }

    const { 
      limit = 50, 
      offset = 0, 
      unread_only = false,
      notification_type = null,
      profile = user.profile
    } = req.query

    switch (method) {
      case 'GET':
        return await getNotifications(req, res, user, {
          limit: parseInt(limit),
          offset: parseInt(offset),
          unread_only: unread_only === 'true',
          notification_type,
          profile
        })
      
      case 'POST':
        return await createNotification(req, res, user)
      
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).json({ 
          error: 'Method Not Allowed',
          message: 'Método não permitido'
        })
    }
  } catch (error) {
    console.error('❌ Erro no endpoint de notificações:', error)
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Erro interno do servidor'
    })
  }
}

/**
 * Busca notificações do usuário
 */
async function getNotifications(req, res, user, filters) {
  try {
    const { limit, offset, unread_only, notification_type, profile } = filters

    // Chama script Python para buscar notificações
    const pythonScript = 'domcore/get_notifications.py'
    const command = `python ${pythonScript} --user-id "${user.id}" --profile "${profile}" --limit ${limit} --offset ${offset} --unread-only ${unread_only} --notification-type "${notification_type || ''}"`

    const { exec } = require('child_process')
    const util = require('util')
    const execAsync = util.promisify(exec)

    const { stdout, stderr } = await execAsync(command)

    if (stderr) {
      console.error('❌ Erro no script Python:', stderr)
      return res.status(500).json({ 
        error: 'Database Error',
        message: 'Erro ao buscar notificações'
      })
    }

    const notifications = JSON.parse(stdout)

    return res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        limit,
        offset,
        total: notifications.length
      }
    })

  } catch (error) {
    console.error('❌ Erro ao buscar notificações:', error)
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Erro ao buscar notificações'
    })
  }
}

/**
 * Cria uma nova notificação
 */
async function createNotification(req, res, user) {
  try {
    const { 
      tipo, 
      titulo, 
      mensagem, 
      destinatario_id, 
      remetente_id = null,
      prioridade = 'normal',
      categoria = null,
      dados_extras = {}
    } = req.body

    // Validação básica
    if (!tipo || !titulo || !mensagem || !destinatario_id) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Dados obrigatórios não fornecidos'
      })
    }

    // Chama script Python para criar notificação
    const pythonScript = 'domcore/create_notification.py'
    const notificationData = JSON.stringify({
      tipo,
      titulo,
      mensagem,
      destinatario_id,
      remetente_id,
      prioridade,
      categoria,
      dados_extras
    })

    const command = `python ${pythonScript} --data '${notificationData}'`

    const { exec } = require('child_process')
    const util = require('util')
    const execAsync = util.promisify(exec)

    const { stdout, stderr } = await execAsync(command)

    if (stderr) {
      console.error('❌ Erro no script Python:', stderr)
      return res.status(500).json({ 
        error: 'Database Error',
        message: 'Erro ao criar notificação'
      })
    }

    const notification = JSON.parse(stdout)

    return res.status(201).json({
      success: true,
      data: notification,
      message: 'Notificação criada com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro ao criar notificação:', error)
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Erro ao criar notificação'
    })
  }
} 