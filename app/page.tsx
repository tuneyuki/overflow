import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center space-y-12">
      {/* Hero セクション */}
      <section className="space-y-6 max-w-3xl">
        <div className="flex flex-col items-center gap-4">
          <MessageSquare className="h-12 w-12 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            業務後Overflow
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            従業員同士が、実務や学習での疑問を気軽に共有し、  
            解決のヒントを見つけられる Q&A コミュニティ。
          </p>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Link href="/questions">
            <Button size="lg" className="gap-2">
              質問一覧を見る
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/questions/ask">
            <Button size="lg" variant="outline" className="gap-2">
              質問を投稿する
            </Button>
          </Link>
        </div>
      </section>

      {/* コンセプトセクション */}
      <section className="max-w-4xl space-y-4">
        <h2 className="text-2xl font-semibold">コンセプト</h2>
        <p className="text-muted-foreground leading-relaxed">
          「業務後Overflow」は、実務中に生じた“ちょっとした疑問”や“詰まり”を  
          仲間と共有し合うための場です。  
          Stack Overflow のようにプログラミングに限らず、日常の中で気軽に使えるQ&Aプラットフォームを目指しています。
        </p>
      </section>

      {/* 使い方セクション */}
      <section className="max-w-4xl space-y-4">
        <h2 className="text-2xl font-semibold">使い方</h2>
        <ul className="text-muted-foreground leading-relaxed list-disc list-inside text-left space-y-2">
          <li>「質問を投稿する」から、困っていることを共有</li>
          <li>他のユーザーが投稿した質問に回答やコメントを追加</li>
          <li>良い回答には Upvote 👍 して応援</li>
          <li>タグでトピックごとに検索・絞り込み可能</li>
        </ul>
      </section>

      {/* 関連リンク */}
      <section className="max-w-4xl space-y-4">
        <h2 className="text-2xl font-semibold">関連リンク</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/questions">
            <Button variant="secondary">質問一覧</Button>
          </Link>
          <Link href="/questions/ask">
            <Button variant="secondary">質問投稿</Button>
          </Link>
          <Link href="https://github.com/tuneyuki" target="_blank" rel="noopener noreferrer">
            <Button variant="secondary">GitHub プロジェクト</Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
