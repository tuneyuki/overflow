import { NextResponse } from "next/server"
import { query } from "@/lib/db/postgres-client"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // ← Promise 型に変更
) {
  const { id } = await context.params             // ← await で展開
  const tagId = Number(id)

  if (isNaN(tagId)) {
    return NextResponse.json({ error: "Invalid tag ID" }, { status: 400 })
  }

  try {
    // タグ情報取得
    const tagRes = await query(`SELECT * FROM tags WHERE id = $1`, [tagId])
    if (tagRes.rows.length === 0) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    // タグに紐づく質問一覧取得
    const qRes = await query(
      `
      SELECT q.id, q.title, q.body AS content, q.views_count AS views,
             q.created_at, q.updated_at,
             COALESCE(v.vote_sum, 0) AS votes,
             COALESCE(a.answer_count, 0) AS answers
      FROM questions q
      JOIN question_tags qt ON q.id = qt.question_id
      LEFT JOIN (
        SELECT votable_id, SUM(vote_type) AS vote_sum
        FROM votes
        WHERE votable_type = 'question'
        GROUP BY votable_id
      ) v ON q.id = v.votable_id
      LEFT JOIN (
        SELECT question_id, COUNT(*) AS answer_count
        FROM answers
        GROUP BY question_id
      ) a ON q.id = a.question_id
      WHERE qt.tag_id = $1
      ORDER BY q.created_at DESC
      `,
      [tagId]
    )

    return NextResponse.json({
      tag: tagRes.rows[0],
      questions: qRes.rows,
    })
  } catch (err: any) {
    console.error("Tag API error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
