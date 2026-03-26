'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

type Props = {
  slot: string
  className?: string
}

export default function AdUnit({ slot, className }: Props) {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])

  return (
    <ins
      className={`adsbygoogle ${className ?? ''}`}
      style={{ display: 'block' }}
      data-ad-client='ca-pub-7909759552833703'
      data-ad-slot={slot}
      data-ad-format='auto'
      data-full-width-responsive='true'
    />
  )
}
