"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, AlertCircle } from "@/components/icons";
import { useLogin } from "@/lib/hooks/use-api";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  // Verificar se usuário já está logado
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        
        if (token && user) {
          const userData = JSON.parse(user);
          redirectFn(userData);
        } else {
          setIsChecking(false);
        }
      } catch (error) {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    login.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          toast.success(`Bem-vindo, ${data.user.name}!`);

          redirectFn(data.user);
        },
        onError: (error) => {
          toast.error(error.message || "E-mail ou senha inválidos");
        },
      },
    );
  };

  const redirectFn = (user) => {
    // Determinar primeira rota disponível baseada nas permissões
    const permissions =
      user.role === "ADMIN"
        ? ["VIEW_DASHBOARD"]
        : user.permissions || [];

    const routePermissions = [
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

    const firstAvailableRoute = routePermissions.find((r) =>
      permissions.includes(r.permission),
    );

    router.push(firstAvailableRoute?.path || "/admin");
  };

  // Mostrar loading enquanto verifica autenticação
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Scissors className="w-8 h-8 text-primary" />
            <span className="font-serif text-2xl font-bold">Elite67</span>
          </Link>
          <CardTitle>Área Administrativa</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o painel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {login.isError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {login.error?.message || "E-mail ou senha inválidos"}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@barberpro.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={login.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={login.isPending}
              />
            </div>

            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-muted text-sm">
            <p className="font-medium mb-2">Credenciais de teste:</p>
            <p className="text-muted-foreground">
              Admin: admin@barberpro.com / admin123
              <br />
              Barbeiro: joao@barberpro.com / barber123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
