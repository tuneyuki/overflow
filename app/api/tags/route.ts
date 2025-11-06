import { NextResponse } from "next/server"
import { query } from "@/lib/db/postgres-client"

// ============================================================
// 人気タグ一覧 API
// GET /api/tags?limit=10
// ============================================================
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get("limit") || "10", 10)

  try {
    const sql = `
      SELECT 
        t.id,
        t.name,
        t.color,
        COUNT(qt.question_id) AS usage_count
      FROM tags t
      LEFT JOIN question_tags qt ON qt.tag_id = t.id
      GROUP BY t.id, t.name, t.color
      ORDER BY usage_count DESC, t.name ASC
      LIMIT $1;
    `
    const result = await query(sql, [limit])

    const formatted = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      color: row.color,
      count: Number(row.usage_count),
    }))

    return NextResponse.json(formatted)
  } catch (err: any) {
    console.error("GET /api/tags error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
