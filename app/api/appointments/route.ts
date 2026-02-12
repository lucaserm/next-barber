import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatPhone } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const barberId = searchParams.get("barberId");
    const status = searchParams.get("status");

    const where: any = {};

    if (date) where.date = date;
    if (barberId) where.barberId = barberId;
    if (status) where.status = status.toUpperCase();

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        service: true,
        barber: true,
        client: true,
      },
      orderBy: [{ date: "desc" }, { time: "desc" }],
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Erro ao buscar agendamentos" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Se clientPhone foi fornecido, busca ou cria o cliente
    let clientId = data.clientId;

    const formattedPhone = formatPhone(data.clientPhone);
    if (data.clientPhone && !clientId) {
      let client = await prisma.client.findFirst({
        where: { phone: formattedPhone },
      });

      if (!client && data.clientName) {
        client = await prisma.client.create({
          data: {
            name: data.clientName,
            phone: data.clientPhone,
            email: data.clientEmail || "",
          },
        });
      }

      clientId = client?.id;
    }

    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        clientName: data.clientName,
        clientPhone: formattedPhone,
        barberId: data.barberId,
        serviceId: data.serviceId,
        date: data.date,
        time: data.time,
        status: data.status?.toUpperCase() || "PENDING",
        notes: data.notes,
      },
      include: {
        service: true,
        barber: true,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Erro ao criar agendamento" },
      { status: 500 },
    );
  }
}
