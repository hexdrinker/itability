import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import '../globals.css'

const BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || 'https://itability.vercel.app'
).replace(/\/$/, '')

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  if (locale === 'en') {
    return {
      title: 'Itability — Make Your Job Sound Impressive',
      description:
        "Turn ordinary jobs and experiences into polished, resume-ready language. Even a part-time role at McDonald's can sound like global corporate liaison work.",
      keywords: [
        'resume',
        'job description',
        'fancy',
        'humor',
        'meme',
        'career',
      ],
      openGraph: {
        title: 'Itability — Make Your Job and Experience Sound Impressive',
        description:
          'Make ordinary jobs and experiences sound impressive with polished, credible phrasing.',
        url: `${BASE_URL}/en`,
        siteName: 'Itability',
        images: [
          { url: `${BASE_URL}/images/example.jpeg`, width: 1078, height: 924 },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Itability — Make Your Job and Experience Sound Impressive',
        description:
          'Make ordinary jobs and experiences sound impressive with polished, credible phrasing.',
        images: [`${BASE_URL}/images/example.jpeg`],
      },
    }
  }

  return {
    title: '있어빌리티 — 직업을 있어보이게',
    description:
      '평범한 직업과 경험도 이력서에 쓸 수 있는 표현으로 바꿔드립니다. 맥도날드 알바도 글로벌 기업 관계자로.',
    keywords: [
      '자소서',
      '자기소개서',
      '직업',
      '있어보이게',
      '취업',
      '유머',
      '밈',
      '이력서',
    ],
    openGraph: {
      title: '있어빌리티 — 직업과 경험을 있어보이게',
      description:
        '평범한 직업과 경험도 있어보이게, 그럴듯한 표현으로 바꿔드립니다.',
      url: BASE_URL,
      siteName: '있어빌리티',
      images: [
        { url: `${BASE_URL}/images/example.jpeg`, width: 1078, height: 924 },
      ],
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: '있어빌리티 — 직업과 경험을 있어보이게',
      description:
        '평범한 직업과 경험도 있어보이게, 그럴듯한 표현으로 바꿔드립니다.',
      images: [`${BASE_URL}/images/example.jpeg`],
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <Script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7909759552833703'
          crossOrigin='anonymous'
          strategy='afterInteractive'
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
