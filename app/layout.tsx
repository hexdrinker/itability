import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '있어빌리티 — 직업을 있어보이게',
  description: '평범한 직업을 있어보이는 표현으로 바꿔드립니다',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='ko'>
      <body>{children}</body>
    </html>
  )
}
