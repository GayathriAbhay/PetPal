import prisma from '../../src/lib/prisma';
import { getTokenFromReq, verifyToken } from '../_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { name, email } = req.body;
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const data = verifyToken(token);
    const id = data && data.id;
    if (!id) return res.status(401).json({ error: 'Unauthorized' });
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    try {
      const user = await prisma.user.update({ where: { id }, data: update, select: { id: true, name: true, email: true } });
      return res.json(user);
    } catch (e) {
      return res.status(400).json({ error: 'Could not update profile' });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}
