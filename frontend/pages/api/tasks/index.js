/**
 * @fileoverview API endpoint para tarefas
 * @directory pages/api/tasks
 * @description Endpoint temporário para tarefas com dados mockados
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
    const { profile, limit = 50, offset = 0, status, priority, search } = req.query;

    switch (method) {
      case 'GET':
        return await getTasks(req, res, token, { profile, limit, offset, status, priority, search });
      
      case 'POST':
        return await createTask(req, res, token);
      
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ 
          success: false,
          message: 'Método não permitido' 
        });
    }
  } catch (error) {
    console.error('❌ Erro no endpoint de tarefas:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}

/**
 * Busca tarefas do usuário
 */
async function getTasks(req, res, token, filters) {
  try {
    const { profile, limit, offset, status, priority, search } = filters;

    // Chama script Python para buscar tarefas
    const pythonScript = '../domcore/get_tasks.py';
    const command = `python ${pythonScript} --profile "${profile}" --limit ${limit} --offset ${offset} --status "${status || ''}" --priority "${priority || ''}" --search "${search || ''}"`;

    const { exec } = require('child_process');
    const util = require('util');
    const execAsync = util.promisify(exec);

    const { stdout, stderr } = await execAsync(command, { cwd: process.cwd() });

    if (stderr) {
      console.error('❌ Erro no script Python:', stderr);
      return res.status(500).json({ 
        success: false,
        message: 'Erro ao buscar tarefas'
      });
    }

    const tasks = JSON.parse(stdout);

    return res.status(200).json({
      success: true,
      tasks: tasks,
      total: tasks.length
    });

  } catch (error) {
    console.error('❌ Erro ao buscar tarefas:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erro ao buscar tarefas'
    });
  }
}

/**
 * Cria uma nova tarefa
 */
async function createTask(req, res, token) {
  try {
    const { 
      titulo, 
      descricao, 
      status = 'pending',
      prioridade = 1,
      categoria,
      data_limite,
      responsavel_id,
      tags = []
    } = req.body;

    // Validação básica
    if (!titulo) {
      return res.status(400).json({ 
        success: false,
        message: 'Título é obrigatório'
      });
    }

    // Chama script Python para criar tarefa
    const pythonScript = '../domcore/create_task.py';
    const taskData = JSON.stringify({
      titulo,
      descricao,
      status,
      prioridade,
      categoria,
      data_limite,
      responsavel_id,
      tags
    });

    const command = `python ${pythonScript} --data '${taskData}'`;

    const { exec } = require('child_process');
    const util = require('util');
    const execAsync = util.promisify(exec);

    const { stdout, stderr } = await execAsync(command, { cwd: process.cwd() });

    if (stderr) {
      console.error('❌ Erro no script Python:', stderr);
      return res.status(500).json({ 
        success: false,
        message: 'Erro ao criar tarefa'
      });
    }

    const task = JSON.parse(stdout);

    return res.status(201).json({
      success: true,
      task: task,
      message: 'Tarefa criada com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro ao criar tarefa:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erro ao criar tarefa'
    });
  }
} 