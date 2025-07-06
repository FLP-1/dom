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

    // Montar query string com os filtros
    const params = new URLSearchParams(req.query).toString();
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

    // Chamar backend Python
    const response = await fetch(`${backendUrl}/api/users?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
} 