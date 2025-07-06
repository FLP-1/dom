/**
 * @fileoverview Proxy para Nominatim (OpenStreetMap) para geocodificação reversa
 * @directory pages/api
 * @description Permite buscar endereço a partir de latitude/longitude sem erro de CORS
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

export default async function handler(req, res) {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude e longitude são obrigatórias' });
  }
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const response = await fetch(url, { headers: { 'User-Agent': 'DOM-v1/1.0' } });
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro ao buscar endereço' });
    }
    const data = await response.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Erro interno do proxy de geocodificação' });
  }
} 