import type { Metadata } from 'next'
import './globals.css'

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://itability.vercel.app').replace(/\/$/, '')

export const metadata: Metadata = {
  title: '있어빌리티 — 직업을 있어보이게',
  description: '평범한 직업도 자소서에 쓸 수 있는 표현으로 바꿔드립니다. 맥도날드 알바도 글로벌 기업 관계자로.',
  keywords: ['자소서', '자기소개서', '직업', '있어보이게', '취업', '유머', '밈'],
  openGraph: {
    title: '있어빌리티 — 직업을 있어보이게',
    description: '평범한 직업도 자소서에 쓸 수 있는 표현으로 바꿔드립니다.',
    url: BASE_URL,
    siteName: '있어빌리티',
    images: [{ url: `${BASE_URL}/images/example.jpeg`, width: 1078, height: 924 }],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '있어빌리티 — 직업을 있어보이게',
    description: '평범한 직업도 자소서에 쓸 수 있는 표현으로 바꿔드립니다.',
    images: [`${BASE_URL}/images/example.jpeg`],
  },
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
