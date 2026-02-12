import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { ReactQueryProvider } from "@/lib/query-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Elite67 - Sistema de Gestão para Barbearias",
  description:
    "Sistema completo de gestão para barbearias. Agendamento online, controle financeiro, gestão de clientes e muito mais.",
  generator: "v0.app",
  keywords: ["barbearia", "agendamento", "gestão", "barber", "corte de cabelo"],
}

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`font-sans antialiased ${inter.className} ${playfair.variable}`}>
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
