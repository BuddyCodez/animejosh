import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="min-h-screen bg-background font-sans antialiased">
        <Main />
        <NextScript />
        <script src="https://kit.fontawesome.com/79101233a3.js" crossOrigin="anonymous"></script>
      </body>
    </Html>
  )
}
