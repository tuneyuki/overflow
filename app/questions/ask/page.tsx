"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Lightbulb } from "lucide-react"
import { MarkdownContent } from "@/components/ui/markdown"
import { MarkdownHelpDialog } from "@/components/markdown-help-dialog"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HelpCircle } from "lucide-react"


export default function AskQuestionPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() && tags.length < 5) {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase()
      if (!tags.includes(newTag)) setTags([...tags, newTag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

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
          userEmail:
            document.cookie
              .split("; ")
              .find((c) => c.startsWith("user_email="))
              ?.split("=")[1] || "anonymous@example.com",
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "投稿に失敗しました")
      router.push(`/questions/${data.id}`)
    } catch (err) {
      console.error(err)
      alert("投稿中にエラーが発生しました。")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* タイトル */}
      <div>
        <h1 className="text-3xl font-bold mb-2">質問を投稿する</h1>
        <p className="text-muted-foreground">
          Markdown記法に対応。右側にプレビューがリアルタイム表示されます。
        </p>
      </div>

      {/* 入力フォーム */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* タイトル入力 */}
        <Card className="p-6 space-y-4">
          <Label htmlFor="title" className="text-base font-semibold">
            タイトル
          </Label>
          <Input
            id="title"
            placeholder="例：Next.jsで認証機能を実装するには？"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Card>

        {/* Markdownエディタ＋プレビュー */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Label htmlFor="content" className="text-base font-semibold">
              詳細内容
            </Label>

            {/* 🟢 Markdownヘルプモーダル */}
            <MarkdownHelpDialog />
          </div>

          {/* 編集エリアとプレビュー */}
          <div className="grid grid-cols-2 gap-6">
            <Textarea
              id="content"
              placeholder="Markdown記法で記入してください。"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="min-h-[400px] font-mono"
            />

            <div className="border rounded-md p-4 overflow-y-auto bg-muted/10">
              {content ? (
                <MarkdownContent content={content} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  プレビューはここに表示されます
                </p>
              )}
            </div>
          </div>
        </Card>


        {/* タグ */}
        <Card className="p-6 space-y-4">
          <Label htmlFor="tags" className="text-base font-semibold">タグ</Label>
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
          <Input
            id="tags"
            placeholder="例：nextjs（Enterキーで追加）"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            disabled={tags.length >= 5}
          />
        </Card>

        {/* 送信ボタン */}
        <div className="flex gap-3">
          <Button
            type="submit"
            size="lg"
            disabled={
              loading || title.length < 15 || content.length < 30 || tags.length === 0
            }
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
