import Link from "next/link"
import { Scissors } from "@/components/icons"

export function Footer() {
  return (
    <footer className="py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-primary" />
            <span className="font-serif text-lg font-bold">Elite67</span>
          </Link>

          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Elite67. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/termos" className="text-sm text-muted-foreground hover:text-primary">
              Termos
            </Link>
            <Link href="/privacidade" className="text-sm text-muted-foreground hover:text-primary">
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
