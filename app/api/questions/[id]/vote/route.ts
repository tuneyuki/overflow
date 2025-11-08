// app/api/questions/[id]/vote/route.ts

import { NextResponse } from "next/server"
import { query } from "@/lib/db/postgres-client"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userEmail, voteType } = await req.json()
  const votableId = Number(params.id)
  const votableType = "question" // 回答なら "answer"

  if (!userEmail || ![1, -1].includes(voteType)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  try {
    // 1️⃣ ユーザーID取得
    const userRes = await query(
      `INSERT INTO users (email)
       VALUES ($1)
       ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
       RETURNING id;`,
      [userEmail]
    )
    const userId = userRes.rows[0].id

    // 2️⃣ 既存投票チェック
    const existing = await query(
      `SELECT id, vote_type FROM votes 
       WHERE user_id = $1 AND votable_type = $2 AND votable_id = $3`,
      [userId, votableType, votableId]
    )

    if (existing.rows.length > 0) {
      const currentVote = existing.rows[0].vote_type

      if (currentVote === voteType) {
        // 同じ投票なら削除（キャンセル扱い）
        await query(`DELETE FROM votes WHERE id = $1`, [existing.rows[0].id])
      } else {
        // 逆方向の投票なら更新
        await query(`UPDATE votes SET vote_type = $1 WHERE id = $2`, [voteType, existing.rows[0].id])
      }
    } else {
      // 新規投票
      await query(
        `INSERT INTO votes (user_id, votable_type, votable_id, vote_type)
         VALUES ($1, $2, $3, $4)`,
        [userId, votableType, votableId, voteType]
      )
    }

    // 3️⃣ 合計投票数を返す
    const total = await query(
      `SELECT COALESCE(SUM(vote_type), 0) AS votes 
       FROM votes WHERE votable_type = $1 AND votable_id = $2`,
      [votableType, votableId]
    )

    return NextResponse.json({ success: true, votes: total.rows[0].votes })
  } catch (err: any) {
    console.error("Vote API error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
