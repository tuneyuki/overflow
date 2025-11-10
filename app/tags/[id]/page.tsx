"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { QuestionCard } from "@/components/questions/question-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function TagQuestionsPage() {
  const { id } = useParams() // ← URLパラメータからタグIDを取得
  const [questions, setQuestions] = useState<any[]>([])
  const [tagName, setTagName] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState("recent")

  // ------------------------------------------------------------
  // 選択タグの質問を取得
  // ------------------------------------------------------------
  useEffect(() => {
    if (!id) return

    async function fetchTagQuestions() {
      try {
        const res = await fetch(`/api/tags/${id}`)
        const data = await res.json()
        if (res.ok) {
          setQuestions(data.questions)
          setTagName(data.tag?.name || "")
        } else {
          console.error(data.error)
        }
      } catch (err) {
        console.error("Failed to fetch tag questions:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTagQuestions()
  }, [id, sort])

  // ------------------------------------------------------------
  // UIレンダリング
  // ------------------------------------------------------------
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {tagName ? `#${tagName}` : "タグ別質問一覧"}
          </h1>
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
              tags={q.tags || []}
              timestamp={new Date(q.timestamp).toLocaleString("ja-JP")}
            />
          ))
        ) : (
          <p className="text-muted-foreground">このタグの質問はまだありません。</p>
        )}
      </div>
    </div>
  )
}
