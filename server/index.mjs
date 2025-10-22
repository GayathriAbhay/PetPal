import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { prisma } from "./prismaClient.mjs";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "dev_jwt_secret";
const COOKIE_NAME = "petpal_token";

// Nodemailer transporter (Brevo / SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.MAIL_PORT || process.env.EMAIL_SERVER_PORT || 587),
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME || process.env.EMAIL_SERVER_USER,
    pass: process.env.MAIL_PASSWORD || process.env.EMAIL_SERVER_PASSWORD,
  },
});

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
}

function authMiddleware(req, res, next) {
  const token = req.cookies[COOKIE_NAME] || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Auth routes
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing email or password" });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: "User exists" });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, password: hash } });
  const token = signToken(user);
  res.cookie(COOKIE_NAME, token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 7 * 24 * 3600 * 1000 });
  res.json({ id: user.id, email: user.email, name: user.name });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing email or password" });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) return res.status(400).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: "Invalid credentials" });
  const token = signToken(user);
  res.cookie(COOKIE_NAME, token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 7 * 24 * 3600 * 1000 });
  res.json({ id: user.id, email: user.email, name: user.name });
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ ok: true });
});

app.get("/api/me", authMiddleware, async (req, res) => {
  const { id } = req.user || {};
  if (!id) return res.status(401).json({ error: "Unauthorized" });
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true } });
  res.json(user);
});

// Password reset (forgot) - generate token and send email
app.post("/api/auth/forgot", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Missing email" });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(200).json({ ok: true }); // don't reveal
  const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
  const resetUrl = `${process.env.NEXTAUTH_URL || process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
  try {
    await transporter.sendMail({
      to: email,
      from: process.env.MAIL_FROM_ADDRESS || process.env.EMAIL_FROM,
      subject: "PetPal Password Reset",
      text: `Reset your password: ${resetUrl}`,
      html: `<p>Click to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });
  } catch (e) {
    console.error("Email send failed", e);
  }
  res.json({ ok: true });
});

// Reset password using token
app.post("/api/auth/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: "Missing token or password" });
  try {
    const data = jwt.verify(token, JWT_SECRET);
    const userId = data && typeof data === 'object' ? data.id : null;
    const hash = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: hash } });
    res.json({ ok: true });
  } catch (e) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }
});

// Change password while authenticated
app.post("/api/auth/change-password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: "Missing passwords" });
  const { id } = req.user || {};
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || !user.password) return res.status(400).json({ error: "User not found" });
  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) return res.status(400).json({ error: "Current password incorrect" });
  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id }, data: { password: hash } });
  res.json({ ok: true });
});

// Update profile (name/email)
app.post("/api/auth/update-profile", authMiddleware, async (req, res) => {
  const { name, email } = req.body;
  const { id } = req.user || {};
  if (!id) return res.status(401).json({ error: "Unauthorized" });
  const update = {};
  if (name) update.name = name;
  if (email) update.email = email;
  try {
    const user = await prisma.user.update({ where: { id }, data: update, select: { id: true, name: true, email: true } });
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: "Could not update profile" });
  }
});

// API: pets
app.get("/api/pets", async (req, res) => {
  const pets = await prisma.pet.findMany({ include: { medicalRecords: true } });
  res.json(pets);
});

app.post("/api/pets", authMiddleware, async (req, res) => {
  const data = req.body;
  const pet = await prisma.pet.create({ data });
  res.status(201).json(pet);
});

// API: medical records
app.get("/api/medical-records", async (req, res) => {
  const records = await prisma.medicalRecord.findMany({ orderBy: { date: "desc" } });
  res.json(records);
});

app.post("/api/medical-records", authMiddleware, async (req, res) => {
  const data = req.body;
  const rec = await prisma.medicalRecord.create({ data });
  res.status(201).json(rec);
});

// API: posts
app.get("/api/posts", async (req, res) => {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  res.json(posts);
});

app.post("/api/posts", authMiddleware, async (req, res) => {
  const data = req.body;
  const post = await prisma.post.create({ data });
  res.status(201).json(post);
});

// API: adoption requests
app.get("/api/adoptions", authMiddleware, async (req, res) => {
  const list = await prisma.adoptionRequest.findMany({ orderBy: { date: "desc" } });
  res.json(list);
});

app.post("/api/adoptions", authMiddleware, async (req, res) => {
  const data = req.body;
  const r = await prisma.adoptionRequest.create({ data });
  res.status(201).json(r);
});

// API: alerts (lightweight)
app.get("/api/alerts", async (req, res) => {
  const alerts = await prisma.alert.findMany({ orderBy: { date: "desc" } });
  res.json(alerts);
});

app.post("/api/alerts", authMiddleware, async (req, res) => {
  const data = req.body;
  const a = await prisma.alert.create({ data });
  res.status(201).json(a);
});

// simple health check
app.get("/health", (req, res) => res.json({ ok: true }));

const port = Number(process.env.SERVER_PORT || 4000);
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
