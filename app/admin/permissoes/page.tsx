"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, User, CheckCircle, XCircle } from "@/components/icons";
import {
  useBarbers,
  useUserPermissions,
  useAddPermission,
  useRemovePermission,
} from "@/lib/hooks/use-api";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/protected-route";

const PERMISSIONS = [
  {
    key: "VIEW_DASHBOARD",
    label: "Ver Dashboard",
    description: "Visualizar dashboard com estatísticas gerais",
  },
  {
    key: "MANAGE_APPOINTMENTS",
    label: "Gerenciar Agendamentos",
    description: "Criar, editar e cancelar agendamentos",
  },
  {
    key: "MANAGE_CLIENTS",
    label: "Gerenciar Clientes",
    description: "Adicionar, editar e remover clientes",
  },
  {
    key: "MANAGE_SERVICES",
    label: "Gerenciar Serviços",
    description: "Criar, editar e remover serviços",
  },
  {
    key: "VIEW_FINANCIAL",
    label: "Ver Financeiro",
    description: "Visualizar relatórios financeiros",
  },
  {
    key: "VIEW_REPORTS",
    label: "Ver Relatórios",
    description: "Visualizar relatórios gerais",
  },
];

export default function PermissoesPage() {
  return (
    <ProtectedRoute requiredPermission="MANAGE_PERMISSIONS">
      <PermissoesContent />
    </ProtectedRoute>
  );
}

function PermissoesContent() {
  const { data: barbers = [], isLoading } = useBarbers();
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);

  const {
    data: permissions = [],
    isLoading: permissionsLoading,
    refetch: permissionsRefetch,
  } = useUserPermissions(selectedBarber || "");
  const addPermission = useAddPermission();
  const removePermission = useRemovePermission();

  const selectedBarberData = barbers.find((b) => b.id === selectedBarber);

  const hasPermission = (permissionKey: string) => {
    return permissions.some((p) => p.permission === permissionKey);
  };

  const handleSelectBarber = (barberId: string) => {
    permissionsRefetch();
    setSelectedBarber(barberId);
  };

  const togglePermission = async (permissionKey: string) => {
    if (!selectedBarberData?.userId) return;

    const has = hasPermission(permissionKey);

    if (has) {
      await removePermission.mutateAsync(
        { userId: selectedBarberData.userId, permission: permissionKey },
        {
          onSuccess: () => {
            toast.success("Permissão removida com sucesso!");
          },
          onError: () => {
            toast.error("Erro ao remover permissão");
          },
        },
      );
    } else {
      await addPermission.mutateAsync(
        { userId: selectedBarberData.userId, permission: permissionKey },
        {
          onSuccess: () => {
            toast.success("Permissão adicionada com sucesso!");
          },
          onError: () => {
            toast.error("Erro ao adicionar permissão");
          },
        },
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gerenciar Permissões</h1>
        <p className="text-muted-foreground">
          Defina o que cada profissional pode acessar no sistema
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lista de Barbeiros */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profissionais</CardTitle>
            <CardDescription>
              Selecione um profissional para gerenciar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {barbers
                .filter((b) => b.role !== "ADMIN")
                .map((barber) => (
                  <button
                    key={barber.id}
                    onClick={() => handleSelectBarber(barber.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      selectedBarber === barber.id
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-secondary/50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedBarber === barber.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }`}
                    >
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{barber.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {barber.email}
                      </p>
                    </div>
                    {selectedBarber === barber.id && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </button>
                ))}

              {barbers.filter((b) => b.role !== "ADMIN").length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum profissional cadastrado</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Permissões */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Permissões de Acesso
            </CardTitle>
            {selectedBarberData && (
              <CardDescription>
                Configurando acessos para{" "}
                <strong>{selectedBarberData.name}</strong>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {!selectedBarber ? (
              <div className="text-center py-12 text-muted-foreground">
                <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Selecione um profissional para configurar as permissões</p>
              </div>
            ) : permissionsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {PERMISSIONS.map((perm) => {
                  const has = hasPermission(perm.key);

                  return (
                    <div
                      key={perm.key}
                      className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {has ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-muted-foreground" />
                          )}
                          <Label
                            htmlFor={perm.key}
                            className="font-medium cursor-pointer"
                          >
                            {perm.label}
                          </Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {perm.description}
                        </p>
                      </div>
                      <Switch
                        id={perm.key}
                        checked={has}
                        onCheckedChange={() => togglePermission(perm.key)}
                        disabled={
                          addPermission.isPending || removePermission.isPending
                        }
                      />
                    </div>
                  );
                })}

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 p-4 rounded-lg bg-secondary/50">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Permissões Concedidas
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {permissions.length} de {PERMISSIONS.length} disponíveis
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {(
                        (permissions.length / PERMISSIONS.length) *
                        100
                      ).toFixed(0)}
                      %
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Como funciona?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">1</span>
              </div>
              <div>
                <p className="font-medium">Selecione o profissional</p>
                <p className="text-sm text-muted-foreground">
                  Escolha quem você deseja gerenciar
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">2</span>
              </div>
              <div>
                <p className="font-medium">Configure as permissões</p>
                <p className="text-sm text-muted-foreground">
                  Ative ou desative cada acesso
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">3</span>
              </div>
              <div>
                <p className="font-medium">Alterações imediatas</p>
                <p className="text-sm text-muted-foreground">
                  As mudanças entram em vigor instantaneamente
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
