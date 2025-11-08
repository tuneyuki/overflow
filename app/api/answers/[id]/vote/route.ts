import { NextResponse } from "next/server"
import { query } from "@/lib/db/postgres-client"

// ============================================================
// 回答への投票 API
// POST /api/answers/[id]/vote
// ============================================================
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = context
  const { id } = await params
  const answerId = Number(id)
  const { userEmail, voteType } = await req.json()

  if (!userEmail) {
    return NextResponse.json({ error: "User email required" }, { status: 400 })
  }
  if (![1, -1].includes(voteType)) {
    return NextResponse.json({ error: "Invalid vote type" }, { status: 400 })
  }

  try {
    // 1️⃣ ユーザー取得・登録
    const userRes = await query(
      `INSERT INTO users (email)
       VALUES ($1)
       ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
       RETURNING id;`,
      [userEmail]
    )
    const userId = userRes.rows[0].id

    // 2️⃣ 既存投票確認
    const existing = await query(
      `SELECT id, vote_type FROM votes
       WHERE user_id = $1 AND votable_type = 'answer' AND votable_id = $2`,
      [userId, answerId]
    )

    if (existing.rows.length > 0) {
      const current = existing.rows[0]
      if (current.vote_type === voteType) {
        // 同一 → 削除（トグル）
        await query(`DELETE FROM votes WHERE id = $1`, [current.id])
      } else {
        // 逆方向 → 更新
        await query(`UPDATE votes SET vote_type = $1 WHERE id = $2`, [voteType, current.id])
      }
    } else {
      // 新規登録
      await query(
        `INSERT INTO votes (user_id, votable_type, votable_id, vote_type)
         VALUES ($1, 'answer', $2, $3)`,
        [userId, answerId, voteType]
      )
    }

    // 3️⃣ 最新合計値を取得
    const totalRes = await query(
      `SELECT COALESCE(SUM(vote_type), 0) AS votes_sum
       FROM votes
       WHERE votable_type = 'answer' AND votable_id = $1`,
      [answerId]
    )

    return NextResponse.json({ success: true, votes: totalRes.rows[0].votes_sum })
  } catch (err: any) {
    console.error("POST /api/answers/[id]/vote error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
