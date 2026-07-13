import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { PermissionKey } from "@/types"

/**
 * Wrap routes with this to require a logged-in user, and optionally a
 * specific permission (e.g. only admins/managers can see Settings).
 */
export function ProtectedRoute({ requires }: { requires?: PermissionKey }) {
  const { currentUser, can } = useAuth()

  if (!currentUser) return <Navigate to="/login" replace />
  if (requires && !can(requires)) return <Navigate to="/" replace />

  return <Outlet />
}
