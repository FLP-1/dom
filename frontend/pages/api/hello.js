/**
 * @fileoverview API de teste
 * @directory frontend/pages/api
 * @description Endpoint de teste simples
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM v1 Team
 */

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
