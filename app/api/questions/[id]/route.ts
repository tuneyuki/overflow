import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/db/supabase-client"

// 単一質問の取得
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> } // ← ここを Promise に合わせる
) {
  const { id } = await ctx.params; // await して取り出す
  const supabase = await createClient()
  const questionId = parseInt(id, 10)

  // 質問を取得
  const { data: question, error: qErr } = await supabase
    .from("questions")
    .select(`
      id, title, body, views_count, created_at,
      question_tags ( tags ( name ) ),
      votes ( vote_type )
    `)
    .eq("id", questionId)
    .single()

  if (qErr || !question)
    return NextResponse.json({ error: qErr?.message || "Not found" }, { status: 404 })

  // 回答を取得
  const { data: answers, error: aErr } = await supabase
    .from("answers")
    .select(`
      id, body, created_at, is_accepted,
      users ( email, username ),
      votes ( vote_type )
    `)
    .eq("question_id", questionId)

  if (aErr) console.error(aErr)

  const formattedQuestion = {
    id: question.id,
    title: question.title,
    content: question.body,
    views: question.views_count,
    tags: question.question_tags?.map((t: any) => t.tags.name) ?? [],
    votes:
      question.votes?.reduce((sum: number, v: any) => sum + v.vote_type, 0) ??
      0,
    timestamp: new Date(question.created_at).toLocaleString("ja-JP"),
  }

  const formattedAnswers =
    answers?.map((a: any) => ({
      id: a.id,
      content: a.body,
      isAccepted: a.is_accepted,
      author:
        a.users?.username || a.users?.email?.split("@")[0] || "anonymous",
      votes: a.votes?.reduce((s: number, v: any) => s + v.vote_type, 0) ?? 0,
      timestamp: new Date(a.created_at).toLocaleString("ja-JP"),
    })) ?? []

  return NextResponse.json({
    question: formattedQuestion,
    answers: formattedAnswers,
  })
}