/**
 * @fileoverview Endpoint para operações CRUD de notificações individuais
 * @directory pages/api/notifications/[id]
 * @description API para buscar, atualizar e deletar notificações específicas
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */

export default async function handler(req, res) {
  const { method } = req
  const { id } = req.query

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

    switch (method) {
      case 'GET':
        return await getNotification(req, res, user, id)
      
      case 'PUT':
        return await updateNotification(req, res, user, id)
      
      case 'DELETE':
        return await deleteNotification(req, res, user, id)
      
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        return res.status(405).json({ 
          error: 'Method Not Allowed',
          message: 'Método não permitido'
        })
    }
  } catch (error) {
    console.error('❌ Erro no endpoint de notificação individual:', error)
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Erro interno do servidor'
    })
  }
}

/**
 * Busca uma notificação específica
 */
async function getNotification(req, res, user, notificationId) {
  try {
    // Chama script Python para buscar notificação
    const pythonScript = 'domcore/get_notification.py'
    const command = `python ${pythonScript} --notification-id "${notificationId}" --user-id "${user.id}"`

    const { exec } = require('child_process')
    const util = require('util')
    const execAsync = util.promisify(exec)

    const { stdout, stderr } = await execAsync(command)

    if (stderr) {
      console.error('❌ Erro no script Python:', stderr)
      return res.status(500).json({ 
        error: 'Database Error',
        message: 'Erro ao buscar notificação'
      })
    }

    const notification = JSON.parse(stdout)

    return res.status(200).json({
      success: true,
      data: notification
    })

  } catch (error) {
    console.error('❌ Erro ao buscar notificação:', error)
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Erro ao buscar notificação'
    })
  }
}

/**
 * Atualiza uma notificação
 */
async function updateNotification(req, res, user, notificationId) {
  try {
    const { 
      titulo, 
      mensagem, 
      lida, 
      prioridade, 
      categoria, 
      dados_extras, 
      ativo 
    } = req.body

    // Chama script Python para atualizar notificação
    const pythonScript = 'domcore/update_notification.py'
    const updateData = JSON.stringify({
      notification_id: notificationId,
      user_id: user.id,
      titulo,
      mensagem,
      lida,
      prioridade,
      categoria,
      dados_extras,
      ativo
    })

    const command = `python ${pythonScript} --data '${updateData}'`

    const { exec } = require('child_process')
    const util = require('util')
    const execAsync = util.promisify(exec)

    const { stdout, stderr } = await execAsync(command)

    if (stderr) {
      console.error('❌ Erro no script Python:', stderr)
      return res.status(500).json({ 
        error: 'Database Error',
        message: 'Erro ao atualizar notificação'
      })
    }

    const notification = JSON.parse(stdout)

    return res.status(200).json({
      success: true,
      data: notification,
      message: 'Notificação atualizada com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro ao atualizar notificação:', error)
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Erro ao atualizar notificação'
    })
  }
}

/**
 * Deleta uma notificação
 */
async function deleteNotification(req, res, user, notificationId) {
  try {
    // Chama script Python para deletar notificação
    const pythonScript = 'domcore/delete_notification.py'
    const command = `python ${pythonScript} --notification-id "${notificationId}" --user-id "${user.id}"`

    const { exec } = require('child_process')
    const util = require('util')
    const execAsync = util.promisify(exec)

    const { stdout, stderr } = await execAsync(command)

    if (stderr) {
      console.error('❌ Erro no script Python:', stderr)
      return res.status(500).json({ 
        error: 'Database Error',
        message: 'Erro ao deletar notificação'
      })
    }

    const result = JSON.parse(stdout)

    return res.status(200).json({
      success: true,
      message: 'Notificação deletada com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro ao deletar notificação:', error)
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Erro ao deletar notificação'
    })
  }
} 