"use client"

import { ArrowBigUp, ArrowBigDown, Check } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"

interface AnswerCardProps {
  id: string
  content: string
  author: string
  authorInitials: string
  votes: number
  isAccepted?: boolean
  timestamp: string
}

export function AnswerCard({
  content,
  author,
  authorInitials,
  votes: initialVotes,
  isAccepted = false,
  timestamp,
}: AnswerCardProps) {
  const [votes, setVotes] = useState(initialVotes)
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null)

  const handleVote = (type: "up" | "down") => {
    if (userVote === type) {
      setVotes(votes + (type === "up" ? -1 : 1))
      setUserVote(null)
    } else {
      const change = type === "up" ? 1 : -1
      const adjustment = userVote ? change * 2 : change
      setVotes(votes + adjustment)
      setUserVote(type)
    }
  }

  return (
    <Card className={`p-6 ${isAccepted ? "border-green-500 border-2" : ""}`}>
      <div className="flex gap-4">
        {/* Voting Column */}
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${userVote === "up" ? "text-primary" : ""}`}
            onClick={() => handleVote("up")}
          >
            <ArrowBigUp className="h-6 w-6" fill={userVote === "up" ? "currentColor" : "none"} />
          </Button>
          <span className="text-lg font-bold">{votes}</span>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${userVote === "down" ? "text-destructive" : ""}`}
            onClick={() => handleVote("down")}
          >
            <ArrowBigDown className="h-6 w-6" fill={userVote === "down" ? "currentColor" : "none"} />
          </Button>
          {isAccepted && <Check className="h-6 w-6 text-green-500 mt-2" />}
        </div>

        {/* Content Column */}
        <div className="flex-1 space-y-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed">{content}</p>
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{authorInitials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{author}</p>
                <p className="text-xs text-muted-foreground">{timestamp}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
