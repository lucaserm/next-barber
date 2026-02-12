import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/suppliers - List all suppliers
export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(suppliers);
  } catch (error: any) {
    console.error("Error fetching suppliers:", error);
    return NextResponse.json(
      { error: "Failed to fetch suppliers" },
      { status: 500 }
    );
  }
}

// POST /api/suppliers - Create new supplier
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, contact, phone, email, active } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Supplier name is required" },
        { status: 400 }
      );
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        contact,
        phone,
        email,
        active: active !== false,
      },
    });

    return NextResponse.json(supplier, { status: 201 });
  } catch (error: any) {
    console.error("Error creating supplier:", error);
    return NextResponse.json(
      { error: "Failed to create supplier" },
      { status: 500 }
    );
  }
}
