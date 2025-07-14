/**
 * @fileoverview API de usuários - Listagem
 * @directory pages/api/users
 * @description Endpoint para listar usuários com filtros e paginação (proxy para backend Python)
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Equipe DOM v1
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Recuperar token JWT do header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Não autorizado' });
    }
    const token = authHeader.substring(7);

    // Extrair parâmetros da query
    const { profile, limit = 50, offset = 0, search, status, ativo, grupo } = req.query;

    // Construir comando Python
    const pythonArgs = [
      'domcore/get_users.py',
      '--limit', limit.toString(),
      '--offset', offset.toString()
    ];

    if (profile) pythonArgs.push('--profile', profile);
    if (search) pythonArgs.push('--search', search);
    if (status) pythonArgs.push('--status', status);
    if (ativo) pythonArgs.push('--ativo', ativo);
    if (grupo) pythonArgs.push('--grupo', grupo);

    // Executar script Python
    const { exec } = require('child_process');
    const util = require('util');
    const execAsync = util.promisify(exec);

    const command = `python ${pythonArgs.join(' ')}`;
    console.log('Executando comando:', command);

    const { stdout, stderr } = await execAsync(command, { cwd: process.cwd() });

    if (stderr) {
      console.error('Erro no script Python:', stderr);
    }

    const data = JSON.parse(stdout);
    return res.status(200).json(data);

  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
} 