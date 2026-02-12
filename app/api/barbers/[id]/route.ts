import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const barber = await prisma.barber.findUnique({
      where: { id },
    })

    if (!barber) {
      return NextResponse.json({ error: "Barbeiro não encontrado" }, { status: 404 })
    }

    return NextResponse.json(barber)
  } catch (error) {
    console.error("Error fetching barber:", error)
    return NextResponse.json({ error: "Erro ao buscar barbeiro" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()

    const barber = await prisma.barber.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        avatar: data.avatar,
        specialties: data.specialties,
        active: data.active,
      },
    })

    return NextResponse.json(barber)
  } catch (error) {
    console.error("Error updating barber:", error)
    return NextResponse.json({ error: "Erro ao atualizar barbeiro" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await prisma.barber.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting barber:", error)
    return NextResponse.json({ error: "Erro ao deletar barbeiro" }, { status: 500 })
  }
}
