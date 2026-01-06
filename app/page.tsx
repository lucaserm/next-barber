import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { ServicesSection } from "@/components/landing/services-section"
import { BarbersSection } from "@/components/landing/barbers-section"
import { ContactSection } from "@/components/landing/contact-section"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ServicesSection />
        <BarbersSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
