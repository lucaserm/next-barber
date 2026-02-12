import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

// GET /api/products - List all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const type = searchParams.get("type");
    const lowStock = searchParams.get("lowStock") === "true";
    const active = searchParams.get("active");

    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (type) {
      where.type = type;
    }

    if (lowStock) {
      where.currentStock = {
        lte: prisma.raw("min_stock"),
      };
    }

    if (active !== null && active !== undefined) {
      where.active = active === "true";
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        supplier: true,
        _count: {
          select: {
            stockMovements: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      sku,
      categoryId,
      currentStock,
      minStock,
      unitCost,
      salePrice,
      type,
      supplierId,
      active,
    } = body;

    // Validações
    if (!name) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        sku,
        categoryId,
        currentStock: currentStock || 0,
        minStock: minStock || 0,
        unitCost: unitCost || 0,
        salePrice,
        type: type || "BOTH",
        supplierId,
        active: active !== false,
      },
      include: {
        category: true,
        supplier: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
