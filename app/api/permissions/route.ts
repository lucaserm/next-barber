import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Listar permissões de um usuário
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 },
      );
    }

    const permissions = await prisma.permission.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        userId: true,
        permission: true,
        createdAt: true,
      },
    });

    return NextResponse.json(permissions);
  } catch (error) {
    console.error("Erro ao buscar permissões:", error);
    return NextResponse.json(
      { error: "Erro ao buscar permissões" },
      { status: 500 },
    );
  }
}

// POST - Adicionar permissão a um usuário
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, permission } = body;

    if (!userId || !permission) {
      return NextResponse.json(
        { error: "userId e permission são obrigatórios" },
        { status: 400 },
      );
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    // Admin sempre tem todas as permissões
    if (user.role === "ADMIN") {
      return NextResponse.json(
        { error: "Admin já tem todas as permissões" },
        { status: 400 },
      );
    }

    // Criar permissão
    const newPermission = await prisma.permission.create({
      data: {
        userId,
        permission,
      },
    });

    return NextResponse.json(newPermission, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar permissão:", error);

    // Se já existe
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Permissão já existe para este usuário" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Erro ao criar permissão" },
      { status: 500 },
    );
  }
}

// DELETE - Remover permissão de um usuário
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const permission = searchParams.get("permission");

    if (!userId || !permission) {
      return NextResponse.json(
        { error: "userId e permission são obrigatórios" },
        { status: 400 },
      );
    }

    await prisma.permission.deleteMany({
      where: {
        userId,
        permission: permission as any,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao remover permissão:", error);
    return NextResponse.json(
      { error: "Erro ao remover permissão" },
      { status: 500 },
    );
  }
}
