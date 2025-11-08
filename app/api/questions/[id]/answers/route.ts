import { NextResponse } from "next/server"
import { query } from "@/lib/db/postgres-client"

// ============================================================
// 回答投稿 API (POST /api/questions/[id]/answers)
// ============================================================
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = context
  const { id } = await params
  const questionId = Number(id)
  const { content, userEmail } = await req.json()

  if (!Number.isInteger(questionId)) {
    return NextResponse.json({ error: "Invalid question ID" }, { status: 400 })
  }

  if (!userEmail || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    // 1️⃣ ユーザー登録または取得
    const userRes = await query(
      `INSERT INTO users (email)
       VALUES ($1)
       ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
       RETURNING id;`,
      [userEmail]
    )
    const userId = userRes.rows[0].id

    // 2️⃣ 回答を登録
    const insertRes = await query(
      `INSERT INTO answers (question_id, user_id, body)
       VALUES ($1, $2, $3)
       RETURNING id, created_at;`,
      [questionId, userId, content]
    )

    // 3️⃣ 質問の最終アクティビティを更新
    await query(
      `UPDATE questions SET last_activity_at = NOW() WHERE id = $1;`,
      [questionId]
    )

    return NextResponse.json({
      success: true,
      answer: {
        id: insertRes.rows[0].id,
        content,
        created_at: insertRes.rows[0].created_at,
        user_email: userEmail,
      },
    })
  } catch (err: any) {
    console.error("POST /api/questions/[id]/answers error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ============================================================
// 回答一覧取得 API (GET /api/questions/[id]/answers)
// ============================================================
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = context
  const { id } = await params
  const questionId = Number(id)

  if (!Number.isInteger(questionId)) {
    return NextResponse.json({ error: "Invalid question ID" }, { status: 400 })
  }

  try {
    const sql = `
      SELECT 
        a.id,
        a.body AS content,
        a.created_at,
        u.email AS author_email
      FROM answers a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.question_id = $1
      ORDER BY a.created_at ASC;
    `
    const result = await query(sql, [questionId])
    return NextResponse.json(result.rows)
  } catch (err: any) {
    console.error("GET /api/questions/[id]/answers error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
