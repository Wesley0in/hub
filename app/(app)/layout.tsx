import { Header } from '@/components/header'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d0d14]">
      <Header />
      <main className="pt-14">
        {children}
      </main>
    </div>
  )
}
