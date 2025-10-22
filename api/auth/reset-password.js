import prisma from '../../src/lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev_jwt_secret';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Missing token or password' });
    try {
      const data = jwt.verify(token, JWT_SECRET);
      const userId = data && typeof data === 'object' ? data.id : null;
      if (!userId) return res.status(400).json({ error: 'Invalid token' });
      const hash = await bcrypt.hash(password, 10);
      await prisma.user.update({ where: { id: userId }, data: { password: hash } });
      return res.json({ ok: true });
    } catch (e) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}
