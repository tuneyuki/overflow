"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { MarkdownContent } from "@/components/ui/markdown" // ✅ これを使う！

// 🔹 Markdownサンプル一覧
const examples = [
  {
    title: "📘 見出し",
    markdown: `# 見出し1
## 見出し2
### 見出し3`,
  },
  {
    title: "📋 リスト",
    markdown: `- 項目A  
- 項目B

1. 番号付き項目  
2. 番号付き項目`,
  },
  {
    title: "📝 テキスト装飾",
    markdown: `**太字**
_斜体_
~~取り消し線~~
\`インラインコード\``,
  },
  {
    title: "💡 コードブロック",
    markdown: `\`\`\`js
function hello() {
  console.log("Hello world!");
}
\`\`\``,
  },
  {
    title: "🔗 リンク・引用",
    markdown: `[リンクテキスト](https://example.com)

> 引用文`,
  },
  {
    title: "📊 表（Table）",
    markdown: `| 項目 | 値 |
| ---- | ---- |
| A | 100 |
| B | 200 |`,
  },
]

export function MarkdownHelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-sm text-muted-foreground hover:text-foreground gap-1 h-auto p-1"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Markdown記法を見る</span>
        </Button>
      </DialogTrigger>

      {/* ✅ 横幅拡大 */}
      <DialogContent className="!max-w-7xl w-[90vw] max-h-[80vh] overflow-y-auto bg-card dark:bg-gray-900 border border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle>📝 Markdown記法ヘルプ</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mb-4">
          このエディタでは <strong>Markdown</strong> 記法を使って、コードや表をわかりやすく装飾できます。
        </p>

        {/* ✅ 各例をMarkdownContentでプレビュー */}
        <div className="space-y-8">
          {examples.map((ex) => (
            <div key={ex.title}>
              <h3 className="font-semibold mb-2">{ex.title}</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* 左側：Markdown原文 */}
                <pre className="bg-muted p-3 rounded-md text-sm font-mono whitespace-pre leading-snug overflow-x-auto">
                  {ex.markdown}
                </pre>

                {/* 右側：描画プレビュー */}
                <div className="border rounded-md p-3 bg-background">
                  <MarkdownContent content={ex.markdown} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
