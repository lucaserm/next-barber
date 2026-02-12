"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Scissors,
  Home,
  Calendar,
  Users,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  Shield,
  Package,
} from "@/components/icons";
import { useLogout } from "@/lib/hooks/use-api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: Home,
    permission: "VIEW_DASHBOARD",
  },
  {
    label: "Agenda",
    href: "/admin/agenda",
    icon: Calendar,
    permission: "MANAGE_APPOINTMENTS",
  },
  {
    label: "Clientes",
    href: "/admin/clientes",
    icon: Users,
    permission: "MANAGE_CLIENTS",
  },
  {
    label: "Serviços",
    href: "/admin/servicos",
    icon: Scissors,
    permission: "MANAGE_SERVICES",
  },
  {
    label: "Estoque",
    href: "/admin/estoque",
    icon: Package,
    permission: "MANAGE_INVENTORY",
  },
  {
    label: "Financeiro",
    href: "/admin/financeiro",
    icon: DollarSign,
    permission: "VIEW_FINANCIAL",
  },
  {
    label: "Relatórios",
    href: "/admin/relatorios",
    icon: FileText,
    permission: "VIEW_REPORTS",
  },
  {
    label: "Configurações",
    href: "/admin/configuracoes",
    icon: Settings,
    permission: "MANAGE_BARBERS",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);

      // Carregar permissões do usuário
      const userPermissions =
        userData.role === "ADMIN"
          ? [
              "VIEW_DASHBOARD",
              "MANAGE_APPOINTMENTS",
              "MANAGE_CLIENTS",
              "MANAGE_SERVICES",
              "VIEW_FINANCIAL",
              "VIEW_REPORTS",
              "MANAGE_BARBERS",
              "MANAGE_PERMISSIONS",
            ]
          : userData.permissions || [];
      setPermissions(userPermissions);
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/admin" className="flex items-center gap-2">
          <Scissors className="w-6 h-6 text-sidebar-primary" />
          <span className="font-serif text-xl font-bold text-sidebar-foreground">
            Elite67
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          // Verificar se o usuário tem permissão para ver este item
          const hasPermission =
            user?.role === "ADMIN" || permissions.includes(item.permission);
          if (!hasPermission) return null;

          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}

        {/* Permissões (apenas para admin) */}
        {(user?.role === "ADMIN" ||
          permissions.includes("MANAGE_PERMISSIONS")) && (
          <Link
            href="/admin/permissoes"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === "/admin/permissoes"
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Shield className="w-5 h-5" />
            Permissões
          </Link>
        )}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {user?.role === "admin" ? "Administrador" : "Barbeiro"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <Scissors className="w-5 h-5 text-sidebar-primary" />
          <span className="font-serif text-lg font-bold text-sidebar-foreground">
            Elite67
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 pt-14">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 h-full bg-sidebar flex flex-col">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex-col">
        <SidebarContent />
      </aside>
    </>
  );
}
