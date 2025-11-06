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
            従業員同士が、実務での疑問を気軽に共有し、  
            解決しあう Q&A コミュニティ。
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
          Stack Overflow のようにプログラミングに限定せず、日常の中で気軽に使えるQ&Aプラットフォームを目指しています。
          気軽に質問できるよう、質問者は匿名となります。回答者には感謝の気持ちを込めて Upvote 👍 で応援しましょう。
        </p>
        <p className="text-muted-foreground leading-relaxed">
          蓄積されたQ&Aを、APIで社内ツールやチャットボットに組み込むことで、
          業務効率化やナレッジ共有の促進にも役立てられます。 （APIは開発中）
        </p>
      </section>

      {/* 使い方セクション */}
      <section className="max-w-4xl space-y-4">
        <h2 className="text-2xl font-semibold">使い方</h2>
        <ul className="text-muted-foreground leading-relaxed list-disc list-inside text-left space-y-2">
          <li>「質問を投稿する」から、困っていることを共有</li>
          <li>他のユーザーが投稿した質問に回答を追加</li>
          <li>良い回答には Upvote 👍 して応援</li>
          <li>回答数やUpvote数の多い人には、イイコトあるかも？</li>
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
          <Link href="https://github.com/tuneyuki/overflow" target="_blank" rel="noopener noreferrer">
            <Button variant="secondary">GitHub プロジェクト</Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
