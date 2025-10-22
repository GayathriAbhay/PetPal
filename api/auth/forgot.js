import prisma from '../../src/lib/prisma';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev_jwt_secret';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(200).json({ ok: true });

    const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
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
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}
