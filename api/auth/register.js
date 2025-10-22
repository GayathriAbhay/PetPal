import bcrypt from 'bcryptjs';
import prisma from '../../src/lib/prisma';
import { signToken, setAuthCookie } from '../_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'User exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name: name || null, email, password: hash } });
    const token = signToken(user);
    setAuthCookie(res, token);
    return res.json({ id: user.id, email: user.email, name: user.name });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}
