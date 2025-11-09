'use client'

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { AnswerCard } from "@/components/answer-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MarkdownContent } from "@/components/ui/markdown"
import { ArrowBigUp, ArrowBigDown, Bookmark } from "lucide-react"

// Markdown対応
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"

interface Question {
  id: number
  title: string
  content: string
  votes: number
  answers: number
  views: number
  tags: string[]
  timestamp: string
}

export default function QuestionDetailPage() {
  const { id } = useParams()
  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [answerText, setAnswerText] = useState("") // 🟢 回答入力用
  const [submitting, setSubmitting] = useState(false)

  const hasIncremented = useRef(false)

  // 質問 + 回答取得
  useEffect(() => {
    async function fetchQuestion() {
      if (!id) return
      try {
        const res = await fetch(`/api/questions/${id}`)
        const data = await res.json()
        if (res.ok) {
          setQuestion(data.question)
          setAnswers(data.answers || [])

          // 👇 閲覧数カウントは1回のみ
          if (!hasIncremented.current) {
            hasIncremented.current = true
            fetch(`/api/questions/${id}/views`, { method: "POST" }).catch(console.error)
          }
        } else {
          console.error(data.error)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchQuestion()
  }, [id])

  // 🟢 回答投稿処理
  async function handleSubmit() {
    if (!answerText.trim()) return
    setSubmitting(true)

    try {
      const res = await fetch(`/api/questions/${id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: answerText,
          userEmail: "anonymous@example.com", // ← 本来はCookieなどから取得
        }),
      })
      const data = await res.json()
      if (res.ok) {
        // 新しい回答をリストに追加
        setAnswers((prev) => [...prev, data.answer])
        setAnswerText("")
      } else {
        console.error(data.error)
      }
    } catch (err) {
      console.error("回答投稿失敗:", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (!question) return <div className="p-6 text-muted-foreground">Question not found</div>

  return (
    <main className="flex-1 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* 質問ヘッダ */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{question.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>投稿日 {question.timestamp}</span>
            <span>閲覧数 {question.views}</span>
          </div>
        </div>

        {/* 質問本文 */}
        <div className="prose prose-sm max-w-none">
          <MarkdownContent content={question.content} />
        </div>

        {/* タグ */}
        <div className="flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        {/* 投票・ブックマーク */}
        <div className="flex items-center gap-2 mt-4">
          <Button variant="ghost" size="sm"><ArrowBigUp className="h-5 w-5" /></Button>
          <span className="text-lg font-medium">{question.votes}</span>
          <Button variant="ghost" size="sm"><ArrowBigDown className="h-5 w-5" /></Button>
          <Button variant="ghost" size="sm"><Bookmark className="h-5 w-5" /></Button>
        </div>

        {/* 回答一覧 */}
        <div className="space-y-4 pt-6 border-t">
          <h2 className="text-2xl font-bold">{answers.length} 件の回答</h2>
          <div className="space-y-4">
            {answers.map((a) => (
              <AnswerCard
                key={a.id}
                id={a.id}
                content={a.content}
                author={a.author_email || "anonymous"} // 👈 ここでauthorにマッピング
                votes={a.votes || 0}
                timestamp={a.created_at}
              />
            ))}
          </div>
        </div>

        {/* 回答フォーム */}
        <div className="space-y-4 pt-6 border-t">
          <h3 className="text-xl font-bold">あなたの回答</h3>
          <div className="space-y-4">
            <Textarea
              placeholder="ここに回答を入力..."
              className="min-h-[200px]"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
            />
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "投稿中..." : "回答を投稿"}
            </Button>
          </div>
        </div>

      </div>
    </main>
  )
}
