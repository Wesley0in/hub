import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'ProjectHub — Gestão de Projetos',
  description: 'Sistema pessoal de gestão de projetos com Kanban, dashboard e integrações.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} dark bg-[#0d0d14] font-sans`}>
      <body className="font-sans antialiased text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
