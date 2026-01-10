import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/lib/design/providers"

export const metadata: Metadata = {
  title: "Blog Thiền - Chia sẻ cảm nhận về cuộc sống",
  description: "Nơi chia sẻ cảm nhận về cuộc sống theo góc nhìn thiền định",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <ThemeProvider defaultTheme="zen">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
