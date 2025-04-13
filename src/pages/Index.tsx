
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    console.log("Index page - Auth state:", { isAuthenticated, user });
    
    if (isAuthenticated && user) {
      console.log("Redirecting authenticated user with role:", user.role);
      
      // Usando o role mapeado do tipo_usuario da tabela Usuarios
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
          console.log("Unknown role, redirecting to root");
          navigate('/', { replace: true });
      }
    } else if (!isAuthenticated) {
      console.log("User not authenticated, staying on login page");
      // Deixamos na página atual (login) se o usuário não estiver autenticado
    }
  }, [isAuthenticated, user, navigate]);

  // Esta página apenas redireciona
  return null;
};

export default Index;
