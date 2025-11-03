'use client'

import { useEffect, useState } from 'react'

export function useUser() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    // Cookieからuser_emailを取り出す
    const match = document.cookie
      .split('; ')
      .find(row => row.startsWith('user_email='))
    if (match) {
      const value = decodeURIComponent(match.split('=')[1])
      setEmail(value)
    } else {
      setEmail('anonymous@example.com')
    }
  }, [])

  return { email }
}
