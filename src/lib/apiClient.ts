// src/lib/apiClient.ts
import {
  BudgetItem,
  IdeasItem,
  InventoryItem,
  MovieGameItem,
  NeedsItem,
  ToolItem,
} from '@/lib/types'

const BASE = '/api'

/** -------- BUDGET ITEMS -------- */
export async function getBudgetItems(): Promise<BudgetItem[]> {
  const res = await fetch(`${BASE}/budget_items`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function createBudgetItem(
  data: Omit<BudgetItem, 'id' | 'created_at'>
): Promise<{ id: string }> {
  const res = await fetch(`${BASE}/budget_items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function updateBudgetItem(
  id: string,
  data: Partial<Omit<BudgetItem, 'id' | 'created_at'>>
): Promise<void> {
  const res = await fetch(`${BASE}/budget_items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
}

export async function deleteBudgetItem(id: string): Promise<void> {
  const res = await fetch(`${BASE}/budget_items/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(await res.text())
}

/** -------- IDEAS ITEMS -------- */
export async function getIdeasItems(): Promise<IdeasItem[]> {
  const res = await fetch(`${BASE}/ideas_items`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function createIdeasItem(
  data: Omit<IdeasItem, 'id' | 'created_at'>
): Promise<{ id: string }> {
  const res = await fetch(`${BASE}/ideas_items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function updateIdeasItem(
  id: string,
  data: Partial<Omit<IdeasItem, 'id' | 'created_at'>>
): Promise<void> {
  const res = await fetch(`${BASE}/ideas_items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
}

export async function deleteIdeasItem(id: string): Promise<void> {
  const res = await fetch(`${BASE}/ideas_items/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(await res.text())
}

/** -------- INVENTORY ITEMS -------- */
export async function getInventoryItems(): Promise<InventoryItem[]> {
  const res = await fetch(`${BASE}/inventory_items`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function createInventoryItem(
  data: Omit<InventoryItem, 'id' | 'created_at'>
): Promise<{ id: string }> {
  const res = await fetch(`${BASE}/inventory_items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function updateInventoryItem(
  id: string,
  data: Partial<Omit<InventoryItem, 'id' | 'created_at'>>
): Promise<void> {
  const res = await fetch(`${BASE}/inventory_items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
}

export async function deleteInventoryItem(id: string): Promise<void> {
  const res = await fetch(`${BASE}/inventory_items/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(await res.text())
}

/** -------- MOVIES & GAMES -------- */
export async function getMovieGameItems(): Promise<MovieGameItem[]> {
  const res = await fetch(`${BASE}/movies_games`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function createMovieGameItem(
  data: Omit<MovieGameItem, 'id' | 'created_at'>
): Promise<MovieGameItem & { id: string }> {
  const res = await fetch(`${BASE}/movies_games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function updateMovieGameItem(
  id: string,
  data: Partial<Omit<MovieGameItem, 'id' | 'created_at'>>
): Promise<void> {
  const res = await fetch(`${BASE}/movies_games/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
}

export async function deleteMovieGameItem(id: string): Promise<void> {
  const res = await fetch(`${BASE}/movies_games/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(await res.text())
}

/** -------- NEEDS ITEMS -------- */
export async function getNeedsItems(): Promise<NeedsItem[]> {
  const res = await fetch(`${BASE}/needs_items`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function createNeedsItem(
  data: Omit<NeedsItem, 'id' | 'created_at'>
): Promise<{ id: string }> {
  const res = await fetch(`${BASE}/needs_items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function updateNeedsItem(
  id: string,
  data: Partial<Omit<NeedsItem, 'id' | 'created_at'>>
): Promise<void> {
  const res = await fetch(`${BASE}/needs_items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
}

export async function deleteNeedsItem(id: string): Promise<void> {
  const res = await fetch(`${BASE}/needs_items/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(await res.text())
}

/** -------- TOOLS ITEMS -------- */
export async function getToolItems(): Promise<ToolItem[]> {
  const res = await fetch(`${BASE}/tools`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function createToolItem(
  data: Omit<ToolItem, 'id' | 'created_at'>
): Promise<{ id: string }> {
  const res = await fetch(`${BASE}/tools`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function updateToolItem(
  id: string,
  data: Partial<Omit<ToolItem, 'id' | 'created_at'>>
): Promise<void> {
  const res = await fetch(`${BASE}/tools/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
}

export async function deleteToolItem(id: string): Promise<void> {
  const res = await fetch(`${BASE}/tools/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(await res.text())
}
