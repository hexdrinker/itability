import Link from 'next/link'

export default function NotFound() {
  return (
    <main className='min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-4'>
      <div className='w-full max-w-lg border-4 border-black overflow-hidden'>
        {/* Top row */}
        <div className='flex border-b-4 border-black bg-white' style={{ minHeight: 180 }}>
          <div className='w-[45%] shrink-0 border-r-4 border-black'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/images/origin-pooh.png'
              alt='곰돌이 푸'
              className='w-full h-full object-cover'
            />
          </div>
          <div className='flex-1 flex flex-col justify-center items-center p-5 bg-white'>
            <p className='text-black text-2xl font-black text-center'>없는 페이지 왔음</p>
          </div>
        </div>

        {/* Bottom row */}
        <div className='flex bg-[#dce8f5]' style={{ minHeight: 180 }}>
          <div className='w-[45%] shrink-0 border-r-4 border-black'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/images/rich-pooh.png'
              alt='있어보이는 곰돌이 푸'
              className='w-full h-full object-cover'
            />
          </div>
          <div className='flex-1 flex flex-col justify-center items-center p-5'>
            <p className='text-black text-lg font-bold text-center leading-snug'>
              저는 현재 존재하지 않는
              <br />
              경로에 대한 접근 요청을
              <br />
              정중히 거절하는
              <br />
              업무를 맡고 있습니다.
            </p>
          </div>
        </div>
      </div>

      <Link
        href='/'
        className='mt-8 text-sm text-zinc-500 hover:text-amber-400 underline underline-offset-4 transition-colors'
      >
        홈으로 돌아가기
      </Link>
    </main>
  )
}
