import { useCallback, useEffect, useState } from "react"
import { loadCollection, saveCollection } from "@/lib/storage"
import { generateId } from "@/lib/utils"

interface WithId {
  id: string
  deletedAt?: string | null
}

/**
 * Generic CRUD store backed by localStorage (see lib/storage.ts).
 * Every domain context (Orders, Projets, Clients, Team, Expenses, Incomes...)
 * is a thin wrapper around this same hook, so they all behave identically
 * and only the storage key + seed data differ.
 */
export function useEntityStore<T extends WithId>(storageKey: string, seed: T[]) {
  const [items, setItems] = useState<T[]>(() => loadCollection<T>(storageKey, seed))

  useEffect(() => {
    saveCollection(storageKey, items)
  }, [storageKey, items])

  const add = useCallback((entity: Omit<T, "id"> & { id?: string }) => {
    const withId = { ...entity, id: entity.id ?? generateId() } as T
    setItems((prev) => [withId, ...prev])
    return withId
  }, [])

  const update = useCallback((id: string, patch: Partial<T>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }, [])

  /** Soft-delete: sets deletedAt so it shows up in Trash instead of disappearing. */
  const softDelete = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, deletedAt: new Date().toISOString() } : item))
    )
  }, [])

  const restore = useCallback((id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, deletedAt: null } : item)))
  }, [])

  /** Permanent delete — only used from the Trash page, with a confirmation dialog. */
  const hardDelete = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const active = items.filter((i) => !i.deletedAt)
  const trashed = items.filter((i) => !!i.deletedAt)

  return { items, active, trashed, add, update, softDelete, restore, hardDelete, setItems }
}
