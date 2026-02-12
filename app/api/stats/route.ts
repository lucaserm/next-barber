import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "month"

    // Calcular data de início baseado no período
    const now = new Date()
    let startDate = new Date()

    switch (period) {
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "quarter":
        startDate.setMonth(now.getMonth() - 3)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Buscar agendamentos do período
    const appointments = await prisma.appointment.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        service: true,
        barber: {
          include: {
            user: true,
          },
        },
        client: true,
      },
    })

    // Calcular estatísticas
    const completedAppointments = appointments.filter((a) => a.status === "COMPLETED")
    const cancelledAppointments = appointments.filter((a) => a.status === "CANCELLED")

    const totalRevenue = completedAppointments.reduce((sum, a) => sum + a.service.price, 0)
    const totalAppointments = appointments.length
    const completedCount = completedAppointments.length
    const averageTicket = completedCount > 0 ? totalRevenue / completedCount : 0
    const completionRate = totalAppointments > 0 ? (completedCount / totalAppointments) * 100 : 0
    const cancellationRate = totalAppointments > 0 ? (cancelledAppointments.length / totalAppointments) * 100 : 0

    // Receita por barbeiro
    const revenueByBarber = completedAppointments.reduce(
      (acc, a) => {
        const barberName = a.barber.user.name
        if (!acc[barberName]) {
          acc[barberName] = { name: barberName, revenue: 0, count: 0 }
        }
        acc[barberName].revenue += a.service.price
        acc[barberName].count += 1
        return acc
      },
      {} as Record<string, { name: string; revenue: number; count: number }>,
    )

    // Receita por serviço
    const revenueByService = completedAppointments.reduce(
      (acc, a) => {
        const serviceName = a.service.name
        if (!acc[serviceName]) {
          acc[serviceName] = { name: serviceName, revenue: 0, count: 0 }
        }
        acc[serviceName].revenue += a.service.price
        acc[serviceName].count += 1
        return acc
      },
      {} as Record<string, { name: string; revenue: number; count: number }>,
    )

    // Agendamentos por dia da semana
    const weekdayStats = appointments.reduce(
      (acc, a) => {
        const date = new Date(a.createdAt)
        const day = date.getDay() // 0 = Sunday, 1 = Monday, etc.
        const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
        const dayName = dayNames[day]

        if (!acc[dayName]) {
          acc[dayName] = { day: dayName, appointments: 0, revenue: 0 }
        }
        acc[dayName].appointments += 1
        if (a.status === "COMPLETED") {
          acc[dayName].revenue += a.service.price
        }
        return acc
      },
      {} as Record<string, { day: string; appointments: number; revenue: number }>,
    )

    // Agendamentos por horário
    const hourlyStats = completedAppointments.reduce(
      (acc, a) => {
        const hour = a.time.split(":")[0] + ":00"
        if (!acc[hour]) {
          acc[hour] = { hour, appointments: 0 }
        }
        acc[hour].appointments += 1
        return acc
      },
      {} as Record<string, { hour: string; appointments: number }>,
    )

    // Status distribution
    const statusStats = {
      completed: completedCount,
      confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
      pending: appointments.filter((a) => a.status === "PENDING").length,
      cancelled: cancelledAppointments.length,
    }

    // Receita mensal (últimos 6 meses)
    const monthlyRevenue = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

      const monthAppointments = await prisma.appointment.findMany({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
          status: "COMPLETED",
        },
        include: {
          service: true,
        },
      })

      const monthRevenue = monthAppointments.reduce((sum, a) => sum + a.service.price, 0)
      const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

      monthlyRevenue.push({
        month: monthNames[monthStart.getMonth()],
        revenue: monthRevenue,
        appointments: monthAppointments.length,
      })
    }

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalAppointments,
        completedAppointments: completedCount,
        averageTicket,
        completionRate,
        cancellationRate,
      },
      revenueByBarber: Object.values(revenueByBarber),
      revenueByService: Object.values(revenueByService),
      weekdayStats: Object.values(weekdayStats).sort((a, b) => {
        const order = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
        return order.indexOf(a.day) - order.indexOf(b.day)
      }),
      hourlyStats: Object.values(hourlyStats).sort((a, b) => a.hour.localeCompare(b.hour)),
      statusStats,
      monthlyRevenue,
    })
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 })
  }
}
