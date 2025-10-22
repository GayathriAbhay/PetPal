import jwt from 'jsonwebtoken';

export const COOKIE_NAME = 'petpal_token';
export const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev_jwt_secret';

export function parseCookies(req) {
  const header = req.headers?.cookie || '';
  return header.split(';').map(c => c.trim()).filter(Boolean).reduce((acc, cur) => {
    const [k, ...v] = cur.split('=');
    acc[k] = decodeURIComponent(v.join('='));
    return acc;
  }, {});
}

export function getTokenFromReq(req) {
  const cookies = parseCookies(req);
  if (cookies[COOKIE_NAME]) return cookies[COOKIE_NAME];
  const auth = req.headers.authorization || req.headers.Authorization;
  if (auth && auth.startsWith('Bearer ')) return auth.split(' ')[1];
  return null;
}

export function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function setAuthCookie(res, token) {
  // Set cookie for Vercel serverless response
  const cookie = `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Lax`;
  const prev = res.getHeader('Set-Cookie');
  if (prev) {
    const arr = Array.isArray(prev) ? prev : [prev];
    res.setHeader('Set-Cookie', [...arr, cookie]);
  } else {
    res.setHeader('Set-Cookie', cookie);
  }
}

export function clearAuthCookie(res) {
  const cookie = `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
  res.setHeader('Set-Cookie', cookie);
}
