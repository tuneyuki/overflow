import { MessageSquare, Eye, ArrowBigUp } from "lucide-react"
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
  return (
    <Card className="p-4 hover:bg-muted/50 transition-colors">
      <div className="flex gap-4">
        {/* Stats Column */}
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

        {/* Content Column */}
        <div className="flex-1 space-y-3">
          <div>
            <Link href={`/questions/${id}`} className="group">
              <h3 className="text-lg font-semibold text-primary group-hover:text-primary/80 transition-colors">
                {title}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{content}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

        </div>
      </div>
    </Card>
  )
}
