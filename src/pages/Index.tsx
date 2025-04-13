
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    // Aguardar o carregamento da autenticação
    if (isLoading) return;
    
    if (isAuthenticated && user) {
      console.log("User authenticated, redirecting to appropriate dashboard");
      // Se estiver autenticado, redireciona para o dashboard apropriado
      switch (user.role) {
        case "owner":
          navigate('/owner-dashboard', { replace: true });
          break;
        case "cityManager":
          navigate('/city-manager-dashboard', { replace: true });
          break;
        case "admin":
          navigate('/admin-dashboard', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    } else {
      console.log("User not authenticated, staying on login page");
      // Se não estiver autenticado, permanece na página inicial (login)
    }
  }, [isAuthenticated, user, navigate, isLoading]);

  // Exibir um estado de carregamento enquanto verifica a autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  // Se não estiver autenticado ou ainda estiver carregando, não faz nada (exibe o login)
  return null;
};

export default Index;
