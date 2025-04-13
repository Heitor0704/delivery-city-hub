
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    console.log("Index page - Auth state:", { isAuthenticated, user });
    
    if (isAuthenticated && user) {
      console.log("Redirecting authenticated user with role:", user.role);
      toast.success(`Bem-vindo, ${user.name || "usuário"}!`);
      
      // Using the role mapped from tipo_usuario in the Usuarios table
      switch (user.role) {
        case "owner":
          console.log("Redirecting to owner dashboard");
          navigate('/owner-dashboard', { replace: true });
          break;
        case "cityManager":
          console.log("Redirecting to city manager dashboard");
          navigate('/city-manager-dashboard', { replace: true });
          break;
        case "admin":
          console.log("Redirecting to admin dashboard");
          navigate('/admin-dashboard', { replace: true });
          break;
        default:
          console.log("Unknown role, redirecting to login page");
          toast.error("Tipo de usuário não reconhecido");
          navigate('/', { replace: true });
      }
    } else if (!isAuthenticated) {
      console.log("User not authenticated, staying on login page");
      // User remains on current page (login) if not authenticated
    }
  }, [isAuthenticated, user, navigate]);

  // This page only handles redirects
  return null;
};

export default Index;
