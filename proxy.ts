import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(req: NextRequest) {
  // ヘッダからユーザー情報を取得
  const email = req.headers.get('x-ms-client-principal-name') || 'anonymous'

  // Nextのレスポンス生成
  const res = NextResponse.next()

  // Cookieにユーザー情報を保存（httpOnly: false はクライアントJS用）
  res.cookies.set('user_email', email, {
    httpOnly: false,
    path: '/',
  })

  // ログ出力（開発中のデバッグ用）
  // console.log('🧩 Current User:', email)

  return res
}
