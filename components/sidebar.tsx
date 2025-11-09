"use client"

import { useEffect, useState } from "react"
import { Home, TrendingUp, Tag, BookOpen, HelpCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "ホーム", href: "/", icon: Home },
  { name: "質問", href: "/questions", icon: HelpCircle },
  { name: "未解決", href: "/unanswered", icon: HelpCircle },
  { name: "Tags", href: "/tags", icon: Tag },
  { name: "My質問", href: "/myquestions", icon: Tag },
]

interface TagInfo {
  id: number
  name: string
  color: string | null
  count: number
}

export function Sidebar() {
  const pathname = usePathname()
  const [tags, setTags] = useState<TagInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch("/api/tags?limit=10")
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

  return (
    <aside className="w-64 border-r bg-card min-h-[calc(100vh-3.5rem)] sticky top-14 dark:bg-gray-900">
      <div className="p-4 space-y-6">
        {/* Main Navigation */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Trending Section */}
        <div>
          <div className="flex items-center gap-2 px-3 mb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Trending</h3>
          </div>
          <div className="space-y-1">
            <Link
              href="/questions/trending"
              className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              This week
            </Link>
            <Link
              href="/questions/month"
              className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              This month
            </Link>
          </div>
        </div>

        {/* Popular Tags */}
        <div>
          <div className="flex items-center gap-2 px-3 mb-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Popular Tags</h3>
          </div>

          {loading ? (
            <p className="px-3 text-xs text-muted-foreground">Loading...</p>
          ) : (
            <div className="space-y-2">
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.name.toLowerCase()}`}
                  className="flex items-center justify-between px-3 py-1.5 rounded-md hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    {/* 🔹 DBに登録された色を適用 */}
                    <div
                      className={cn("w-2 h-2 rounded-full", tag.color || "bg-gray-400")}
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground">
                      {tag.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{tag.count}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
