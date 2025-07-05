/**
 * @fileoverview Tipos para sistema de compras
 * @directory src/types
 * @description Definições de tipos para produtos, grupos e listas de compras
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

export interface ShoppingGroup {
  id: string
  name: string
  description?: string
  icon: string
  color: string
  isActive: boolean
  productCount: number
  totalEstimatedValue: number
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface ShoppingProduct {
  id: string
  name: string
  description?: string
  groupId: string
  group?: ShoppingGroup
  quantity: number
  unit: string
  estimatedPrice: number
  actualPrice?: number
  isPurchased: boolean
  purchasedAt?: Date
  photo?: string
  brand?: string
  store?: string
  notes?: string
  priority: ProductPriority
  tags: string[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}

export type ProductPriority = 
  | 'low'        // Baixa
  | 'medium'     // Média
  | 'high'       // Alta
  | 'urgent'     // Urgente

export interface ShoppingFilter {
  groupId?: string[]
  priority?: ProductPriority[]
  isPurchased?: boolean
  priceRange?: {
    min?: number
    max?: number
  }
  tags?: string[]
  search?: string
}

export interface ShoppingStats {
  totalProducts: number
  purchasedProducts: number
  pendingProducts: number
  totalEstimatedValue: number
  totalActualValue: number
  savings: number
  averagePrice: number
  mostExpensiveGroup: string
}

export interface ProductFormData {
  name: string
  description?: string
  groupId: string
  quantity: number
  unit: string
  estimatedPrice: number
  brand?: string
  store?: string
  notes?: string
  priority: ProductPriority
  tags: string[]
}

export interface GroupFormData {
  name: string
  description?: string
  icon: string
  color: string
} 