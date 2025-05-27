// src/lib/types.ts

/**
 * Shared data types for API and client usage
 */

export interface BudgetItem {
  id: string
  name: string
  type: 'monthly' | 'one-time'
  cost: number
  payment_date: string | null
  created_at: string
}

export interface IdeasItem {
  id: string
  description: string
  price: number | null
  notes: string | null
  created_at: string
}

export interface InventoryItem {
  id: string
  name: string
  type: 'consumable' | 'non-consumable'
  quantity: number | null
  state: string | null
  replacement_date: string | null
  created_at: string
}

export interface MovieGameItem {
  id: string
  name: string
  type: 'VHS' | 'DVD' | 'Game'
  players: string | null
  created_at: string
}

export interface NeedsItem {
  id: string
  description: string
  price: number | null
  quantity: number
  created_at: string
}

export interface ToolItem {
  id: string
  name: string
  quantity: number
  electric: boolean
  consumable: boolean
  created_at: string
}
