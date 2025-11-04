import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db/postgres-client"

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params
  const questionId = parseInt(id, 10)

  // --- 質問データを取得 ---
  const questionRes = await query(
    `
    SELECT 
      q.id, q.title, q.body, q.views_count, q.created_at,
      COALESCE(SUM(v.vote_type), 0) AS votes,
      ARRAY_AGG(DISTINCT t.name) AS tags
    FROM questions q
    LEFT JOIN votes v 
      ON v.votable_type = 'question' AND v.votable_id = q.id
    LEFT JOIN question_tags qt 
      ON qt.question_id = q.id
    LEFT JOIN tags t 
      ON t.id = qt.tag_id
    WHERE q.id = $1
    GROUP BY q.id
    `,
    [questionId]
  )

  if (questionRes.rowCount === 0)
    return NextResponse.json({ error: "Question not found" }, { status: 404 })

  const question = questionRes.rows[0]

  // --- 回答を取得 ---
  const answersRes = await query(
    `
    SELECT 
      a.id, a.body, a.created_at, a.is_accepted,
      u.username, u.email,
      COALESCE(SUM(v.vote_type), 0) AS votes
    FROM answers a
    LEFT JOIN users u ON u.id = a.user_id
    LEFT JOIN votes v 
      ON v.votable_type = 'answer' AND v.votable_id = a.id
    WHERE a.question_id = $1
    GROUP BY a.id, u.username, u.email
    ORDER BY a.created_at ASC
    `,
    [questionId]
  )

  const formatted = {
    question: {
      id: question.id,
      title: question.title,
      content: question.body,
      views: question.views_count,
      votes: question.votes,
      tags: question.tags?.filter(Boolean) || [],
      timestamp: new Date(question.created_at).toLocaleString("ja-JP"),
    },
    answers: answersRes.rows.map((a) => ({
      id: a.id,
      content: a.body,
      isAccepted: a.is_accepted,
      author: a.username || a.email?.split("@")[0] || "anonymous",
      votes: a.votes,
      timestamp: new Date(a.created_at).toLocaleString("ja-JP"),
    })),
  }

  return NextResponse.json(formatted)
}
