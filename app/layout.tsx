import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel='icon' href='/images/tuxedo-pepe.webp' type='image/webp' />
      </head>
      <body>{children}</body>
    </html>
  )
}
