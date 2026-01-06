"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Service, Barber, Client, Appointment, User } from "./types"
import {
  services as initialServices,
  barbers as initialBarbers,
  clients as initialClients,
  appointments as initialAppointments,
} from "./mock-data"

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void

  // Services
  services: Service[]
  addService: (service: Omit<Service, "id">) => void
  updateService: (id: string, service: Partial<Service>) => void
  deleteService: (id: string) => void

  // Barbers
  barbers: Barber[]
  addBarber: (barber: Omit<Barber, "id">) => void
  updateBarber: (id: string, barber: Partial<Barber>) => void
  deleteBarber: (id: string) => void

  // Clients
  clients: Client[]
  addClient: (client: Omit<Client, "id" | "createdAt" | "totalVisits" | "totalSpent">) => void
  updateClient: (id: string, client: Partial<Client>) => void
  deleteClient: (id: string) => void

  // Appointments
  appointments: Appointment[]
  addAppointment: (appointment: Omit<Appointment, "id" | "createdAt">) => void
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void
  deleteAppointment: (id: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Mock login - em produção seria uma chamada API
        if (email === "admin@barberpro.com" && password === "admin123") {
          set({
            user: { id: "1", name: "Administrador", email, role: "admin" },
            isAuthenticated: true,
          })
          return true
        }
        // Login como barbeiro
        const barber = get().barbers.find((b) => b.email === email)
        if (barber && password === "barber123") {
          set({
            user: { id: barber.id, name: barber.name, email, role: "barber", barberId: barber.id },
            isAuthenticated: true,
          })
          return true
        }
        return false
      },
      logout: () => set({ user: null, isAuthenticated: false }),

      // Services
      services: initialServices,
      addService: (service) =>
        set((state) => ({
          services: [...state.services, { ...service, id: crypto.randomUUID() }],
        })),
      updateService: (id, service) =>
        set((state) => ({
          services: state.services.map((s) => (s.id === id ? { ...s, ...service } : s)),
        })),
      deleteService: (id) =>
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        })),

      // Barbers
      barbers: initialBarbers,
      addBarber: (barber) =>
        set((state) => ({
          barbers: [...state.barbers, { ...barber, id: crypto.randomUUID() }],
        })),
      updateBarber: (id, barber) =>
        set((state) => ({
          barbers: state.barbers.map((b) => (b.id === id ? { ...b, ...barber } : b)),
        })),
      deleteBarber: (id) =>
        set((state) => ({
          barbers: state.barbers.filter((b) => b.id !== id),
        })),

      // Clients
      clients: initialClients,
      addClient: (client) =>
        set((state) => ({
          clients: [
            ...state.clients,
            {
              ...client,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString().split("T")[0],
              totalVisits: 0,
              totalSpent: 0,
            },
          ],
        })),
      updateClient: (id, client) =>
        set((state) => ({
          clients: state.clients.map((c) => (c.id === id ? { ...c, ...client } : c)),
        })),
      deleteClient: (id) =>
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
        })),

      // Appointments
      appointments: initialAppointments,
      addAppointment: (appointment) =>
        set((state) => ({
          appointments: [
            ...state.appointments,
            {
              ...appointment,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString().split("T")[0],
            },
          ],
        })),
      updateAppointment: (id, appointment) =>
        set((state) => ({
          appointments: state.appointments.map((a) => (a.id === id ? { ...a, ...appointment } : a)),
        })),
      deleteAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
        })),
    }),
    {
      name: "barberpro-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        services: state.services,
        barbers: state.barbers,
        clients: state.clients,
        appointments: state.appointments,
      }),
    },
  ),
)
