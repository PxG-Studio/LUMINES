import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { ThemeProvider } from '@/design-system/themes/ThemeProvider'
import { SessionProvider } from '@/components/providers/SessionProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'WIS2L - Workspace Integrated Subsystem Structuring & Interfacing Layer',
  description: 'The unified development environment for the Nocturna Network',
  keywords: ['WIS2L', 'Nocturna', 'Design System', 'Component Library', 'Development Tools'],
  authors: [{ name: 'Nocturna Network' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0A0E27',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <SessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
