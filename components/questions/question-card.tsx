// components/questions/question-card.tsx
import { MessageSquare, Eye, ArrowBigUp, Clock } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface QuestionCardProps {
  id: string
  title: string
  content: string
  votes: number
  answers: number
  views: number
  tags: string[]
  timestamp: string
}

// 経過日数を計算して "(◯日前)" 形式に変換
function formatDateWithDaysAgo(timestamp: string) {
  const date = new Date(timestamp)
  const now = new Date()

  // JST基準に変換
  const jstDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }))
  const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }))

  const diffMs = jstNow.getTime() - jstDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const formattedDate = jstDate.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Tokyo",
  })

  if (diffDays === 0) return `${formattedDate}（今日）`
  if (diffDays === 1) return `${formattedDate}（1日前）`
  return `${formattedDate}（${diffDays}日前）`
}

export function QuestionCard({
  id,
  title,
  content,
  votes,
  answers,
  views,
  tags,
  timestamp,
}: QuestionCardProps) {
  return (
    <Card className="p-4 hover:bg-muted/50 transition-colors">
      <div className="flex gap-4">
        {/* 左側: スコア表示 */}
        <div className="flex flex-col gap-2 items-center min-w-[80px] text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <ArrowBigUp className="h-4 w-4" />
            <span className="font-medium">{votes}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span className="font-medium">{answers}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span className="font-medium">{views}</span>
          </div>
        </div>

        {/* 右側: 内容 */}
        <div className="flex-1 space-y-3">
          {/* タイトルと本文 */}
          <div>
            <Link href={`/questions/${id}`} className="group">
              <h3 className="text-lg font-semibold text-primary group-hover:text-primary/80 transition-colors">
                {title}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {content}
            </p>
          </div>

          {/* タグ + 日付（左右分割） */}
          <div className="flex items-center justify-between">
            {/* 左側：タグ */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* 右側：投稿日（◯日前） */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatDateWithDaysAgo(timestamp)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
