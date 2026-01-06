"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { barbers } from "@/lib/mock-data"

export function BarbersSection() {
  return (
    <section id="profissionais" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Nossos Profissionais</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Equipe qualificada e experiente para oferecer o melhor atendimento.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {barbers
            .filter((b) => b.active)
            .map((barber) => (
              <Card key={barber.id} className="text-center p-6">
                <CardContent className="pt-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
                    <AvatarImage src={barber.avatar || "/placeholder.svg"} alt={barber.name} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {barber.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold mb-2">{barber.name}</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {barber.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>
  )
}
