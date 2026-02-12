"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../api";
import type { AppointmentFilters } from "../api";

// ============= AUTENTICAÇÃO =============

export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.login(email, password),
    onSuccess: (data) => {
      // Salvar token no localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Salvar token em cookie para o middleware
      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
    },
  });
}

export function useLogout() {
  return () => {
    // Limpar localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Limpar cookie
    document.cookie = "token=; path=/; max-age=0";

    // Redirecionar para login
    window.location.href = "/admin/login";
  };
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      password: string;
      role?: string;
    }) => api.register(data),
  });
}

// ============= SERVIÇOS =============

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: api.getServices,
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: ["services", id],
    queryFn: () => api.getService(id),
    enabled: !!id,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

// ============= BARBEIROS =============

export function useBarbers() {
  return useQuery({
    queryKey: ["barbers"],
    queryFn: api.getBarbers,
  });
}

export function useBarber(id: string) {
  return useQuery({
    queryKey: ["barbers", id],
    queryFn: () => api.getBarber(id),
    enabled: !!id,
  });
}

export function useCreateBarber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createBarber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barbers"] });
    },
  });
}

export function useUpdateBarber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateBarber(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barbers"] });
    },
  });
}

export function useDeleteBarber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteBarber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barbers"] });
    },
  });
}

// ============= CLIENTES =============

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: api.getClients,
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => api.getClient(id),
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

// ============= AGENDAMENTOS =============

export function useAppointments(filters?: AppointmentFilters) {
  return useQuery({
    queryKey: ["appointments", filters],
    queryFn: () => api.getAppointments(filters),
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ["appointments", id],
    queryFn: () => api.getAppointment(id),
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

// ============= ESTATÍSTICAS =============

export function useStats(period: string = "month") {
  return useQuery({
    queryKey: ["stats", period],
    queryFn: () => api.getStats(period),
  });
}

// ============= PERMISSÕES =============

export function useUserPermissions(userId: string) {
  return useQuery({
    queryKey: ["permissions", userId],
    queryFn: () => api.getUserPermissions(userId),
    enabled: !!userId,
  });
}

export function useAddPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      permission,
    }: {
      userId: string;
      permission: string;
    }) => api.addPermission(userId, permission),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["permissions", variables.userId],
      });
    },
  });
}

export function useRemovePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      permission,
    }: {
      userId: string;
      permission: string;
    }) => api.removePermission(userId, permission),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["permissions", variables.userId],
      });
    },
  });
}

// ============= INVENTÁRIO - PRODUTOS =============

export function useProducts(filters?: {
  categoryId?: string;
  type?: string;
  lowStock?: boolean;
  active?: boolean;
}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters?.categoryId) params.append("categoryId", filters.categoryId);
      if (filters?.type) params.append("type", filters.type);
      if (filters?.lowStock) params.append("lowStock", "true");
      if (filters?.active !== undefined)
        params.append("active", String(filters.active));
      return api.getProducts(params.toString());
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => api.getProduct(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ============= INVENTÁRIO - CATEGORIAS =============

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: api.getCategories,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => api.getCategory(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

// ============= INVENTÁRIO - MOVIMENTAÇÕES =============

export function useStockMovements(filters?: { productId?: string; type?: string }) {
  return useQuery({
    queryKey: ["stock-movements", filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters?.productId) params.append("productId", filters.productId);
      if (filters?.type) params.append("type", filters.type);
      return api.getStockMovements(params.toString());
    },
  });
}

export function useCreateStockMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createStockMovement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ============= INVENTÁRIO - FORNECEDORES =============

export function useSuppliers() {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: api.getSuppliers,
  });
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: ["suppliers", id],
    queryFn: () => api.getSupplier(id),
    enabled: !!id,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateSupplier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}
