"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Settings,
  Users,
  Bell,
  Clock,
  Plus,
  Edit,
  Trash2,
} from "@/components/icons";
import {
  useBarbers,
  useCreateBarber,
  useUpdateBarber,
  useDeleteBarber,
} from "@/lib/hooks/use-api";
import { toast } from "sonner";

export default function ConfiguracoesPage() {
  const { data: barbers = [], isLoading } = useBarbers();
  const createBarber = useCreateBarber();
  const updateBarber = useUpdateBarber();
  const deleteBarber = useDeleteBarber();

  const [isBarberDialogOpen, setIsBarberDialogOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState<any | null>(null);
  const [barberForm, setBarberForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialties: "",
    active: true,
  });

  const [businessSettings, setBusinessSettings] = useState({
    name: "Elite67",
    address: "Rua dos Barbeiros, 123 - Centro, São Paulo/SP",
    phone: "(11) 99999-9999",
    email: "contato@barberpro.com",
    openTime: "09:00",
    closeTime: "20:00",
    saturdayClose: "18:00",
    workSunday: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailConfirmation: true,
    smsReminder: true,
    reminderHours: "2",
    newAppointmentAlert: true,
    dailySummary: true,
  });

  const openBarberDialog = (barber?: any) => {
    if (barber) {
      setEditingBarber(barber);
      setBarberForm({
        name: barber.name,
        email: barber.email,
        phone: barber.phone,
        specialties: barber.specialties.join(", "),
        active: barber.active,
      });
    } else {
      setEditingBarber(null);
      setBarberForm({
        name: "",
        email: "",
        phone: "",
        specialties: "",
        active: true,
      });
    }
    setIsBarberDialogOpen(true);
  };

  const handleBarberSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const barberData = {
      name: barberForm.name,
      email: barberForm.email,
      phone: barberForm.phone,
      specialties: barberForm.specialties.split(",").map((s) => s.trim()),
      active: barberForm.active,
    };

    if (editingBarber) {
      updateBarber.mutate(
        { id: editingBarber.id, data: barberData },
        {
          onSuccess: () => {
            toast.success("Barbeiro atualizado!");
            setIsBarberDialogOpen(false);
          },
          onError: (error) => {
            toast.error(`Erro: ${error.message}`);
          },
        },
      );
    } else {
      createBarber.mutate(barberData, {
        onSuccess: () => {
          toast.success("Barbeiro adicionado!");
          setIsBarberDialogOpen(false);
        },
        onError: (error) => {
          toast.error(`Erro: ${error.message}`);
        },
      });
    }
  };

  const handleSaveBusinessSettings = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  const handleSaveNotificationSettings = () => {
    toast.success("Configurações de notificação salvas!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua barbearia
        </p>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList>
          <TabsTrigger value="business">
            <Settings className="w-4 h-4 mr-2" />
            Negócio
          </TabsTrigger>
          <TabsTrigger value="barbers">
            <Users className="w-4 h-4 mr-2" />
            Barbeiros
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="hours">
            <Clock className="w-4 h-4 mr-2" />
            Horários
          </TabsTrigger>
        </TabsList>

        {/* Business Settings */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Negócio</CardTitle>
              <CardDescription>Dados básicos da sua barbearia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nome da Barbearia</Label>
                  <Input
                    id="businessName"
                    value={businessSettings.name}
                    onChange={(e) =>
                      setBusinessSettings((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Telefone</Label>
                  <Input
                    id="businessPhone"
                    value={businessSettings.phone}
                    onChange={(e) =>
                      setBusinessSettings((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessEmail">E-mail</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  value={businessSettings.email}
                  onChange={(e) =>
                    setBusinessSettings((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Endereço</Label>
                <Textarea
                  id="businessAddress"
                  value={businessSettings.address}
                  onChange={(e) =>
                    setBusinessSettings((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  rows={2}
                />
              </div>

              <Button onClick={handleSaveBusinessSettings}>
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Barbers */}
        <TabsContent value="barbers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Equipe de Barbeiros</CardTitle>
                <CardDescription>
                  Gerencie os profissionais da barbearia
                </CardDescription>
              </div>
              <Button onClick={() => openBarberDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {barbers.map((barber) => (
                  <div
                    key={barber.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={barber.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {barber.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{barber.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {barber.email}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {barber.specialties.map((s) => (
                            <Badge
                              key={s}
                              variant="secondary"
                              className="text-xs"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={barber.active ? "default" : "secondary"}>
                        {barber.active ? "Ativo" : "Inativo"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openBarberDialog(barber)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => {
                          deleteBarber.mutate(barber.id);
                          toast.success("Barbeiro removido");
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configure lembretes e alertas automáticos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Confirmação por E-mail</p>
                  <p className="text-sm text-muted-foreground">
                    Enviar e-mail de confirmação ao cliente
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailConfirmation}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      emailConfirmation: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Lembrete por SMS/WhatsApp</p>
                  <p className="text-sm text-muted-foreground">
                    Enviar lembrete antes do agendamento
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.smsReminder}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      smsReminder: checked,
                    }))
                  }
                />
              </div>

              {notificationSettings.smsReminder && (
                <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                  <Label>Enviar lembrete</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      className="w-20"
                      value={notificationSettings.reminderHours}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          reminderHours: e.target.value,
                        }))
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      horas antes do agendamento
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alerta de Novo Agendamento</p>
                  <p className="text-sm text-muted-foreground">
                    Notificar quando houver novo agendamento
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.newAppointmentAlert}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      newAppointmentAlert: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Resumo Diário</p>
                  <p className="text-sm text-muted-foreground">
                    Receber resumo dos agendamentos do dia
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.dailySummary}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      dailySummary: checked,
                    }))
                  }
                />
              </div>

              <Button onClick={handleSaveNotificationSettings}>
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hours */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Horário de Funcionamento</CardTitle>
              <CardDescription>
                Configure os horários de atendimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Abertura (Seg-Sex)</Label>
                  <Input
                    type="time"
                    value={businessSettings.openTime}
                    onChange={(e) =>
                      setBusinessSettings((prev) => ({
                        ...prev,
                        openTime: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fechamento (Seg-Sex)</Label>
                  <Input
                    type="time"
                    value={businessSettings.closeTime}
                    onChange={(e) =>
                      setBusinessSettings((prev) => ({
                        ...prev,
                        closeTime: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fechamento aos Sábados</Label>
                <Input
                  type="time"
                  value={businessSettings.saturdayClose}
                  onChange={(e) =>
                    setBusinessSettings((prev) => ({
                      ...prev,
                      saturdayClose: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Funcionar aos Domingos</p>
                  <p className="text-sm text-muted-foreground">
                    Habilitar agendamentos no domingo
                  </p>
                </div>
                <Switch
                  checked={businessSettings.workSunday}
                  onCheckedChange={(checked) =>
                    setBusinessSettings((prev) => ({
                      ...prev,
                      workSunday: checked,
                    }))
                  }
                />
              </div>

              <Button onClick={handleSaveBusinessSettings}>
                Salvar Horários
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Barber Dialog */}
      <Dialog open={isBarberDialogOpen} onOpenChange={setIsBarberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBarber ? "Editar Barbeiro" : "Novo Barbeiro"}
            </DialogTitle>
            <DialogDescription>
              {editingBarber
                ? "Atualize as informações do profissional"
                : "Adicione um novo profissional à equipe"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBarberSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input
                value={barberForm.name}
                onChange={(e) =>
                  setBarberForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={barberForm.email}
                  onChange={(e) =>
                    setBarberForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={barberForm.phone}
                  onChange={(e) =>
                    setBarberForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Especialidades (separadas por vírgula)</Label>
              <Input
                placeholder="Corte Degradê, Barba, etc."
                value={barberForm.specialties}
                onChange={(e) =>
                  setBarberForm((prev) => ({
                    ...prev,
                    specialties: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Barbeiro ativo</Label>
              <Switch
                checked={barberForm.active}
                onCheckedChange={(checked) =>
                  setBarberForm((prev) => ({ ...prev, active: checked }))
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsBarberDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingBarber ? "Salvar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
