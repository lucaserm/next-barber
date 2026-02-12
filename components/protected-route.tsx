"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

type PermissionType =
  | "VIEW_DASHBOARD"
  | "MANAGE_APPOINTMENTS"
  | "MANAGE_CLIENTS"
  | "MANAGE_SERVICES"
  | "VIEW_FINANCIAL"
  | "VIEW_REPORTS"
  | "MANAGE_BARBERS"
  | "MANAGE_PERMISSIONS";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: PermissionType;
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requireAuth = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");

        if (requireAuth && !token) {
          router.push("/admin/login");
          return;
        }

        if (!userStr) {
          if (requireAuth) {
            router.push("/admin/login");
          }
          return;
        }

        const user = JSON.parse(userStr);

        // Admin sempre tem acesso
        if (user.role === "admin") {
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        // Se não precisa de permissão específica, apenas autenticação
        if (!requiredPermission) {
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        // Verificar permissões do usuário
        const permissions = user.permissions || [];

        if (permissions.includes(requiredPermission)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao verificar autorização:", error);
        if (requireAuth) {
          router.push("/admin/login");
        }
      }
    };

    checkAuth();
  }, [router, requiredPermission, requireAuth]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-light">
        <div className="max-w-md rounded-lg bg-secondary p-8 text-center shadow-lg">
          <AlertCircle className="mx-auto h-16 w-16 text-destructive" />
          <h1 className="mt-4 text-2xl font-bold text-destructive-foreground">
            Acesso Negado
          </h1>
          <p className="mt-2 text-foreground">
            Você não tem permissão para acessar esta página. Entre em contato
            com o administrador do sistema.
          </p>
          <button
            onClick={() => router.push("/admin")}
            className="mt-6 rounded-lg bg-destructive px-6 py-2 text-destructive-foreground hover:cursor-pointer"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook para verificar permissões específicas
export function usePermission(permission: PermissionType): boolean {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setHasPermission(false);
      return;
    }

    try {
      const user = JSON.parse(userStr);

      // Admin sempre tem permissão
      if (user.role === "admin") {
        setHasPermission(true);
        return;
      }

      // Verificar permissões
      const permissions = user.permissions || [];
      setHasPermission(permissions.includes(permission));
    } catch (error) {
      console.error("Erro ao verificar permissão:", error);
      setHasPermission(false);
    }
  }, [permission]);

  return hasPermission;
}

// Hook para verificar se é admin
export function useIsAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setIsAdmin(false);
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setIsAdmin(user.role === "admin");
    } catch (error) {
      console.error("Erro ao verificar role:", error);
      setIsAdmin(false);
    }
  }, []);

  return isAdmin;
}
