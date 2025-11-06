import { Pool } from "pg"

// 🔹 型補助（TypeScript 環境でも安全）
declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined
}

// 🔹 グローバルキャッシュを利用
const pool =
  global._pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

if (!global._pgPool) {
  global._pgPool = pool
}

export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const res = await client.query(text, params)
    return res
  } finally {
    client.release()
  }
}
