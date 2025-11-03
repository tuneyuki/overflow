import { Pool } from 'pg'
import { DatabaseClient } from './client'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const PostgresDB: DatabaseClient = {
  async query(sql: string, params?: any[]) {
    const { rows } = await pool.query(sql, params)
    return { rows }
  },
  async execute(sql: string, params?: any[]) {
    await pool.query(sql, params)
  },
}
