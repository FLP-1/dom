/**
 * @fileoverview Endpoint para marcar notificações como lidas
 * @directory pages/api/notifications
 * @description API para marcar notificações individuais ou todas como lidas
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

    if (method !== 'POST') {
      res.setHeader('Allow', ['POST'])
      return res.status(405).json({ 
        error: 'Method Not Allowed',
        message: 'Método não permitido'
      })
    }

    const { notification_id, mark_all = false } = req.body

    if (mark_all) {
      return await markAllAsRead(req, res, user)
    } else {
      if (!notification_id) {
        return res.status(400).json({ 
          error: 'Bad Request',
          message: 'ID da notificação é obrigatório'
        })
      }
      return await markAsRead(req, res, user, notification_id)
    }

  } catch (error) {
    console.error('❌ Erro no endpoint de marcar como lida:', error)
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Erro interno do servidor'
    })
  }
}

/**
 * Marca uma notificação específica como lida
 */
async function markAsRead(req, res, user, notificationId) {
  try {
    // Chama script Python para marcar como lida
    const pythonScript = 'domcore/mark_notification_read.py'
    const command = `python ${pythonScript} --notification-id "${notificationId}" --user-id "${user.id}"`

    const { exec } = require('child_process')
    const util = require('util')
    const execAsync = util.promisify(exec)

    const { stdout, stderr } = await execAsync(command)

    if (stderr) {
      console.error('❌ Erro no script Python:', stderr)
      return res.status(500).json({ 
        error: 'Database Error',
        message: 'Erro ao marcar notificação como lida'
      })
    }

    const notification = JSON.parse(stdout)

    return res.status(200).json({
      success: true,
      data: notification,
      message: 'Notificação marcada como lida'
    })

  } catch (error) {
    console.error('❌ Erro ao marcar notificação como lida:', error)
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Erro ao marcar notificação como lida'
    })
  }
}

/**
 * Marca todas as notificações do usuário como lidas
 */
async function markAllAsRead(req, res, user) {
  try {
    // Chama script Python para marcar todas como lidas
    const pythonScript = 'domcore/mark_all_notifications_read.py'
    const command = `python ${pythonScript} --user-id "${user.id}"`

    const { exec } = require('child_process')
    const util = require('util')
    const execAsync = util.promisify(exec)

    const { stdout, stderr } = await execAsync(command)

    if (stderr) {
      console.error('❌ Erro no script Python:', stderr)
      return res.status(500).json({ 
        error: 'Database Error',
        message: 'Erro ao marcar notificações como lidas'
      })
    }

    const result = JSON.parse(stdout)

    return res.status(200).json({
      success: true,
      data: result,
      message: `${result.count} notificações marcadas como lidas`
    })

  } catch (error) {
    console.error('❌ Erro ao marcar notificações como lidas:', error)
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Erro ao marcar notificações como lidas'
    })
  }
} 