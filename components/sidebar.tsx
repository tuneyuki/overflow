"use client"

import { Home, TrendingUp, Tag, Users, BookOpen, HelpCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Questions", href: "/questions", icon: HelpCircle },
  { name: "Tags", href: "/tags", icon: Tag },
  { name: "Users", href: "/users", icon: Users },
]

const categories = [
  { name: "社内OA系", count: 1234, color: "bg-yellow-500" },
  { name: "勤務申請", count: 987, color: "bg-blue-500" },
  { name: "ぱわぷら", count: 654, color: "bg-primary" },
  { name: "Dify", count: 543, color: "bg-blue-600" },
  { name: "Python", count: 432, color: "bg-green-600" },
  { name: "Copilot", count: 321, color: "bg-pink-500" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-card min-h-[calc(100vh-3.5rem)] sticky top-14">
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
          <div className="space-y-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/tags/${category.name.toLowerCase()}`}
                className="flex items-center justify-between px-3 py-1.5 rounded-md hover:bg-muted transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", category.color)} />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground">{category.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{category.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
