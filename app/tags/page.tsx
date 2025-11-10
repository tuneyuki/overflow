// app/tags/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Tag {
  id: number
  name: string
  color: string | null
  count: number
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<"count" | "name">("count")

  // タグ一覧取得
  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch("/api/tags") // すべてのタグを取得
        const data = await res.json()
        if (res.ok) setTags(data)
      } catch (err) {
        console.error("Failed to fetch tags:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTags()
  }, [])

  // ソート処理
  const sortedTags = [...tags].sort((a, b) => {
    if (sort === "count") return b.count - a.count
    return a.name.localeCompare(b.name, "ja")
  })

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">タグ一覧</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? "Loading..." : `${tags.length} 件のタグ`}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={sort === "count" ? "default" : "outline"}
            size="sm"
            onClick={() => setSort("count")}
          >
            人気順
          </Button>
          <Button
            variant={sort === "name" ? "default" : "outline"}
            size="sm"
            onClick={() => setSort("name")}
          >
            名前順
          </Button>
        </div>
      </div>

      {/* タググリッド */}
      {loading ? (
        <p className="text-muted-foreground">読み込み中...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.id}`}
              className="flex items-center justify-between p-4 border rounded-md hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn("w-3 h-3 rounded-full", tag.color || "bg-gray-400")}
                />
                <span className="font-medium">{tag.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{tag.count}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
