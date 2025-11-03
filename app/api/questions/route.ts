import { NextResponse } from "next/server"
import { createClient } from "@/lib/db/supabase-client"

// ============================================================
// 質問一覧・検索 API
// ============================================================
export async function GET(req: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")
  const sort = searchParams.get("sort") || "recent" // recent, active, votes

  let builder = supabase
    .from("questions")
    .select(`
      id, title, body, views_count, created_at, last_activity_at,
      answers (id),
      votes (vote_type)
    `)

  // 検索条件
  if (query) builder = builder.ilike("title", `%${query}%`)

  // 並び替え
  switch (sort) {
    case "active":
      builder = builder.order("last_activity_at", { ascending: false })
      break
    case "votes":
      builder = builder.order("votes_count", { ascending: false })
      break
    default:
      builder = builder.order("created_at", { ascending: false })
  }

  const { data, error } = await builder.limit(20)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const formatted = data.map((q) => ({
    id: q.id,
    title: q.title,
    content: q.body,
    views: q.views_count,
    answers: q.answers?.length ?? 0,
    votes: q.votes?.reduce((acc: number, v: any) => acc + v.vote_type, 0) ?? 0,
    timestamp: q.created_at,
  }))

  return NextResponse.json(formatted)
}

// ============================================================
// 質問投稿 API
// ============================================================
// 質問投稿 API
export async function POST(req: Request) {
  const supabase = await createClient()
  const body = await req.json()
  const { title, content, tags, userEmail } = body

  // ユーザー登録または取得
  const { data: user, error: userErr } = await supabase
    .from("users")
    .upsert({ email: userEmail }, { onConflict: "email" })
    .select("id")
    .single()

  if (userErr || !user) {
    return NextResponse.json(
      { error: userErr?.message || "User not found after upsert" },
      { status: 500 }
    )
  }

  // 質問登録
  const { data: question, error: qErr } = await supabase
    .from("questions")
    .insert({
      user_id: user.id,
      title,
      body: content,
    })
    .select("id")
    .single()

  if (qErr || !question) {
    return NextResponse.json(
      { error: qErr?.message || "Question creation failed" },
      { status: 500 }
    )
  }

  // タグの登録
  for (const tag of tags) {
    const { data: tagData, error: tagErr } = await supabase
      .from("tags")
      .upsert({ name: tag })
      .select("id")
      .single()

    if (tagErr || !tagData) continue // スキップしてもOK

    await supabase
      .from("question_tags")
      .insert({ question_id: question.id, tag_id: tagData.id })
  }

  return NextResponse.json({ success: true, id: question.id })
}
