'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, HelpCircle, Lightbulb } from "lucide-react"

export default function AskQuestionPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // タグ追加
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() && tags.length < 5) {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase()
      if (!tags.includes(newTag)) setTags([...tags, newTag])
      setTagInput("")
    }
  }

  // タグ削除
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  // 投稿送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          tags,
          // Middleware でセットした Cookie を使用
          userEmail: document.cookie
            .split("; ")
            .find((c) => c.startsWith("user_email="))
            ?.split("=")[1] || "anonymous@example.com",
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "投稿に失敗しました")

      console.log("質問投稿完了:", data)
      router.push(`/questions/${data.id}`)
    } catch (err) {
      console.error(err)
      alert("投稿中にエラーが発生しました。")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ページタイトル */}
      <div>
        <h1 className="text-3xl font-bold mb-2">質問を投稿する</h1>
        <p className="text-muted-foreground">
          あなたの悩みをコミュニティに相談しましょう（投稿は匿名です）。
        </p>
      </div>

      {/* 質問の書き方ヒント */}
      <Card className="p-6 bg-muted/50 border-primary/20">
        <div className="flex gap-3">
          <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-semibold">良い質問を書くポイント</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>タイトルは簡潔かつ具体的に</li>
              <li>試したことやエラー内容を記述</li>
              <li>関連するタグを付ける</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* フォーム本体 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <Label htmlFor="title" className="text-base font-semibold">タイトル</Label>
          <Input
            id="title"
            placeholder="例：Next.jsで認証機能を実装するには？"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Card>

        <Card className="p-6 space-y-4">
          <Label htmlFor="content" className="text-base font-semibold">詳細内容</Label>
          <Textarea
            id="content"
            placeholder="問題内容・試したことなどを詳しく書いてください。"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="min-h-[300px]"
          />
        </Card>

        <Card className="p-6 space-y-4">
          <Label htmlFor="tags" className="text-base font-semibold">タグ</Label>
          <p className="text-sm text-muted-foreground">
            関連技術（例：nextjs, react, typescript）を最大5件まで
          </p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <Input
            id="tags"
            placeholder="例：nextjs（Enterキーで追加）"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            disabled={tags.length >= 5}
          />
          <p className="text-sm text-muted-foreground">{tags.length}/5 タグ追加済み</p>
        </Card>

        <div className="flex gap-3">
          <Button
            type="submit"
            size="lg"
            disabled={loading || title.length < 15 || content.length < 30 || tags.length === 0}
          >
            {loading ? "投稿中..." : "質問を投稿する"}
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.back()}>
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  )
}
