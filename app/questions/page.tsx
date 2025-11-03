// app/questions/page.tsx
import { QuestionCard } from "@/components/questions/question-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

const mockQuestions = [
  {
    id: "1",
    title: "How to implement server actions in Next.js 15?",
    content:
      "I'm trying to understand the best practices for implementing server actions in Next.js 15. What are the recommended patterns and how do I handle form submissions?",
    votes: 42,
    answers: 8,
    views: 1234,
    tags: ["nextjs", "react", "server-actions"],
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    title: "TypeScript generic constraints with React components",
    content:
      "I'm having trouble understanding how to properly use TypeScript generic constraints when creating reusable React components. Can someone explain with examples?",
    votes: 35,
    answers: 5,
    views: 892,
    tags: ["typescript", "react", "generics"],
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    title: "Best way to handle authentication in Next.js App Router?",
    content:
      "What's the recommended approach for implementing authentication in Next.js 15 with the App Router? Should I use middleware or server components?",
    votes: 28,
    answers: 12,
    views: 2156,
    tags: ["nextjs", "authentication", "app-router"],
    timestamp: "1 day ago",
  },
  {
    id: "4",
    title: "Optimizing React performance with useMemo and useCallback",
    content:
      "When should I use useMemo vs useCallback? I'm seeing performance issues in my React app and want to optimize it properly.",
    votes: 56,
    answers: 15,
    views: 3421,
    tags: ["react", "performance", "hooks"],
    timestamp: "2 days ago",
  },
  {
    id: "5",
    title: "CSS Grid vs Flexbox: When to use which?",
    content:
      "I'm confused about when to use CSS Grid versus Flexbox. What are the use cases for each and how do I decide which one to use?",
    votes: 23,
    answers: 7,
    views: 1567,
    tags: ["css", "layout", "flexbox", "grid"],
    timestamp: "3 days ago",
  },
]

export default function QuestionsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Questions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mockQuestions.length} questions
          </p>
        </div>
        <Link href="/questions/ask">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Ask Question
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 border-b">
        <button className="px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary">
          Newest
        </button>
        <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Active
        </button>
        <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Unanswered
        </button>
        <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Most Voted
        </button>
      </div>

      <div className="space-y-4">
        {mockQuestions.map((question) => (
          <QuestionCard key={question.id} {...question} />
        ))}
      </div>
    </div>
  )
}