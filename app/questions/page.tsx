// app/questions/page.tsx
import { QuestionCard } from "@/components/questions/question-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

const mockQuestions = [
  {
    id: "1",
    title: "勤務申請をオンラインで提出するにはどうすればよいですか？",
    content:
      "新しい勤務申請システムの使い方が分かりません。オンラインで勤務申請を提出するための手順や注意点を教えてください。",
    votes: 42,
    answers: 8,
    views: 1234,
    tags: ["勤務申請", "人事", "申請方法"],
    timestamp: "2時間前",
  },
  {
    id: "2",
    title: "社内Wi-Fiに接続できない場合の対処法は？",
    content:
      "社内Wi-Fiに突然接続できなくなりました。考えられる原因や確認すべき設定、IT部門への連絡方法などを教えてください。",
    votes: 35,
    answers: 5,
    views: 892,
    tags: ["社内IT", "Wi-Fi", "ネットワーク"],
    timestamp: "5時間前",
  },
  {
    id: "3",
    title: "Difyでワークフローを自動化するおすすめの方法は？",
    content:
      "Difyを使って業務プロセスを自動化したいと考えています。効果的なワークフロー設計のポイントや、実装時の注意点について教えてください。",
    votes: 28,
    answers: 12,
    views: 2156,
    tags: ["Dify", "自動化", "業務効率化"],
    timestamp: "1日前",
  },
  {
    id: "4",
    title: "Pythonで大量データを高速に処理するには？",
    content:
      "Pythonで数十万件のデータを処理する際、ループが遅くなってしまいます。パフォーマンスを改善する方法やおすすめのライブラリはありますか？",
    votes: 56,
    answers: 15,
    views: 3421,
    tags: ["Python", "パフォーマンス", "データ処理"],
    timestamp: "2日前",
  },
  {
    id: "5",
    title: "有給休暇の申請と承認の流れについて教えてください",
    content:
      "有給休暇を申請したいのですが、どのような手順で申請・承認が行われるのか分かりません。詳しい流れを教えてください。",
    votes: 23,
    answers: 7,
    views: 1567,
    tags: ["勤務申請", "有給休暇", "申請フロー"],
    timestamp: "3日前",
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
            質問を投稿する
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