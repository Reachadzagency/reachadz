import { Routes, Route } from "react-router-dom"
import { AppProviders } from "@/context/AppProviders"
import { AppShell } from "@/components/layout/AppShell"
import { ProtectedRoute } from "@/routes/ProtectedRoute"
import LoginPage from "@/pages/LoginPage"
import DashboardPage from "@/pages/DashboardPage"
import OrdersPage from "@/pages/OrdersPage"
import OrderDetailPage from "@/pages/OrderDetailPage"
import ProjetsPage from "@/pages/ProjetsPage"
import ProjetDetailPage from "@/pages/ProjetDetailPage"
import ClientsPage from "@/pages/ClientsPage"
import ClientDetailPage from "@/pages/ClientDetailPage"
import EditorsPage from "@/pages/EditorsPage"
import FilmmakersPage from "@/pages/FilmmakersPage"
import DesignersPage from "@/pages/DesignersPage"
import MediaBuyersPage from "@/pages/MediaBuyersPage"
import CalendarPage from "@/pages/CalendarPage"
import ExpensesPage from "@/pages/ExpensesPage"
import IncomesPage from "@/pages/IncomesPage"
import AnalyticsPage from "@/pages/AnalyticsPage"
import ToolAccessPage from "@/pages/ToolAccessPage"
import AuditLogPage from "@/pages/AuditLogPage"
import TrashPage from "@/pages/TrashPage"
import AcademyPage from "@/pages/AcademyPage"
import SettingsPage from "@/pages/SettingsPage"

export default function App() {
  return (
    <AppProviders>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />

            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/projets" element={<ProjetsPage />} />
            <Route path="/projets/:id" element={<ProjetDetailPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/:id" element={<ClientDetailPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/team/editors" element={<EditorsPage />} />
            <Route path="/team/filmmakers" element={<FilmmakersPage />} />
            <Route path="/team/designers" element={<DesignersPage />} />
            <Route path="/team/media-buyers" element={<MediaBuyersPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/incomes" element={<IncomesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/tool-access" element={<ToolAccessPage />} />
            <Route path="/audit-log" element={<AuditLogPage />} />
            <Route path="/trash" element={<TrashPage />} />
            <Route path="/academy" element={<AcademyPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </AppProviders>
  )
}
