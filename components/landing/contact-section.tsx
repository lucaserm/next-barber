"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "@/components/icons"

export function ContactSection() {
  return (
    <section id="contato" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Localização e Contato</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Venha nos visitar ou entre em contato para mais informações.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Endereço</h3>
                  <p className="text-muted-foreground">
                    Rua dos Barbeiros, 123
                    <br />
                    Centro - São Paulo, SP
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Telefone</h3>
                  <p className="text-muted-foreground">(11) 99999-9999</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">E-mail</h3>
                  <p className="text-muted-foreground">contato@barberpro.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Horário de Funcionamento</h3>
                  <p className="text-muted-foreground">
                    Seg - Sex: 09:00 - 20:00
                    <br />
                    Sábado: 09:00 - 18:00
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div
              className="w-full h-full min-h-[300px] bg-cover bg-center"
              style={{
                backgroundImage: "url('/map-location-pin-barber-shop.jpg')",
              }}
            />
          </Card>
        </div>
      </div>
    </section>
  )
}
