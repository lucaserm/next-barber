import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/stock-movements - List all stock movements
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const type = searchParams.get("type");

    const where: any = {};

    if (productId) {
      where.productId = productId;
    }

    if (type) {
      where.type = type;
    }

    const movements = await prisma.stockMovement.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    return NextResponse.json(movements);
  } catch (error: any) {
    console.error("Error fetching stock movements:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock movements" },
      { status: 500 }
    );
  }
}

// POST /api/stock-movements - Create new stock movement
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, type, quantity, reason, notes, userId } = body;

    // Validações
    if (!productId || !type || !quantity || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be greater than 0" },
        { status: 400 }
      );
    }

    // Buscar produto atual
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Calcular novo estoque
    const newStock =
      type === "IN"
        ? product.currentStock + quantity
        : product.currentStock - quantity;

    if (newStock < 0) {
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 }
      );
    }

    // Criar movimentação e atualizar estoque em uma transação
    const [movement] = await prisma.$transaction([
      prisma.stockMovement.create({
        data: {
          productId,
          type,
          quantity,
          reason,
          notes,
          userId,
        },
        include: {
          product: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.product.update({
        where: { id: productId },
        data: {
          currentStock: newStock,
        },
      }),
    ]);

    return NextResponse.json(movement, { status: 201 });
  } catch (error: any) {
    console.error("Error creating stock movement:", error);
    return NextResponse.json(
      { error: "Failed to create stock movement" },
      { status: 500 }
    );
  }
}
