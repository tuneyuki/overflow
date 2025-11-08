"use client"

import { ArrowBigUp, ArrowBigDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"

interface AnswerCardProps {
  id: string
  content: string
  author: string
  votes: number
  isAccepted?: boolean
  timestamp: string
}

export function AnswerCard({
  id,
  content,
  author,
  votes: initialVotes,
  isAccepted = false,
  timestamp,
}: AnswerCardProps) {
  const [votes, setVotes] = useState(initialVotes)
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null)

  const handleVote = async (voteType: 1 | -1) => {
    try {
      const res = await fetch(`/api/answers/${id}/vote`, { // 👈 質問ではなく回答に対する投票
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: "user@example.com", // 実際はCookieなどから取得
          voteType,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setVotes(Number(data.votes))
      } else {
        console.error(data.error)
      }
    } catch (err) {
      console.error("Vote failed:", err)
    }
  }

  return (
    <Card className={`p-6 ${isAccepted ? "border-green-500 border-2" : ""}`}>
      <div className="flex gap-4">
        {/* 投票カラム */}
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${userVote === "up" ? "text-primary" : ""}`}
            onClick={() => handleVote(1)} // 👈 型を統一
          >
            <ArrowBigUp className="h-6 w-6" fill={userVote === "up" ? "currentColor" : "none"} />
          </Button>
          <span className="text-lg font-bold">{votes}</span>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${userVote === "down" ? "text-destructive" : ""}`}
            onClick={() => handleVote(-1)} // 👈 こちらも統一
          >
            <ArrowBigDown className="h-6 w-6" fill={userVote === "down" ? "currentColor" : "none"} />
          </Button>
          {isAccepted && <Check className="h-6 w-6 text-green-500 mt-2" />}
        </div>

        {/* 回答本文カラム */}
        <div className="flex-1 space-y-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {content}
            </p>
          </div>

          {/* 回答者情報 */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-sm font-medium text-foreground">{author}</p>
              <p className="text-xs text-muted-foreground">{timestamp}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
