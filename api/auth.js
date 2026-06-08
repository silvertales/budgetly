import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL);
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production';

async function initSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id         SERIAL PRIMARY KEY,
      email      TEXT UNIQUE NOT NULL,
      name       TEXT NOT NULL,
      password   TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await initSchema();
    const { action, email, password, name } = req.body;

    if (action === 'signup') {
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Name, email and password are required.' });
      }
      const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()}`;
      if (existing.length > 0) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }
      const hash = await bcrypt.hash(password, 12);
      const [user] = await sql`
        INSERT INTO users (email, name, password)
        VALUES (${email.toLowerCase()}, ${name.trim()}, ${hash})
        RETURNING id, email, name
      `;
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
      return res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    }

    if (action === 'login') {
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }
      const [user] = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase()}`;
      if (!user) return res.status(401).json({ error: 'No account found with this email.' });
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: 'Incorrect password.' });
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
      return res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    }

    if (action === 'verify') {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided.' });
      }
      const token = authHeader.slice(7);
      const payload = jwt.verify(token, JWT_SECRET);
      const [user] = await sql`SELECT id, email, name FROM users WHERE id = ${payload.id}`;
      if (!user) return res.status(401).json({ error: 'User not found.' });
      return res.status(200).json({ user });
    }

    return res.status(400).json({ error: 'Unknown action.' });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    console.error('[auth]', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
