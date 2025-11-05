'use client'

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { AnswerCard } from "@/components/answer-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowBigUp, ArrowBigDown, Bookmark } from "lucide-react"

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

  // 👇 Strict Mode の二重実行防止フラグ
  const hasIncremented = useRef(false)

  useEffect(() => {
    async function fetchQuestion() {
      if (!id) return

      try {
        const res = await fetch(`/api/questions/${id}`)
        const data = await res.json()

        if (res.ok) {
          setQuestion(data.question)
          setAnswers(data.answers || [])

          // 👇 1回だけ実行する
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
          <p className="leading-relaxed whitespace-pre-line">{question.content}</p>
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
          <Button variant="ghost" size="sm">
            <ArrowBigUp className="h-5 w-5" />
          </Button>
          <span className="text-lg font-medium">{question.votes}</span>
          <Button variant="ghost" size="sm">
            <ArrowBigDown className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>

        {/* 回答一覧 */}
        <div className="space-y-4 pt-6 border-t">
          <h2 className="text-2xl font-bold">{answers.length} 件の回答</h2>
          <div className="space-y-4">
            {answers.map((a) => (
              <AnswerCard key={a.id} {...a} />
            ))}
          </div>
        </div>

        {/* 回答フォーム */}
        <div className="space-y-4 pt-6 border-t">
          <h3 className="text-xl font-bold">あなたの回答</h3>
          <div className="space-y-4">
            <Textarea placeholder="ここに回答を入力..." className="min-h-[200px]" />
            <Button>回答を投稿</Button>
          </div>
        </div>
      </div>
    </main>
  )
}
