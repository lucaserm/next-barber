const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Helper para incluir token nas requisições
function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Erro desconhecido" }))
    throw new Error(error.error || `Erro ${response.status}`)
  }

  return response.json()
}

// ============= AUTENTICAÇÃO =============

export interface LoginResponse {
  user: {
    id: string
    name: string
    email: string
    role: string
    barberId?: string | null
  }
  token: string
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return fetchWithAuth(`${API_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function register(data: { name: string; email: string; password: string; role?: string }) {
  return fetchWithAuth(`${API_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// ============= SERVIÇOS =============

export async function getServices() {
  return fetchWithAuth(`${API_URL}/services`)
}

export async function getService(id: string) {
  return fetchWithAuth(`${API_URL}/services/${id}`)
}

export async function createService(data: any) {
  return fetchWithAuth(`${API_URL}/services`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateService(id: string, data: any) {
  return fetchWithAuth(`${API_URL}/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteService(id: string) {
  return fetchWithAuth(`${API_URL}/services/${id}`, {
    method: "DELETE",
  })
}

// ============= BARBEIROS =============

export async function getBarbers() {
  return fetchWithAuth(`${API_URL}/barbers`)
}

export async function getBarber(id: string) {
  return fetchWithAuth(`${API_URL}/barbers/${id}`)
}

export async function createBarber(data: any) {
  return fetchWithAuth(`${API_URL}/barbers`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateBarber(id: string, data: any) {
  return fetchWithAuth(`${API_URL}/barbers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteBarber(id: string) {
  return fetchWithAuth(`${API_URL}/barbers/${id}`, {
    method: "DELETE",
  })
}

// ============= CLIENTES =============

export async function getClients() {
  return fetchWithAuth(`${API_URL}/clients`)
}

export async function getClient(id: string) {
  return fetchWithAuth(`${API_URL}/clients/${id}`)
}

export async function createClient(data: any) {
  return fetchWithAuth(`${API_URL}/clients`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateClient(id: string, data: any) {
  return fetchWithAuth(`${API_URL}/clients/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteClient(id: string) {
  return fetchWithAuth(`${API_URL}/clients/${id}`, {
    method: "DELETE",
  })
}

// ============= AGENDAMENTOS =============

export interface AppointmentFilters {
  date?: string
  barberId?: string
  status?: string
}

export async function getAppointments(filters?: AppointmentFilters) {
  const params = new URLSearchParams(filters as any)
  const queryString = params.toString()
  return fetchWithAuth(`${API_URL}/appointments${queryString ? `?${queryString}` : ""}`)
}

export async function getAppointment(id: string) {
  return fetchWithAuth(`${API_URL}/appointments/${id}`)
}

export async function createAppointment(data: any) {
  return fetchWithAuth(`${API_URL}/appointments`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateAppointment(id: string, data: any) {
  return fetchWithAuth(`${API_URL}/appointments/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteAppointment(id: string) {
  return fetchWithAuth(`${API_URL}/appointments/${id}`, {
    method: "DELETE",
  })
}

// ============= ESTATÍSTICAS =============

export interface Stats {
  summary: {
    totalRevenue: number
    totalAppointments: number
    completedAppointments: number
    averageTicket: number
    completionRate: number
    cancellationRate: number
  }
  revenueByBarber: Array<{ name: string; revenue: number; count: number }>
  revenueByService: Array<{ name: string; revenue: number; count: number }>
  weekdayStats: Array<{ day: string; appointments: number; revenue: number }>
  hourlyStats: Array<{ hour: string; appointments: number }>
  statusStats: {
    completed: number
    confirmed: number
    pending: number
    cancelled: number
  }
  monthlyRevenue: Array<{ month: string; revenue: number; appointments: number }>
}

export async function getStats(period: string = "month"): Promise<Stats> {
  return fetchWithAuth(`${API_URL}/stats?period=${period}`)
}

// ============= PERMISSÕES =============

export interface Permission {
  id: string
  permission: string
  createdAt: string
}

export async function getUserPermissions(userId: string): Promise<Permission[]> {
  return fetchWithAuth(`${API_URL}/permissions?userId=${userId}`)
}

export async function addPermission(userId: string, permission: string) {
  return fetchWithAuth(`${API_URL}/permissions`, {
    method: "POST",
    body: JSON.stringify({ userId, permission }),
  })
}

export async function removePermission(userId: string, permission: string) {
  return fetchWithAuth(`${API_URL}/permissions?userId=${userId}&permission=${permission}`, {
    method: "DELETE",
  })
}

// ============= INVENTÁRIO - PRODUTOS =============

export interface Product {
  id: string
  name: string
  description?: string
  sku?: string
  categoryId?: string
  category?: Category
  currentStock: number
  minStock: number
  unitCost: number
  salePrice?: number
  type: "SALE" | "INTERNAL" | "BOTH"
  supplierId?: string
  supplier?: Supplier
  active: boolean
  createdAt: string
  updatedAt: string
}

export async function getProducts(params?: string): Promise<Product[]> {
  const url = params ? `${API_URL}/products?${params}` : `${API_URL}/products`
  return fetchWithAuth(url)
}

export async function getProduct(id: string): Promise<Product> {
  return fetchWithAuth(`${API_URL}/products/${id}`)
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  return fetchWithAuth(`${API_URL}/products`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  return fetchWithAuth(`${API_URL}/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteProduct(id: string): Promise<void> {
  return fetchWithAuth(`${API_URL}/products/${id}`, {
    method: "DELETE",
  })
}

// ============= INVENTÁRIO - CATEGORIAS =============

export interface Category {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  _count?: {
    products: number
  }
}

export async function getCategories(): Promise<Category[]> {
  return fetchWithAuth(`${API_URL}/categories`)
}

export async function getCategory(id: string): Promise<Category> {
  return fetchWithAuth(`${API_URL}/categories/${id}`)
}

export async function createCategory(data: Partial<Category>): Promise<Category> {
  return fetchWithAuth(`${API_URL}/categories`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category> {
  return fetchWithAuth(`${API_URL}/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteCategory(id: string): Promise<void> {
  return fetchWithAuth(`${API_URL}/categories/${id}`, {
    method: "DELETE",
  })
}

// ============= INVENTÁRIO - MOVIMENTAÇÕES =============

export interface StockMovement {
  id: string
  productId: string
  product: {
    id: string
    name: string
    sku?: string
  }
  type: "IN" | "OUT"
  quantity: number
  reason?: string
  notes?: string
  userId: string
  user: {
    id: string
    name: string
  }
  createdAt: string
}

export async function getStockMovements(params?: string): Promise<StockMovement[]> {
  const url = params ? `${API_URL}/stock-movements?${params}` : `${API_URL}/stock-movements`
  return fetchWithAuth(url)
}

export async function createStockMovement(data: {
  productId: string
  type: "IN" | "OUT"
  quantity: number
  reason?: string
  notes?: string
  userId: string
}): Promise<StockMovement> {
  return fetchWithAuth(`${API_URL}/stock-movements`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// ============= INVENTÁRIO - FORNECEDORES =============

export interface Supplier {
  id: string
  name: string
  contact?: string
  phone?: string
  email?: string
  active: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    products: number
  }
}

export async function getSuppliers(): Promise<Supplier[]> {
  return fetchWithAuth(`${API_URL}/suppliers`)
}

export async function getSupplier(id: string): Promise<Supplier> {
  return fetchWithAuth(`${API_URL}/suppliers/${id}`)
}

export async function createSupplier(data: Partial<Supplier>): Promise<Supplier> {
  return fetchWithAuth(`${API_URL}/suppliers`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateSupplier(id: string, data: Partial<Supplier>): Promise<Supplier> {
  return fetchWithAuth(`${API_URL}/suppliers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteSupplier(id: string): Promise<void> {
  return fetchWithAuth(`${API_URL}/suppliers/${id}`, {
    method: "DELETE",
  })
}
