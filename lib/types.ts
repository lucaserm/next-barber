export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number // em minutos
  active: boolean
}

export interface Barber {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  specialties: string[]
  active: boolean
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  birthDate?: string
  notes?: string
  createdAt: string
  totalVisits: number
  totalSpent: number
}

export interface Appointment {
  id: string
  clientId: string
  clientName: string
  clientPhone: string
  barberId: string
  barberName: string
  serviceId: string
  serviceName: string
  servicePrice: number
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  notes?: string
  createdAt: string
}

export interface DashboardStats {
  totalRevenue: number
  totalAppointments: number
  totalClients: number
  averageTicket: number
  revenueGrowth: number
  appointmentsGrowth: number
}

export interface RevenueData {
  month: string
  revenue: number
  appointments: number
}

export interface ServiceStats {
  name: string
  count: number
  revenue: number
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "barber"
  barberId?: string
}
