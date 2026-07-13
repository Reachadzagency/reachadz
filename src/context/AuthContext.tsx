import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react"
import { loadCollection, loadValue, saveValue, STORAGE_KEYS } from "@/lib/storage"
import { seedUsers } from "@/lib/seedData"
import { PermissionKey, User } from "@/types"
import { can } from "@/lib/permissions"
import { generateId } from "@/lib/utils"

interface AuthContextValue {
  currentUser: User | null
  users: User[]
  login: (email: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
  can: (key: PermissionKey) => boolean
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
  addUser: (user: Omit<User, "id" | "createdAt">) => User
  updateUser: (id: string, patch: Partial<User>) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => loadCollection<User>(STORAGE_KEYS.users, seedUsers))
  const [currentUserId, setCurrentUserId] = useState<string | null>(() =>
    loadValue<string | null>(STORAGE_KEYS.currentUserId, null)
  )

  useEffect(() => {
    saveValue(STORAGE_KEYS.currentUserId, currentUserId)
  }, [currentUserId])

  useEffect(() => {
    // keep users collection persisted (created/edited from Settings later)
    saveValue(STORAGE_KEYS.users, users)
  }, [users])

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId) ?? null,
    [users, currentUserId]
  )

  function login(email: string, password: string) {
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    if (!user) return { ok: false, error: "Aucun compte trouvé avec cet email." }
    if (!user.active) return { ok: false, error: "Ce compte est désactivé." }
    if (user.password !== password) return { ok: false, error: "Mot de passe incorrect." }
    setCurrentUserId(user.id)
    return { ok: true }
  }

  function logout() {
    setCurrentUserId(null)
  }

  function addUser(user: Omit<User, "id" | "createdAt">) {
    const created: User = { ...user, id: generateId("user"), createdAt: new Date().toISOString() }
    setUsers((prev) => [...prev, created])
    return created
  }

  function updateUser(id: string, patch: Partial<User>) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)))
  }

  const value: AuthContextValue = {
    currentUser,
    users,
    login,
    logout,
    can: (key) => can(currentUser, key),
    setUsers,
    addUser,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
