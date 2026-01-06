"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Scissors, AlertCircle } from "@/components/icons"
import { useStore } from "@/lib/store"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const success = await login(email, password)

    if (success) {
      router.push("/admin")
    } else {
      setError("E-mail ou senha inválidos")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Scissors className="w-8 h-8 text-primary" />
            <span className="font-serif text-2xl font-bold">BarberPro</span>
          </Link>
          <CardTitle>Área Administrativa</CardTitle>
          <CardDescription>Entre com suas credenciais para acessar o painel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@barberpro.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-muted text-sm">
            <p className="font-medium mb-2">Credenciais de teste:</p>
            <p className="text-muted-foreground">
              Admin: admin@barberpro.com / admin123
              <br />
              Barbeiro: carlos@barberpro.com / barber123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
