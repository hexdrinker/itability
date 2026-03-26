import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('notFound')

  return (
    <main className='min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-4'>
      <div className='w-full max-w-lg border-4 border-black overflow-hidden'>
        {/* Top row */}
        <div
          className='flex border-b-4 border-black bg-white'
          style={{ minHeight: 180 }}
        >
          <div className='w-[45%] shrink-0 border-r-4 border-black'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/images/sad-pepe.webp'
              alt='슬픈 페페'
              className='w-full h-full object-cover'
            />
          </div>
          <div className='flex-1 flex flex-col justify-center items-center p-5 bg-white'>
            <p className='text-black text-2xl font-black text-center'>
              {t('top')}
            </p>
          </div>
        </div>

        {/* Bottom row */}
        <div
          className='flex bg-[#dce8f5]'
          style={{ minHeight: 180 }}
        >
          <div className='w-[45%] shrink-0 border-r-4 border-black'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/images/tuxedo-pepe.webp'
              alt='턱시도를 입은 페페'
              className='w-full h-full object-cover'
            />
          </div>
          <div className='flex-1 flex flex-col justify-center items-center p-5'>
            <p className='text-black text-lg font-bold text-center leading-snug whitespace-pre-wrap'>
              {t('bottom')}
            </p>
          </div>
        </div>
      </div>

      <Link
        href='/'
        className='mt-8 text-sm text-zinc-500 hover:text-amber-400 underline underline-offset-4 transition-colors'
      >
        {t('backHome')}
      </Link>
    </main>
  )
}
