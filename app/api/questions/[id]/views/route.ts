import { NextResponse } from "next/server"
import { query } from "@/lib/db/postgres-client"

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> } // ← Promiseを明示
) {
  const { id } = await context.params // ← awaitが必要

  try {
    const sql = `
      UPDATE questions
      SET views_count = views_count + 1
      WHERE id = $1
      RETURNING views_count;
    `
    const result = await query(sql, [id])

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      views: result.rows[0].views_count,
    })
  } catch (err: any) {
    console.error("POST /api/questions/[id]/views error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
