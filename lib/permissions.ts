import { prisma } from "./prisma"

export type PermissionType =
  | "VIEW_DASHBOARD"
  | "MANAGE_APPOINTMENTS"
  | "MANAGE_CLIENTS"
  | "MANAGE_SERVICES"
  | "VIEW_FINANCIAL"
  | "VIEW_REPORTS"
  | "MANAGE_BARBERS"
  | "MANAGE_PERMISSIONS"

export async function hasPermission(userId: string, permission: PermissionType): Promise<boolean> {
  // Buscar usuário
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { permissions: true },
  })

  if (!user) {
    return false
  }

  // Admin tem todas as permissões
  if (user.role === "ADMIN") {
    return true
  }

  // Verificar se tem a permissão específica
  return user.permissions.some((p) => p.permission === permission)
}

export async function getUserPermissions(userId: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { permissions: true },
  })

  if (!user) {
    return []
  }

  // Admin tem todas as permissões
  if (user.role === "ADMIN") {
    return [
      "VIEW_DASHBOARD",
      "MANAGE_APPOINTMENTS",
      "MANAGE_CLIENTS",
      "MANAGE_SERVICES",
      "VIEW_FINANCIAL",
      "VIEW_REPORTS",
      "MANAGE_BARBERS",
      "MANAGE_PERMISSIONS",
    ]
  }

  return user.permissions.map((p) => p.permission)
}

export function checkPermission(userPermissions: string[], requiredPermission: PermissionType): boolean {
  return userPermissions.includes(requiredPermission)
}
