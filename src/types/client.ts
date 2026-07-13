export interface Client {
  id: string
  name: string
  phone: string
  city: string
  email?: string
  notes?: string
  createdAt: string
  deletedAt?: string | null
}
