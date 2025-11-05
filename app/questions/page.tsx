// app/questions/page.tsx
"use client"

import { useEffect, useState } from "react"
import { QuestionCard } from "@/components/questions/question-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState("recent")

  // ------------------------------------------------------------
  // 質問データをAPIから取得
  // ------------------------------------------------------------
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`/api/questions?sort=${sort}`)
        const data = await res.json()
        setQuestions(data)
      } catch (err) {
        console.error("Failed to fetch questions:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [sort])

  // ------------------------------------------------------------
  // UIレンダリング
  // ------------------------------------------------------------
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Questions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? "Loading..." : `${questions.length} questions`}
          </p>
        </div>
        <Link href="/questions/ask">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            質問を投稿する
          </Button>
        </Link>
      </div>

      {/* ソートボタン */}
      <div className="flex gap-2 border-b">
        {[
          { key: "recent", label: "Newest" },
          { key: "active", label: "Active" },
          { key: "votes", label: "Most Voted" },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSort(opt.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              sort === opt.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 質問一覧 */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-muted-foreground">Loading questions...</p>
        ) : questions.length > 0 ? (
          questions.map((q) => (
            <QuestionCard
              key={q.id}
              id={q.id}
              title={q.title}
              content={q.content}
              votes={q.votes}
              answers={q.answers}
              views={q.views}
              tags={q.tags || []} // 将来的にタグ対応
              timestamp={new Date(q.timestamp).toLocaleString("ja-JP")}
            />
          ))
        ) : (
          <p className="text-muted-foreground">質問が見つかりませんでした。</p>
        )}
      </div>
    </div>
  )
}
