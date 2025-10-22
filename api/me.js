import prisma from '../src/lib/prisma';
import { getTokenFromReq, verifyToken } from './_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const data = verifyToken(token);
    const id = data && data.id;
    if (!id) return res.status(401).json({ error: 'Unauthorized' });
    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true } });
    return res.json(user);
  } catch (e) {
    console.error(e);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
