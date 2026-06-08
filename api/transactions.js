import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL);
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production';

async function initSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS transactions (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL,
      type       TEXT NOT NULL CHECK (type IN ('income', 'expense')),
      amount     NUMERIC(15,2) NOT NULL,
      category   TEXT NOT NULL,
      note       TEXT DEFAULT '',
      date       TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS budgets (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL UNIQUE,
      groceries  NUMERIC(15,2) DEFAULT 500,
      shopping   NUMERIC(15,2) DEFAULT 400,
      entertainment NUMERIC(15,2) DEFAULT 300,
      transport  NUMERIC(15,2) DEFAULT 200,
      housing    NUMERIC(15,2) DEFAULT 1500,
      income     NUMERIC(15,2) DEFAULT 10000,
      other      NUMERIC(15,2) DEFAULT 600
    )
  `;
}

function authenticate(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) throw new Error('No token');
  return jwt.verify(authHeader.slice(7), JWT_SECRET);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  let payload;
  try {
    payload = authenticate(req);
  } catch {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  try {
    await initSchema();
    const userId = payload.id;

    if (req.method === 'GET') {
      const txRows = await sql`
        SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY date DESC LIMIT 200
      `;
      const [budgetRow] = await sql`SELECT * FROM budgets WHERE user_id = ${userId}`;
      if (!budgetRow) {
        await sql`INSERT INTO budgets (user_id) VALUES (${userId}) ON CONFLICT DO NOTHING`;
      }
      const [budget] = await sql`SELECT * FROM budgets WHERE user_id = ${userId}`;
      return res.status(200).json({ transactions: txRows, budget });
    }

    if (req.method === 'POST') {
      const { action } = req.body;

      if (action === 'add_transaction') {
        const { type, amount, category, note } = req.body;
        if (!type || !amount || !category) {
          return res.status(400).json({ error: 'Missing fields.' });
        }
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
          return res.status(400).json({ error: 'Invalid amount.' });
        }
        const [tx] = await sql`
          INSERT INTO transactions (user_id, type, amount, category, note)
          VALUES (${userId}, ${type}, ${parsedAmount}, ${category}, ${note || ''})
          RETURNING *
        `;
        return res.status(201).json({ transaction: tx });
      }

      if (action === 'delete_transaction') {
        const { id } = req.body;
        await sql`DELETE FROM transactions WHERE id = ${id} AND user_id = ${userId}`;
        return res.status(200).json({ success: true });
      }

      if (action === 'save_budgets') {
        const { budgets } = req.body;
        await sql`
          INSERT INTO budgets (user_id, groceries, shopping, entertainment, transport, housing, income, other)
          VALUES (
            ${userId},
            ${budgets.groceries}, ${budgets.shopping}, ${budgets.entertainment},
            ${budgets.transport}, ${budgets.housing}, ${budgets.income}, ${budgets.other}
          )
          ON CONFLICT (user_id) DO UPDATE SET
            groceries     = EXCLUDED.groceries,
            shopping      = EXCLUDED.shopping,
            entertainment = EXCLUDED.entertainment,
            transport     = EXCLUDED.transport,
            housing       = EXCLUDED.housing,
            income        = EXCLUDED.income,
            other         = EXCLUDED.other
        `;
        return res.status(200).json({ success: true });
      }

      if (action === 'reset_transactions') {
        await sql`DELETE FROM transactions WHERE user_id = ${userId}`;
        const defaults = [
          { type: 'income',  amount: 5400, category: 'income',        note: 'Monthly Salary' },
          { type: 'expense', amount: 150,  category: 'groceries',     note: 'Weekly produce' },
          { type: 'expense', amount: 80,   category: 'transport',     note: 'Fuel fill-up' },
          { type: 'expense', amount: 240,  category: 'shopping',      note: 'Winter jacket' },
          { type: 'expense', amount: 60,   category: 'entertainment', note: 'Cinema tickets' },
        ];
        for (const tx of defaults) {
          await sql`
            INSERT INTO transactions (user_id, type, amount, category, note)
            VALUES (${userId}, ${tx.type}, ${tx.amount}, ${tx.category}, ${tx.note})
          `;
        }
        const txRows = await sql`
          SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY date DESC
        `;
        return res.status(200).json({ transactions: txRows });
      }

      return res.status(400).json({ error: 'Unknown action.' });
    }

    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (err) {
    console.error('[transactions]', err);
    return res.status(500).json({ error: 'Server error.' });
  }
}
