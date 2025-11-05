import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // ===== レイアウト基礎 =====
        "flex w-full rounded-md px-3 py-2 text-base md:text-sm outline-none transition-colors resize-y",
        // ===== 背景：ページと区別がつく明るめグレー =====
        "bg-gray-300 dark:bg-gray-800 text-foreground",
        // ===== 境界線：ライト＝中間グレー、ダーク＝明るいグレー =====
        "border border-gray-300 dark:border-gray-600",
        // ===== 状態 =====
        "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // ===== シャドウ削除 =====
        "shadow-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
