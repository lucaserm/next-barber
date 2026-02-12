import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/suppliers/[id] - Get supplier by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: params.id },
      include: {
        products: true,
      },
    });

    if (!supplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(supplier);
  } catch (error: any) {
    console.error("Error fetching supplier:", error);
    return NextResponse.json(
      { error: "Failed to fetch supplier" },
      { status: 500 }
    );
  }
}

// PUT /api/suppliers/[id] - Update supplier
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, contact, phone, email, active } = body;

    const supplier = await prisma.supplier.update({
      where: { id: params.id },
      data: {
        name,
        contact,
        phone,
        email,
        active,
      },
    });

    return NextResponse.json(supplier);
  } catch (error: any) {
    console.error("Error updating supplier:", error);
    return NextResponse.json(
      { error: "Failed to update supplier" },
      { status: 500 }
    );
  }
}

// DELETE /api/suppliers/[id] - Delete supplier
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.supplier.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting supplier:", error);
    return NextResponse.json(
      { error: "Failed to delete supplier" },
      { status: 500 }
    );
  }
}
