"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Clock, DollarSign, Search } from "@/components/icons"
import { useStore } from "@/lib/store"
import { toast } from "sonner"
import type { Service } from "@/lib/types"

function ServicosContent() {
  const { services, addService, updateService, deleteService } = useStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    active: true,
  })

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const openCreateDialog = () => {
    setEditingService(null)
    setFormData({ name: "", description: "", price: "", duration: "", active: true })
    setIsDialogOpen(true)
  }

  const openEditDialog = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      active: service.active,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const serviceData = {
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      duration: Number.parseInt(formData.duration),
      active: formData.active,
    }

    if (editingService) {
      updateService(editingService.id, serviceData)
      toast.success("Serviço atualizado com sucesso!")
    } else {
      addService(serviceData)
      toast.success("Serviço criado com sucesso!")
    }

    setIsDialogOpen(false)
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteService(deleteId)
      toast.success("Serviço removido com sucesso!")
      setDeleteId(null)
    }
  }

  const toggleActive = (service: Service) => {
    updateService(service.id, { active: !service.active })
    toast.success(service.active ? "Serviço desativado" : "Serviço ativado")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Serviços</h1>
          <p className="text-muted-foreground">Gerencie os serviços oferecidos pela barbearia</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar serviços..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <Card key={service.id} className={!service.active ? "opacity-60" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription className="mt-1">{service.description}</CardDescription>
                </div>
                <Badge variant={service.active ? "default" : "secondary"}>{service.active ? "Ativo" : "Inativo"}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-sm">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="font-bold text-lg">R$ {service.price}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {service.duration} min
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => openEditDialog(service)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" onClick={() => toggleActive(service)}>
                  {service.active ? "Desativar" : "Ativar"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => setDeleteId(service.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum serviço encontrado.</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingService ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
            <DialogDescription>
              {editingService ? "Atualize as informações do serviço" : "Adicione um novo serviço à barbearia"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Serviço</Label>
              <Input
                id="name"
                placeholder="Ex: Corte Masculino"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o serviço..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="45.00"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duração (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="5"
                  step="5"
                  placeholder="30"
                  value={formData.duration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="active">Serviço ativo</Label>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, active: checked }))}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editingService ? "Salvar" : "Criar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function ServicosPage() {
  return (
    <Suspense fallback={null}>
      <ServicosContent />
    </Suspense>
  )
}
