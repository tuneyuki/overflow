// app/api/questions/[id]/vote/route.ts

import { NextResponse } from "next/server"
import { query } from "@/lib/db/postgres-client"

// ============================================================
// 質問への投票 API
// POST /api/questions/:id/vote
// ============================================================
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userEmail, voteType } = await req.json()
  const questionId = parseInt(params.id, 10)

  if (!userEmail) {
    return NextResponse.json({ error: "User email required" }, { status: 400 })
  }
  if (![1, -1].includes(voteType)) {
    return NextResponse.json({ error: "Invalid vote type" }, { status: 400 })
  }

  try {
    // 1️⃣ ユーザーを登録または取得
    const userRes = await query(
      `INSERT INTO users (email)
       VALUES ($1)
       ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
       RETURNING id;`,
      [userEmail]
    )
    const userId = userRes.rows[0].id

    // 2️⃣ 既存投票を確認
    const existing = await query(
      `SELECT id, vote_type FROM votes
       WHERE user_id = $1 AND votable_type = 'question' AND votable_id = $2`,
      [userId, questionId]
    )

    // 3️⃣ 投票を更新または作成
    if (existing.rows.length > 0) {
      const current = existing.rows[0]
      if (current.vote_type === voteType) {
        // 同じ投票 → 削除（トグル動作）
        await query(`DELETE FROM votes WHERE id = $1`, [current.id])
      } else {
        // 逆投票に変更
        await query(`UPDATE votes SET vote_type = $1 WHERE id = $2`, [voteType, current.id])
      }
    } else {
      // 新規投票
      await query(
        `INSERT INTO votes (user_id, votable_type, votable_id, vote_type)
         VALUES ($1, 'question', $2, $3)`,
        [userId, questionId, voteType]
      )
    }

    // 4️⃣ 最新の合計票を返す
    const totalRes = await query(
      `SELECT COALESCE(SUM(vote_type), 0) AS votes_sum
       FROM votes
       WHERE votable_type = 'question' AND votable_id = $1`,
      [questionId]
    )

    return NextResponse.json({ success: true, votes: totalRes.rows[0].votes_sum })
  } catch (err: any) {
    console.error("POST /api/questions/[id]/vote error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
