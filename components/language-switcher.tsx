"use client"

import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

// Toggles NEXT_LOCALE between the two supported locales via cookie, then
// refreshes so the server re-renders with the new locale (no URL change).
export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()

  const toggle = () => {
    const next = locale === "en" ? "pt-br" : "en"
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000`
    router.refresh()
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggle} aria-label="Change language">
      {locale === "en" ? "EN" : "PT"}
    </Button>
  )
}
