"use client"

import React from "react"
import ReactMarkdown, { Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"

export function MarkdownContent({ content }: { content: string }) {
  const components: Components = {
    // ✅ <p> 内にブロック要素を入れない
    p({ node, children }) {
      const hasBlock = React.Children.toArray(children).some(
        (child) =>
          React.isValidElement(child) &&
          ["pre", "div", "table", "blockquote"].includes(String(child.type))
      )
      if (hasBlock) return <>{children}</> // ← Fragmentで返す
      return (
        <p className="leading-relaxed mb-2 whitespace-pre-wrap">{children}</p>
      )
    },

    // ✅ 見出し
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold mt-6 mb-3">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-semibold mt-5 mb-2">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>
    ),

    // ✅ リスト
    ul: ({ children }) => (
      <ul className="list-disc ml-6 mb-2 space-y-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal ml-6 mb-2 space-y-1">{children}</ol>
    ),

    // ✅ テーブル
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-1 font-semibold text-left">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-gray-300 dark:border-gray-700 px-3 py-1 align-top">
        {children}
      </td>
    ),

    // ✅ 引用
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 bg-blue-50 dark:bg-gray-800 dark:border-blue-400 pl-4 py-2 my-3 italic text-gray-700 dark:text-gray-300">
        {children}
      </blockquote>
    ),

    // ✅ リンク
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
      >
        {children}
      </a>
    ),

    // ✅ コードブロック — <div> や <p> でラップしない
    code({ inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "")

      if (inline) {
        return (
          <code
            className="bg-gray-200 dark:bg-gray-800 rounded px-1 py-0.5 text-sm"
            {...props}
          >
            {children}
          </code>
        )
      }

      // 🔥 ここが重要：Fragmentで返してpを避ける
      return (
        <>
          <pre className="bg-gray-900 text-gray-100 p-3 rounded-md overflow-x-auto text-sm my-2">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </>
      )
    },
  }

  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
