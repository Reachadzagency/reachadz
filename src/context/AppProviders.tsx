import { ReactNode } from "react"
import { ThemeProvider } from "@/context/ThemeContext"
import { AgencySettingsProvider } from "@/context/AgencySettingsContext"
import { AuthProvider } from "@/context/AuthContext"
import { NotificationsProvider } from "@/context/NotificationsContext"
import { AuditLogProvider } from "@/context/AuditLogContext"
import { ClientsProvider } from "@/context/ClientsContext"
import { TeamProvider } from "@/context/TeamContext"
import { OrdersProvider } from "@/context/OrdersContext"
import { ProjetsProvider } from "@/context/ProjetsContext"
import { FinanceProvider } from "@/context/FinanceContext"
import { ToolAccessProvider } from "@/context/ToolAccessContext"
import { AcademyProvider } from "@/context/AcademyContext"

/**
 * Single place that wires up every context provider in the right order.
 * App.tsx just renders <AppProviders> once — add new contexts here only.
 *
 * Order matters: Auth/Notifications/AuditLog come first because Orders
 * and Projets call useNotifications()/useAuditLog() internally.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AgencySettingsProvider>
        <AuthProvider>
          <NotificationsProvider>
            <AuditLogProvider>
              <ClientsProvider>
                <TeamProvider>
                  <FinanceProvider>
                    <ToolAccessProvider>
                      <AcademyProvider>
                        <OrdersProvider>
                          <ProjetsProvider>{children}</ProjetsProvider>
                        </OrdersProvider>
                      </AcademyProvider>
                    </ToolAccessProvider>
                  </FinanceProvider>
                </TeamProvider>
              </ClientsProvider>
            </AuditLogProvider>
          </NotificationsProvider>
        </AuthProvider>
      </AgencySettingsProvider>
    </ThemeProvider>
  )
}
