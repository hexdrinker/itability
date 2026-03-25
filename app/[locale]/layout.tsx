import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Analytics } from '@vercel/analytics/next'
import '../globals.css'

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://itability.vercel.app').replace(/\/$/, '')

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  if (locale === 'en') {
    return {
      title: 'Itability — Make Your Job Sound Fancy',
      description: 'Turn any job into something that sounds impressive. Even McDonald\'s drive-thru becomes a global automotive liaison.',
      keywords: ['resume', 'job description', 'fancy', 'humor', 'meme', 'career'],
      openGraph: {
        title: 'Itability — Make Your Job Sound Fancy',
        description: 'Turn any job into something that sounds impressive.',
        url: `${BASE_URL}/en`,
        siteName: 'Itability',
        images: [{ url: `${BASE_URL}/images/example.jpeg`, width: 1078, height: 924 }],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Itability — Make Your Job Sound Fancy',
        description: 'Turn any job into something that sounds impressive.',
        images: [`${BASE_URL}/images/example.jpeg`],
      },
    }
  }

  return {
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
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
