/**
 * @fileoverview Endpoint para estatísticas de usuários
 * @directory pages/api/users
 * @description API para buscar estatísticas de usuários do banco de dados
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

export default async function handler(req, res) {
  const { method } = req;

  try {
    // Verifica autenticação
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Token de autenticação não fornecido'
      });
    }

    const token = authHeader.split(' ')[1];

    switch (method) {
      case 'GET':
        return await getUserStats(req, res, token);
      
      default:
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ 
          success: false,
          message: 'Método não permitido'
        });
    }
  } catch (error) {
    console.error('❌ Erro no endpoint de estatísticas de usuários:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}

/**
 * Busca estatísticas de usuários
 */
async function getUserStats(req, res, token) {
  try {
    // Chama script Python para buscar estatísticas
    const pythonScript = 'domcore/get_user_stats.py';
    const command = `python ${pythonScript}`;

    const { exec } = require('child_process');
    const util = require('util');
    const execAsync = util.promisify(exec);

    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error('❌ Erro no script Python:', stderr);
      return res.status(500).json({ 
        success: false,
        message: 'Erro ao buscar estatísticas'
      });
    }

    const stats = JSON.parse(stdout);

    return res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erro ao buscar estatísticas'
    });
  }
} 