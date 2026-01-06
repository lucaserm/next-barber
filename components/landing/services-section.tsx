"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ChevronRight } from "@/components/icons"
import { services } from "@/lib/mock-data"
import Link from "next/link"

export function ServicesSection() {
  return (
    <section id="servicos" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Nossos Serviços</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Oferecemos uma variedade de serviços premium para que você saia sempre no estilo.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {services
            .filter((s) => s.active)
            .map((service) => (
              <Card key={service.id} className="group hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {service.name}
                    <span className="text-primary font-bold">R$ {service.price}</span>
                  </CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {service.duration} min
                    </div>
                    <Button asChild variant="ghost" size="sm" className="group-hover:text-primary">
                      <Link href={`/agendar?service=${service.id}`}>
                        Agendar
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>
  )
}
