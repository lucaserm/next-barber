"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Scissors, Menu, Calendar } from "@/components/icons"

const navItems = [
  { label: "Serviços", href: "#servicos" },
  { label: "Profissionais", href: "#profissionais" },
  { label: "Contato", href: "#contato" },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Scissors className="w-6 h-6 text-primary" />
            <span className="font-serif text-xl font-bold">BarberPro</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
              <Link href="/admin/login">Área Admin</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/agendar">
                <Calendar className="w-4 h-4 mr-2" />
                Agendar
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium py-2 hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <hr className="my-4" />
                  <Link
                    href="/admin/login"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium py-2 hover:text-primary transition-colors"
                  >
                    Área Admin
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
