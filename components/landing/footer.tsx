import Link from "next/link"
import { Scissors } from "@/components/icons"
import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations("landing.footer")
  return (
    <footer className="py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-primary" />
            <span className="font-serif text-lg font-bold">Elite67</span>
          </Link>

          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Elite67. {t("rights")}
          </p>

          <div className="flex items-center gap-6">
            <Link href="/termos" className="text-sm text-muted-foreground hover:text-primary">
              {t("terms")}
            </Link>
            <Link href="/privacidade" className="text-sm text-muted-foreground hover:text-primary">
              {t("privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
