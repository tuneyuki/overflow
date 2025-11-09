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
  const formattedDate = new Date(timestamp).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Tokyo",
  })

  return (
    <Link href={`/questions/${id}`} className="block">
      <Card className="p-4 hover:bg-muted/50 transition-colors bg-white dark:bg-gray-900 cursor-pointer">
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
            <div>
              <h3 className="text-lg font-semibold text-primary dark:text-blue-200 group-hover:text-primary/80 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {content}
              </p>
            </div>

            {/* タグ + 投稿日（左右分割） */}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs bg-gray-200 dark:bg-gray-700"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
