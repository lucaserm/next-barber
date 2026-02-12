"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type RoutePermission = {
  path: string;
  permission: string;
};

const routePermissions: RoutePermission[] = [
  { path: "/admin", permission: "VIEW_DASHBOARD" },
  { path: "/admin/agenda", permission: "MANAGE_APPOINTMENTS" },
  { path: "/admin/clientes", permission: "MANAGE_CLIENTS" },
  { path: "/admin/servicos", permission: "MANAGE_SERVICES" },
  { path: "/admin/estoque", permission: "MANAGE_INVENTORY" },
  { path: "/admin/financeiro", permission: "VIEW_FINANCIAL" },
  { path: "/admin/relatorios", permission: "VIEW_REPORTS" },
  { path: "/admin/configuracoes", permission: "MANAGE_BARBERS" },
  { path: "/admin/permissoes", permission: "MANAGE_PERMISSIONS" },
];

export function usePermissions() {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  useEffect(() => {
    // Ignorar verificação na página de login
    if (pathname === "/admin/login") {
      setIsChecking(false);
      return;
    }

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/admin/login");
      return;
    }

    const user = JSON.parse(userStr);
    
    // Admin tem todas as permissões
    const permissions = user.role === "ADMIN"
      ? [
          "VIEW_DASHBOARD",
          "MANAGE_APPOINTMENTS",
          "MANAGE_CLIENTS",
          "MANAGE_SERVICES",
          "MANAGE_INVENTORY",
          "VIEW_FINANCIAL",
          "VIEW_REPORTS",
          "MANAGE_BARBERS",
          "MANAGE_PERMISSIONS",
        ]
      : user.permissions || [];

    setUserPermissions(permissions);

    // Verificar se tem permissão para a rota atual
    const currentRoute = routePermissions.find((r) => pathname === r.path);
    
    if (currentRoute && !permissions.includes(currentRoute.permission)) {
      // Redirecionar para a primeira página com permissão
      const firstAvailableRoute = routePermissions.find((r) =>
        permissions.includes(r.permission)
      );

      if (firstAvailableRoute) {
        router.push(firstAvailableRoute.path);
      } else {
        // Se não tem nenhuma permissão, redireciona para login
        router.push("/admin/login");
      }
    }

    setIsChecking(false);
  }, [pathname, router]);

  const hasPermission = (permission: string) => {
    return userPermissions.includes(permission);
  };

  const getFirstAvailableRoute = () => {
    const route = routePermissions.find((r) =>
      userPermissions.includes(r.permission)
    );
    return route?.path || "/admin/login";
  };

  return {
    isChecking,
    userPermissions,
    hasPermission,
    getFirstAvailableRoute,
  };
}
