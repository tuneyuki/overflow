import { Search, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cookies } from 'next/headers'
import { ThemeToggle } from "@/components/theme-toggle"

export async function Header() {
  const cookieStore = await cookies()
  const email = cookieStore.get('user_email')?.value || 'anonymous'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      {/* 👇 justify-between で 左・中央・右 に配置 */}
      <div className="flex h-14 items-center justify-between px-4">

        {/* 左：ロゴ */}
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">業務後Overflow</span>
        </div>

        {/* 中央：検索 */}
        <div className="flex-1 max-w-2xl px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search questions..."
              className="w-full pl-9 bg-muted/50"
            />
          </div>
        </div>

        {/* 右：ユーザー */}
        <div className="flex items-center gap-2 m-4">
          <span className="text-sm text-muted-foreground">
            👤 {email}
          </span>
          <ThemeToggle />
        </div>

      </div>
    </header>
  )
}
