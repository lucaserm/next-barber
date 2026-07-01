"use client"

import { Button } from "@/components/ui/button"
import { Scissors, Calendar, Star } from "@/components/icons"
import Link from "next/link"
import { useTranslations } from "next-intl"

export function Hero() {
  const t = useTranslations("landing.hero")
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background com overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/barber-shop-interior-dark-moody-professional.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm text-primary font-medium">{t("badge")}</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-6 text-balance">
          {t.rich("title", {
            highlight: (chunks) => <span className="text-primary">{chunks}</span>,
            br: () => <br />,
          })}
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
          {t("subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/agendar">
              <Calendar className="w-5 h-5 mr-2" />
              {t("bookCta")}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
            <Link href="#servicos">
              <Scissors className="w-5 h-5 mr-2" />
              {t("servicesCta")}
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary">5+</div>
            <div className="text-sm text-muted-foreground">{t("statsExperience")}</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary">2k+</div>
            <div className="text-sm text-muted-foreground">{t("statsClients")}</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary">4.9</div>
            <div className="text-sm text-muted-foreground">{t("statsRating")}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
