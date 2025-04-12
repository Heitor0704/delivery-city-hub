
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
              <Route path="/owner/menu" element={<div className="p-4">Página de Cardápio em construção</div>} />
              <Route path="/owner/orders" element={<div className="p-4">Página de Pedidos em construção</div>} />
              <Route path="/owner/payments" element={<div className="p-4">Página de Pagamentos em construção</div>} />
              <Route path="/owner/reports" element={<div className="p-4">Página de Relatórios em construção</div>} />
              <Route path="/owner/settings" element={<div className="p-4">Página de Configurações em construção</div>} />

              {/* Rotas do gerente da cidade */}
              <Route path="/city-manager-dashboard" element={<CityManagerDashboard />} />
              <Route path="/city-manager/stores" element={<div className="p-4">Página de Estabelecimentos em construção</div>} />
              <Route path="/city-manager/deliverers" element={<div className="p-4">Página de Entregadores em construção</div>} />
              <Route path="/city-manager/commissions" element={<div className="p-4">Página de Comissões em construção</div>} />
              <Route path="/city-manager/categories" element={<div className="p-4">Página de Categorias em construção</div>} />
              <Route path="/city-manager/reports" element={<div className="p-4">Página de Relatórios em construção</div>} />
              <Route path="/city-manager/settings" element={<div className="p-4">Página de Configurações em construção</div>} />

              {/* Rotas do administrador */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin/cities" element={<div className="p-4">Página de Cidades em construção</div>} />
              <Route path="/admin/managers" element={<div className="p-4">Página de Gerentes em construção</div>} />
              <Route path="/admin/companies" element={<div className="p-4">Página de Empresas em construção</div>} />
              <Route path="/admin/commissions" element={<div className="p-4">Página de Comissões em construção</div>} />
              <Route path="/admin/reports" element={<div className="p-4">Página de Relatórios em construção</div>} />
              <Route path="/admin/settings" element={<div className="p-4">Página de Configurações em construção</div>} />

              {/* Rotas compartilhadas */}
              <Route path="/profile" element={<div className="p-4">Página de Perfil em construção</div>} />
              <Route path="/settings" element={<div className="p-4">Página de Configurações em construção</div>} />
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
