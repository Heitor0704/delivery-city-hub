
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
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
            navigate('/login', { replace: true });
        }
      } else {
        // Se não estiver autenticado, redireciona para a página de login
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, isLoading]);

  // Exibir um indicador de carregamento enquanto isLoading for true
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500 mb-4" />
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return null;
};

export default Index;
