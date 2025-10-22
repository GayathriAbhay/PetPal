import prisma from './src/lib/prisma';
import { getTokenFromReq, verifyToken } from './_utils.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const records = await prisma.medicalRecord.findMany({ orderBy: { date: 'desc' } });
      return res.json(records);
    }
    if (req.method === 'POST') {
      const token = getTokenFromReq(req);
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      verifyToken(token);
      const data = req.body;
      const rec = await prisma.medicalRecord.create({ data });
      return res.status(201).json(rec);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}
