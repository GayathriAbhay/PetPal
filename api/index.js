import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import {
  getTokenFromReq,
  parseCookies,
  signToken,
  verifyToken,
  setAuthCookie,
  clearAuthCookie,
} from '../src/server/utils.js';

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname; // e.g. /api/auth/register or /api/pets

    // AUTH: register
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      const { name, email, password } = req.body || {};
      if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(400).json({ error: 'User exists' });
      const hash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({ data: { name: name || null, email, password: hash } });
      const token = signToken(user);
      setAuthCookie(res, token);
      return res.json({ id: user.id, email: user.email, name: user.name });
    }

    // AUTH: login
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const { email, password } = req.body || {};
      if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password) return res.status(400).json({ error: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
      const token = signToken(user);
      setAuthCookie(res, token);
      return res.json({ id: user.id, email: user.email, name: user.name });
    }

    // AUTH: logout
    if (pathname === '/api/auth/logout' && req.method === 'POST') {
      clearAuthCookie(res);
      return res.json({ ok: true });
    }

    // AUTH: forgot
    if (pathname === '/api/auth/forgot' && req.method === 'POST') {
      const { email } = req.body || {};
      if (!email) return res.status(400).json({ error: 'Missing email' });
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(200).json({ ok: true });
      const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev_jwt_secret', { expiresIn: '1h' });
      const resetUrl = `${process.env.NEXTAUTH_URL || process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST || process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.MAIL_PORT || process.env.EMAIL_SERVER_PORT || 587),
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME || process.env.EMAIL_SERVER_USER,
          pass: process.env.MAIL_PASSWORD || process.env.EMAIL_SERVER_PASSWORD,
        },
      });
      try {
        await transporter.sendMail({
          to: email,
          from: process.env.MAIL_FROM_ADDRESS || process.env.EMAIL_FROM,
          subject: 'PetPal Password Reset',
          text: `Reset your password: ${resetUrl}`,
          html: `<p>Click to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
        });
      } catch (e) {
        console.error('Email send failed', e);
      }
      return res.json({ ok: true });
    }

    // AUTH: reset-password
    if (pathname === '/api/auth/reset-password' && req.method === 'POST') {
      const { token, password } = req.body || {};
      if (!token || !password) return res.status(400).json({ error: 'Missing token or password' });
      try {
        const data = jwt.verify(token, process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev_jwt_secret');
        const userId = data && typeof data === 'object' ? data.id : null;
        if (!userId) return res.status(400).json({ error: 'Invalid token' });
        const hash = await bcrypt.hash(password, 10);
        await prisma.user.update({ where: { id: userId }, data: { password: hash } });
        return res.json({ ok: true });
      } catch (e) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
    }

    // AUTH: change-password
    if (pathname === '/api/auth/change-password' && req.method === 'POST') {
      const { currentPassword, newPassword } = req.body || {};
      if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Missing passwords' });
      const token = getTokenFromReq(req);
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      const data = verifyToken(token);
      const id = data && data.id;
      if (!id) return res.status(401).json({ error: 'Unauthorized' });
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user || !user.password) return res.status(400).json({ error: 'User not found' });
      const ok = await bcrypt.compare(currentPassword, user.password);
      if (!ok) return res.status(400).json({ error: 'Current password incorrect' });
      const hash = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({ where: { id }, data: { password: hash } });
      return res.json({ ok: true });
    }

    // AUTH: update-profile
    if (pathname === '/api/auth/update-profile' && req.method === 'POST') {
      const { name, email } = req.body || {};
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
    }

    // ME
    if (pathname === '/api/me' && req.method === 'GET') {
      const token = getTokenFromReq(req);
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      try {
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

    // PETS
    if (pathname === '/api/pets') {
      if (req.method === 'GET') {
        const pets = await prisma.pet.findMany({ include: { medicalRecords: true } });
        return res.json(pets);
      }
      if (req.method === 'POST') {
        const token = getTokenFromReq(req);
        if (!token) return res.status(401).json({ error: 'Unauthorized' });
        verifyToken(token);
        const data = req.body;
        const pet = await prisma.pet.create({ data });
        return res.status(201).json(pet);
      }
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // MEDICAL RECORDS
    if (pathname === '/api/medical-records') {
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
    }

    // POSTS
    if (pathname === '/api/posts') {
      if (req.method === 'GET') {
        const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
        return res.json(posts);
      }
      if (req.method === 'POST') {
        const token = getTokenFromReq(req);
        if (!token) return res.status(401).json({ error: 'Unauthorized' });
        verifyToken(token);
        const data = req.body;
        const post = await prisma.post.create({ data });
        return res.status(201).json(post);
      }
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // ADOPTIONS
    if (pathname === '/api/adoptions') {
      if (req.method === 'GET') {
        const list = await prisma.adoptionRequest.findMany({ orderBy: { date: 'desc' } });
        return res.json(list);
      }
      if (req.method === 'POST') {
        const token = getTokenFromReq(req);
        if (!token) return res.status(401).json({ error: 'Unauthorized' });
        verifyToken(token);
        const data = req.body;
        const r = await prisma.adoptionRequest.create({ data });
        return res.status(201).json(r);
      }
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // ALERTS
    if (pathname === '/api/alerts') {
      if (req.method === 'GET') {
        const alerts = await prisma.alert.findMany({ orderBy: { date: 'desc' } });
        return res.json(alerts);
      }
      if (req.method === 'POST') {
        const token = getTokenFromReq(req);
        if (!token) return res.status(401).json({ error: 'Unauthorized' });
        verifyToken(token);
        const data = req.body;
        const a = await prisma.alert.create({ data });
        return res.status(201).json(a);
      }
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // HEALTH
    if (pathname === '/api/health' && req.method === 'GET') {
      return res.json({ ok: true });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}
