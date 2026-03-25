'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'

const EXAMPLES = [
  '맥도날드 드라이브스루 알바',
  '편의점 야간 알바',
  '유튜브 봄',
  '집에서 게임함',
  '카페 바리스타',
]

export default function Home() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastTransformedInput, setLastTransformedInput] = useState('')
  const [copied, setCopied] = useState(false)
  const captureRef = useRef<HTMLDivElement>(null)

  async function handleTransform() {
    if (!input.trim()) return
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
      if (!res.ok) throw new Error(data.error || '변환 실패')
      setResult(data.result)
      setLastTransformedInput(input)
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  async function handleCapture() {
    if (!captureRef.current) return
    const canvas = await html2canvas(captureRef.current, {
      useCORS: true,
      scale: 2,
      backgroundColor: '#ffffff',
    })
    const link = document.createElement('a')
    link.download = '있어빌리티.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <main className='min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-4 py-16'>
      {/* Title */}
      <div className='text-center mb-10'>
        <p className='text-sm text-zinc-500 mb-2 tracking-widest uppercase'>
          있어빌리티
        </p>
        <h1 className='text-4xl md:text-5xl font-bold text-white mb-3'>
          직업을{' '}
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500'>
            있어보이게
          </span>
        </h1>
        <p className='text-zinc-400 text-sm md:text-base'>
          평범한 직업도 자소서에 쓸 수 있는 표현으로 바꿔드립니다
        </p>
        <del className='text-zinc-600 text-sm'>
          (자소서가 합격한다는 보장은 할 수 없습니다)
        </del>
      </div>

      {/* Meme Card */}
      <div
        ref={captureRef}
        className='w-full max-w-2xl border-4 border-black overflow-hidden'
      >
        {/* Top row — origin pooh + input */}
        <div className='flex border-b-4 border-black bg-white'>
          {/* Pooh image — crossfade on loading */}
          <div className='w-[45%] shrink-0 border-r-4 border-black relative overflow-hidden aspect-[718/568]'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/images/origin-pooh.png'
              alt='일반 곰돌이 푸'
              className={`w-full h-full object-cover transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/images/rich-pooh.png'
              alt='있어보이는 곰돌이 푸'
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${loading ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
          {/* Input */}
          <div className='flex-1 flex flex-col justify-center p-5 bg-white'>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleTransform()
                }
              }}
              placeholder={'맥도날드\n드라이브스루에서\n일함'}
              rows={3}
              className='w-full text-black text-base md:text-xl font-bold text-center leading-snug bg-transparent resize-none outline-none placeholder-gray-300'
            />
          </div>
        </div>

        {/* Bottom row — rich pooh + result */}
        <div className='flex bg-[#dce8f5]'>
          <div className='w-[45%] shrink-0 border-r-4 border-black aspect-[718/568]'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/images/rich-pooh.png'
              alt='있어보이는 곰돌이 푸'
              className='w-full h-full object-cover object-top'
            />
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
              <p className='text-gray-400 text-sm md:text-lg font-bold text-center leading-snug'>
                저는 서비스 업계에서 200억 달러의 수익을 창출해내는 한 다국적
                기업의 관계자였습니다. 그 안에서 자동차 산업과 협력하는 일을
                했습니다.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className='mt-4 w-full max-w-2xl border-4 border-red-800 overflow-hidden flex'>
          <div className='w-[30%] shrink-0'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/images/pooh-with-hammer.jpeg'
              alt='에러'
              className='w-full h-full object-cover'
            />
          </div>
          <div className='flex-1 flex items-center bg-red-950 px-5'>
            <p className='text-red-400 text-sm font-medium'>{error}</p>
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
            onClick={handleTransform}
            disabled={!input.trim() || loading}
            className='w-full sm:w-auto bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold text-base px-8 py-3 rounded-xl transition-colors'
          >
            {loading ? '변환 중...' : '있어보이게 변환하기'}
          </button>
          {result && input === lastTransformedInput && (
            <>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
                className='w-full sm:w-auto border border-zinc-700 hover:border-amber-500/50 hover:text-amber-400 text-zinc-400 font-medium text-base px-5 py-3 rounded-xl transition-colors'
              >
                {copied ? '복사됨!' : '복사하기'}
              </button>
              <button
                onClick={handleCapture}
                className='w-full sm:w-auto border border-zinc-700 hover:border-amber-500/50 hover:text-amber-400 text-zinc-400 font-medium text-base px-5 py-3 rounded-xl transition-colors'
              >
                캡쳐하기
              </button>
            </>
          )}
        </div>
      </div>

      <div className='mt-12 flex flex-col items-center'>
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
    </main>
  )
}
