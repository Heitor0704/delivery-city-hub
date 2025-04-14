
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import DashboardLayout from "@/components/layout/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import LogoutPage from "@/pages/LogoutPage";
import OwnerDashboard from "@/pages/OwnerDashboard";
import CityManagerDashboard from "@/pages/CityManagerDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFoundPage from "@/pages/NotFoundPage";

// Owner pages
import OwnerOrders from "@/pages/owner/Orders";
import OwnerMenu from "@/pages/owner/Menu";
import OwnerProducts from "@/pages/owner/Products";
import OwnerPayments from "@/pages/owner/Payments";
import OwnerReports from "@/pages/owner/Reports";
import OwnerSettings from "@/pages/owner/Settings";

// City Manager pages
import CityManagerStores from "@/pages/city-manager/Stores";
import CityManagerDeliverers from "@/pages/city-manager/Deliverers";
import CityManagerRegistrations from "@/pages/city-manager/Registrations";
import CityManagerCommissions from "@/pages/city-manager/Commissions";
import CityManagerReports from "@/pages/city-manager/Reports";
import CityManagerSettings from "@/pages/city-manager/Settings";
import CityManagerOrders from "@/pages/city-manager/Orders";

// Admin pages
import AdminCities from "@/pages/admin/Cities";
import AdminManagers from "@/pages/admin/Managers";
import AdminCompanies from "@/pages/admin/Companies";
import AdminRegistrations from "@/pages/admin/Registrations";
import AdminFinancials from "@/pages/admin/Financials";
import AdminReports from "@/pages/admin/Reports";
import AdminSettings from "@/pages/admin/Settings";

const queryClient = new QueryClient();

// Componente de proteção de rota
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Componente de redirecionamento para dashboard adequado
const DashboardRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  switch (user.role) {
    case "owner":
      return <Navigate to="/owner-dashboard" replace />;
    case "cityManager":
      return <Navigate to="/city-manager-dashboard" replace />;
    case "admin":
      return <Navigate to="/admin-dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />

            {/* Rotas protegidas - Shared Layout */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardRedirect />} />
              
              {/* Rotas do dono do estabelecimento */}
              <Route path="/owner-dashboard" element={<OwnerDashboard />} />
              <Route path="/owner/orders" element={<OwnerOrders />} />
              <Route path="/owner/menu" element={<OwnerMenu />} />
              <Route path="/owner/products" element={<OwnerProducts />} />
              <Route path="/owner/payments" element={<OwnerPayments />} />
              <Route path="/owner/reports" element={<OwnerReports />} />
              <Route path="/owner/settings" element={<OwnerSettings />} />

              {/* Rotas do gerente da cidade */}
              <Route path="/city-manager-dashboard" element={<CityManagerDashboard />} />
              <Route path="/city-manager/stores" element={<CityManagerStores />} />
              <Route path="/city-manager/deliverers" element={<CityManagerDeliverers />} />
              <Route path="/city-manager/registrations" element={<CityManagerRegistrations />} />
              <Route path="/city-manager/commissions" element={<CityManagerCommissions />} />
              <Route path="/city-manager/reports" element={<CityManagerReports />} />
              <Route path="/city-manager/settings" element={<CityManagerSettings />} />
              <Route path="/city-manager/orders" element={<CityManagerOrders />} />

              {/* Rotas do administrador */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin/cities" element={<AdminCities />} />
              <Route path="/admin/managers" element={<AdminManagers />} />
              <Route path="/admin/companies" element={<AdminCompanies />} />
              <Route path="/admin/coupons" element={<AdminRegistrations />} />
              <Route path="/admin/financials" element={<AdminFinancials />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/settings" element={<AdminSettings />} />

              {/* Rotas compartilhadas - Removida a rota de perfil */}
              <Route path="/settings" element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* Rota 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
