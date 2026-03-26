'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { track } from '@vercel/analytics'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

export default function Home() {
  const t = useTranslations()
  const locale = useLocale()

  const EXAMPLES = t.raw('examples') as string[]

  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastTransformedInput, setLastTransformedInput] = useState('')
  const [copied, setCopied] = useState(false)
  const captureCardRef = useRef<HTMLDivElement>(null)

  async function handleTransform(method: 'button' | 'enter' = 'button') {
    if (!input.trim() || loading) return
    track(`transform_try_${method}`)
    setLoading(true)
    setResult('')
    setError('')

    try {
      const res = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job: input }),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = data.error || ''
        if (
          res.status === 422 ||
          msg.includes('INVALID_INPUT') ||
          msg.includes('그런 입력') ||
          msg.includes('Nice try')
        ) {
          throw new Error(t('error.invalidInput'))
        }
        if (res.status === 429) {
          throw new Error(t('error.rateLimit'))
        }
        throw new Error(t('error.generic'))
      }
      setResult(data.result)
      setLastTransformedInput(input)
      track(`transform_success_${method}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : t('error.generic'))
    } finally {
      setLoading(false)
    }
  }

  async function handleCapture() {
    if (!captureCardRef.current) return
    track('capture')
    const canvas = await html2canvas(captureCardRef.current, {
      useCORS: true,
      scale: 2,
      backgroundColor: '#ffffff',
    })
    const link = document.createElement('a')
    const now = new Date()
    const yy = String(now.getFullYear()).slice(2)
    const MM = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const hh = String(now.getHours()).padStart(2, '0')
    const mm = String(now.getMinutes()).padStart(2, '0')
    const ss = String(now.getSeconds()).padStart(2, '0')
    link.download = `${t('title.label')}_${yy}${MM}${dd}-${hh}${mm}${ss}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const otherLocale = locale === 'ko' ? 'en' : 'ko'
  const otherLocaleHref = locale === 'ko' ? '/en' : '/ko'
  const otherLocaleLabel = locale === 'ko' ? t('locale.en') : t('locale.ko')

  return (
    <main className='relative min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-4 py-16'>
      {/* Language switcher — fixed top right */}
      <Link
        href={otherLocaleHref}
        className='fixed top-4 right-4 z-30 text-sm text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors backdrop-blur-sm'
      >
        {otherLocaleLabel}
      </Link>

      {/* Hidden capture card — fixed 800px, off-screen */}
      <div
        ref={captureCardRef}
        style={{
          position: 'absolute',
          left: -9999,
          top: 0,
          width: 800,
          border: '4px solid black',
          overflow: 'hidden',
          fontFamily: 'inherit',
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: 'flex',
            borderBottom: '4px solid black',
            background: 'white',
          }}
        >
          <div
            style={{
              width: 360,
              flexShrink: 0,
              borderRight: '4px solid black',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/images/sad-pepe.webp'
              alt=''
              style={{
                width: '100%',
                aspectRatio: '1/1',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: 28,
              background: 'white',
            }}
          >
            <p
              style={{
                color: 'black',
                fontSize: 26,
                fontWeight: 700,
                textAlign: 'center',
                lineHeight: 1.45,
                whiteSpace: 'pre-wrap',
                margin: 0,
              }}
            >
              {input}
            </p>
          </div>
        </div>
        {/* Bottom row */}
        <div style={{ display: 'flex', background: '#dce8f5' }}>
          <div
            style={{
              width: 360,
              flexShrink: 0,
              borderRight: '4px solid black',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/images/tuxedo-pepe.webp'
              alt=''
              style={{
                width: '100%',
                aspectRatio: '1/1',
                objectFit: 'cover',
                objectPosition: 'top',
                display: 'block',
              }}
            />
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: 28,
            }}
          >
            <p
              style={{
                color: 'black',
                fontSize: 22,
                fontWeight: 700,
                textAlign: 'center',
                lineHeight: 1.55,
                whiteSpace: 'pre-wrap',
                margin: 0,
              }}
            >
              {result}
            </p>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className='text-center mb-10'>
        <p className='text-sm text-zinc-500 mb-2 tracking-widest uppercase'>
          {t('title.label')}
        </p>
        <h1 className='text-4xl md:text-5xl font-bold text-white mb-3'>
          {t('title.heading1')}{' '}
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500'>
            {t('title.heading2')}
          </span>
        </h1>
        <p className='text-zinc-400 text-sm md:text-base'>
          {t('title.subtitle')}
        </p>
        <del className='text-zinc-600 text-sm'>{t('title.disclaimer')}</del>
      </div>

      {/* Meme Card */}
      <div className='w-full max-w-2xl border-4 border-black overflow-hidden md:px-6 px-0'>
        {/* Top row — sad pepe + input */}
        <div className='relative flex border-b-4 border-black bg-white'>
          <div className='w-[45%] shrink-0 border-r-4 border-black self-stretch bg-white flex items-center justify-center'>
            <div className='w-full relative overflow-hidden'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src='/images/sad-pepe.webp'
                alt='슬픈 페페'
                className='w-full h-full object-cover'
              />
            </div>
          </div>
          {/* Input */}
          <div className='relative flex-1 flex flex-col justify-center p-5 bg-white'>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleTransform('enter')
                }
              }}
              placeholder={t('placeholder')}
              rows={3}
              maxLength={60}
              className='w-full text-black text-base md:text-xl font-bold text-center leading-snug bg-transparent resize-none outline-none placeholder-gray-300'
            />
            <p
              className={`absolute bottom-2 right-3 text-xs ${input.length >= 60 ? 'text-red-400' : 'text-gray-300'}`}
            >
              {input.length}/60
            </p>
          </div>
        </div>

        {/* Bottom row — tuxedo pepe + result */}
        <div className='flex bg-[#dce8f5]'>
          <div className='w-[45%] shrink-0 border-r-4 border-black self-stretch bg-[#dce8f5] flex items-center justify-center'>
            <div className='w-full overflow-hidden'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src='/images/tuxedo-pepe.webp'
                alt='턱시도를 입은 페페'
                className='w-full h-full object-cover object-top'
              />
            </div>
          </div>
          {/* Result */}
          <div className='flex-1 flex flex-col justify-center p-5'>
            {loading ? (
              <div className='space-y-3 animate-pulse'>
                <div className='h-4 bg-blue-200 rounded w-full' />
                <div className='h-4 bg-blue-200 rounded w-5/6' />
                <div className='h-4 bg-blue-200 rounded w-4/6' />
              </div>
            ) : result ? (
              <p className='text-black text-sm md:text-lg font-bold text-center leading-snug whitespace-pre-wrap'>
                {result}
              </p>
            ) : (
              <p className='text-gray-400 text-sm md:text-lg font-bold text-center leading-snug whitespace-pre-wrap'>
                {t('result.placeholder')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className='mt-4 w-full max-w-2xl border-4 border-red-800 overflow-hidden flex flex-col sm:flex-row'>
          <div className='w-full sm:w-[30%] sm:shrink-0'>
            <video
              autoPlay
              loop
              muted
              playsInline
              className='w-full object-cover'
            >
              <source
                src='/videos/puch-pepe.mp4'
                type='video/mp4'
              />
            </video>
          </div>
          <div className='flex flex-1 items-center justify-center sm:justify-start bg-red-950 px-5 py-4'>
            <p className='text-red-400 text-sm font-medium text-center sm:text-left'>
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className='mt-6 w-full max-w-2xl flex flex-col items-center gap-4'>
        <div className='flex flex-wrap gap-2 justify-center'>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type='button'
              onClick={() => setInput(ex)}
              className='text-xs text-zinc-500 hover:text-zinc-300 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-full transition-colors'
            >
              {ex}
            </button>
          ))}
        </div>

        <div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0'>
          <button
            onClick={() => handleTransform('button')}
            disabled={!input.trim() || loading}
            className='w-full sm:w-auto bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold text-base px-8 py-3 rounded-xl transition-colors'
          >
            {loading ? t('button.transforming') : t('button.transform')}
          </button>
          {result && input === lastTransformedInput && (
            <>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                  track('copy')
                }}
                className='w-full sm:w-auto border border-zinc-700 hover:border-amber-500/50 hover:text-amber-400 text-zinc-400 font-medium text-base px-5 py-3 rounded-xl transition-colors'
              >
                {copied ? t('button.copied') : t('button.copy')}
              </button>
              <button
                onClick={handleCapture}
                className='w-full sm:w-auto border border-zinc-700 hover:border-amber-500/50 hover:text-amber-400 text-zinc-400 font-medium text-base px-5 py-3 rounded-xl transition-colors'
              >
                {t('button.capture')}
              </button>
            </>
          )}
        </div>
        {result && input === lastTransformedInput && (
          <p className='text-xs text-zinc-600 text-center'>
            {t('captureHint')}
          </p>
        )}
      </div>

      <div className='mt-12 flex flex-col items-center gap-3'>
        <p className='text-xs text-zinc-700'>
          © 2026{' '}
          <a
            href='https://github.com/hexdrinker'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-zinc-400 transition-colors underline underline-offset-2'
          >
            hexdrinker
          </a>
        </p>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className='absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md'>
          <div className='flex flex-col items-center gap-4'>
            <video
              autoPlay
              loop
              muted
              playsInline
              className='w-[200px] sm:w-[clamp(160px,30vw,340px)] rounded-full shadow-2xl'
            >
              <source
                src='/videos/loading-pepe.mp4'
                type='video/mp4'
              />
            </video>
            <p className='text-center text-white text-2xl font-bold'>
              {t('loading')}
            </p>
          </div>
        </div>
      )}
    </main>
  )
}
