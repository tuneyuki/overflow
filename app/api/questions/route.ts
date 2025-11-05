// app/api/questions/route.ts
import { NextResponse } from "next/server"
import { query } from "@/lib/db/postgres-client"

// ============================================================
// 質問一覧・検索 API
// ============================================================
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")
  const sort = searchParams.get("sort") || "recent"

  let orderBy = "q.created_at DESC"
  if (sort === "active") orderBy = "q.last_activity_at DESC"
  if (sort === "votes") orderBy = "votes_sum DESC"

  try {
    const sql = `
      SELECT 
        q.id,
        q.title,
        q.body,
        q.views_count,
        q.created_at,
        COALESCE(SUM(v.vote_type), 0) AS votes_sum,
        COUNT(DISTINCT a.id) AS answers_count,
        COALESCE(
          ARRAY_AGG(DISTINCT t.name) 
          FILTER (WHERE t.name IS NOT NULL), 
          '{}'
        ) AS tags
      FROM questions q
      LEFT JOIN votes v 
        ON v.votable_type = 'question' AND v.votable_id = q.id
      LEFT JOIN answers a 
        ON a.question_id = q.id
      LEFT JOIN question_tags qt 
        ON qt.question_id = q.id
      LEFT JOIN tags t 
        ON t.id = qt.tag_id
      ${q ? `WHERE q.title ILIKE $1` : ""}
      GROUP BY q.id
      ORDER BY ${orderBy}
      LIMIT 20;
    `

    const values = q ? [`%${q}%`] : []
    const result = await query(sql, values)

    const formatted = result.rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      content: r.body,
      views: r.views_count,
      answers: r.answers_count,
      votes: r.votes_sum,
      timestamp: r.created_at,
      tags: r.tags || [],
    }))

    return NextResponse.json(formatted)
  } catch (err: any) {
    console.error("GET /api/questions error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
// ============================================================
// 質問投稿 API
// ============================================================
export async function POST(req: Request) {
  const body = await req.json()
  const { title, content, tags, userEmail } = body

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

    // 2️⃣ 質問登録
    const questionRes = await query(
      `INSERT INTO questions (user_id, title, body)
       VALUES ($1, $2, $3)
       RETURNING id;`,
      [userId, title, content]
    )
    const questionId = questionRes.rows[0].id

    // 3️⃣ タグ登録と関連付け
    for (const tag of tags) {
      const tagRes = await query(
        `INSERT INTO tags (name)
         VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id;`,
        [tag]
      )
      const tagId = tagRes.rows[0].id

      await query(
        `INSERT INTO question_tags (question_id, tag_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING;`,
        [questionId, tagId]
      )
    }

    return NextResponse.json({ success: true, id: questionId })
  } catch (err: any) {
    console.error("POST /api/questions error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
